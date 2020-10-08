import { environment } from '../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AppService } from 'src/app/app.service';
import { ModalService } from 'src/app/service/modal.service';
import { AuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { NgForm } from '@angular/forms';
import { Request_AFPThird, Model_ShareData, Response_AFPLogin } from 'src/app/_models';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
declare var AppleID: any;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'modal-content',
  templateUrl: './login-modal.component.html',
})
export class LoginModalComponent implements OnInit {
  /** FB、Google 第三方登入 User容器 */
  private thirdUser: SocialUser;
  /** Apple 第三方登入 User容器 */
  private appleUser: Third_AppleUser;
  /** 是否正在使用FB或Google第三方登入(擋套件執行) */
  private regClick = false;
  /** 第三方登入 request */
  public thirdRequest: Request_AFPThird = new Request_AFPThird();
  /** Mobii 會員登入 request */
  public request: Request_AFPLogin = new Request_AFPLogin();
  /** 設備是否為Apple (是則不顯示Apple登入) */
  public isApple: boolean;

  constructor(
    public bsModalRef: BsModalRef, private authService: AuthService, private appService: AppService, public modal: ModalService,
    private cookieService: CookieService) {
      this.detectApple();
  }

  ngOnInit() {
    //  FB、Google 第三方登入取得資料
    this.authService.authState.subscribe((user) => {
      if (user != null && this.regClick) {
        this.appService.openBlock();
        this.thirdUser = user;
        if (user.provider === 'FACEBOOK' && user.email === undefined) {
          this.thirdRequest.Account = 'fb' + this.thirdUser.id;
        } else {
          this.thirdRequest.Account = this.thirdUser.email;
        }
        this.thirdRequest.NickName = this.thirdUser.name;
        this.thirdRequest.Token = this.thirdUser.id;
        this.thirdRequest.JsonData = JSON.stringify(this.thirdUser);
        this.toThirdLogin();
      }
      this.regClick = false;
    });

    // Apple 登入初始化 (會將按鈕樣式改為Apple設定的)
    AppleID.auth.init({
      clientId: 'com.eyesmedia.mobii',
      scope: 'email name',
      redirectURI: 'https://www.mobii.ai', // TODO: 正式/測試站, 結尾無"/" + environment.sit的api url
      state: 'Mobii Apple Login',
      usePopup : true
    });

    // Apple 登入授權成功，第三方登入取得資料
    document.addEventListener('AppleIDSignInOnSuccess', (authData: any) => {
      this.appleUser = authData.detail;
      const idTokenModel = jwt_decode(this.appleUser.authorization.id_token);
      const appleToken = idTokenModel.sub;

      // 只有首次使用Apple登入會得到user物件
      // if (this.appleUser.user === undefined) {
      //   this.thirdRequest.Account = '';
      //   this.thirdRequest.NickName = '';
      // } else {
      //   this.thirdRequest.Account = this.appleUser.user.email;
      //   this.thirdRequest.NickName = this.appleUser.user.name.firstName + ' ' + this.appleUser.user.name.lastName;
      // }
      this.thirdRequest.Account = idTokenModel.email;
      this.thirdRequest.NickName = idTokenModel.email;
      this.thirdRequest.Token = appleToken;
      this.thirdRequest.JsonData = JSON.stringify(this.appleUser);
      this.toThirdLogin();
    });

    // Apple 登入授權失敗，顯示失敗原因
    document.addEventListener('AppleIDSignInOnFailure', (error: any) => {
      this.bsModalRef.hide(); // 關閉視窗
      this.modal.show('message', { initialState: { success: false, message: 'Apple登入失敗', note: error.detail.error, showType: 1 } });
    });
  }

  /** 登入表單送出 */
  onSubmit(form: NgForm): void {
    this.appService.openBlock();
    this.request.Cart_Count = Number(this.cookieService.get('cart_count'));
    this.appService.toApi('AFPAccount', '1104', this.request).subscribe((data: Response_AFPLogin) => {
      sessionStorage.setItem('userName', data.Model_UserInfo.Customer_Name);
      sessionStorage.setItem('userCode', data.Model_UserInfo.Customer_Code);
      sessionStorage.setItem('CustomerInfo', data.Model_UserInfo.CustomerInfo);
      sessionStorage.setItem('userFavorites', JSON.stringify(data.List_UserFavourite));

      this.cookieService.set('userName', data.Model_UserInfo.Customer_Name, 90, '/', environment.cookieDomain, environment.cookieSecure);
      this.cookieService.set('userCode', data.Model_UserInfo.Customer_Code, 90, '/', environment.cookieDomain, environment.cookieSecure);
      this.cookieService.set('CustomerInfo', data.Model_UserInfo.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure);
      this.appService.loginState = true;
      this.bsModalRef.hide();
      this.appService.showFavorites();
      this.appService.readCart();
    });
  }

  /** FB登入按鈕 */
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.thirdRequest.Mode = 1;
    this.regClick = true;
  }

  /** Google登入按鈕 */
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.thirdRequest.Mode = 3;
    this.regClick = true;
  }

  /** Apple登入按鈕 */
  signInWithApple() {
    this.thirdRequest.Mode = 5;
  }

  /** 進行本站第三方登入 */
  toThirdLogin() {
    this.appService.toApi('AFPAccount', '1105', this.thirdRequest).subscribe((data: Response_AFPLogin) => {
      // 塞Session
      sessionStorage.setItem('userName', data.Model_UserInfo.Customer_Name);
      sessionStorage.setItem('userCode', data.Model_UserInfo.Customer_Code);
      sessionStorage.setItem('CustomerInfo', data.Model_UserInfo.CustomerInfo);
      sessionStorage.setItem('userFavorites', JSON.stringify(data.List_UserFavourite));
      sessionStorage.setItem('UUID', data.Model_UserInfo.Customer_UUID);
      // 塞local
      localStorage.setItem('UUID', sessionStorage.getItem('UUID'));

      this.cookieService.set('userName', data.Model_UserInfo.Customer_Name, 90, '/', environment.cookieDomain, environment.cookieSecure);
      this.cookieService.set('userCode', data.Model_UserInfo.Customer_Code, 90, '/', environment.cookieDomain, environment.cookieSecure);
      this.cookieService.set('CustomerInfo', data.Model_UserInfo.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure);
      this.cookieService.set('UUID', data.Model_UserInfo.Customer_UUID, 90, '/', environment.cookieDomain, environment.cookieSecure);
      this.appService.loginState = true;
      // 關閉視窗
      this.bsModalRef.hide();
      this.appService.showFavorites();
      this.appService.readCart();
    });
  }

  /** 判斷是否為Apple設備 */
  detectApple() {
    const iOSDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'];
    if (iOSDevices.includes(navigator.platform) || (navigator.userAgent.includes('Mac'))) {
      this.isApple = true;
    } else {
      this.isApple = false;
    }
  }
}

export class Request_AFPLogin extends Model_ShareData {
  AFPAccount: string;
  AFPPassword: string;
}

export class Third_AppleUser {
  authorization: {
    state: string;
    code: string;
    id_token: string;
  };
  user?: {
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
  };
}
