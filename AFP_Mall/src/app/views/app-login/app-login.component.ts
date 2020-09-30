import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AppService } from 'src/app/app.service';
import { ModalService } from 'src/app/service/modal.service';
import { AuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { NgForm } from '@angular/forms';
import { Request_AFPThird, Model_ShareData, Model_CustomerInfo, AFP_UserFavourite } from 'src/app/_models';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Meta, Title } from '@angular/platform-browser';
import { Third_AppleUser } from '../../shared/modal/login-modal/login-modal.component';
import jwt_decode from 'jwt-decode';
declare var AppleID: any;

@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
})
export class AppLoginComponent implements OnInit {
  /** FB、Google 第三方登入 User容器 */
  thirdUser: SocialUser;
  /** Apple 第三方登入 User容器 */
  private appleUser: Third_AppleUser;
  /** 是否正在使用FB或Google第三方登入(擋套件執行) */
  regClick = false;
  /** 第三方登入 request */
  public thirdRequest: Request_AFPThird = new Request_AFPThird();
  /** Mobii 會員登入 request */
  public request: Request_AFPLogin = new Request_AFPLogin();
  /** 設備是否為Apple (是則不顯示Apple登入) */
  public isApple: boolean;
  /** 隱藏第三方登入 */
  // public hideThird = false;

  constructor(
    public bsModalRef: BsModalRef, private authService: AuthService, private appService: AppService, public modal: ModalService,
    private activatedRoute: ActivatedRoute, private cookieService: CookieService, private meta: Meta, private title: Title) {
    this.title.setTitle('AppLogin - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: 'AppLogin - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});

    this.detectApple();

    // App訪問
    this.activatedRoute.queryParams.subscribe(params => {
      if (typeof params.customerInfo !== 'undefined') {
        sessionStorage.setItem('CustomerInfo', encodeURIComponent(params.customerInfo));
      }
    });
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
      this.modal.show('message', { initialState: { success: false, message: 'Apple登入失敗', note: error.detail.error, showType: 1 } });
    });

    // if (this.isApple) {
    //   this.hideThird = false;
    // }
  }

  /** 登入表單送出 */
  onSubmit(form: NgForm): void {
    this.appService.openBlock();
    this.appService.toApi('AFPAccount', '1104', this.request).subscribe((data: Response_AFPLogin) => {
      sessionStorage.setItem('userName', data.Model_UserInfo.Customer_Name);
      sessionStorage.setItem('userCode', data.Model_UserInfo.Customer_Code);
      sessionStorage.setItem('CustomerInfo', data.Model_UserInfo.CustomerInfo);
      sessionStorage.setItem('userFavorites', JSON.stringify(data.List_UserFavourite));

      localStorage.setItem('userName', data.Model_UserInfo.Customer_Name);
      localStorage.setItem('userCode', data.Model_UserInfo.Customer_Code);
      localStorage.setItem('CustomerInfo', data.Model_UserInfo.CustomerInfo);

      this.cookieService.set('userName', data.Model_UserInfo.Customer_Name, 90);
      this.cookieService.set('userCode', data.Model_UserInfo.Customer_Code, 90);
      this.cookieService.set('CustomerInfo', data.Model_UserInfo.CustomerInfo, 90);
      this.appService.loginState = true;
      this.GoSuccess();
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

  /** 前往/AppLoginSuccess (APP接資料) */
  GoSuccess(): void {
    window.location.href = '/AppLoginSuccess';
    // this.router.navigate(['/AppLoginSuccess']);
  }

  /** 由APP進行本站第三方登入 */
  toThirdLogin() {
    this.appService.toApi('AFPAccount', '1105', this.thirdRequest).subscribe((data: Response_AFPLogin) => {
      // 塞Session
      sessionStorage.setItem('userName', data.Model_UserInfo.Customer_Name);
      sessionStorage.setItem('userCode', data.Model_UserInfo.Customer_Code);
      sessionStorage.setItem('CustomerInfo', data.Model_UserInfo.CustomerInfo);
      sessionStorage.setItem('userFavorites', JSON.stringify(data.List_UserFavourite));
      this.appService.loginState = true;
      this.GoSuccess();
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

export class Response_AFPLogin extends Model_ShareData {
  Model_UserInfo?: Model_CustomerInfo;
  List_UserFavourite?: AFP_UserFavourite;
}
