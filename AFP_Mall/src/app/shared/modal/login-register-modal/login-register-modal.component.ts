import { environment } from '@env/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AppService } from 'src/app/app.service';
import { ModalService } from '../modal.service';
import { AuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { NgForm } from '@angular/forms';
import { Request_AFPThird, Model_ShareData, Response_AFPLogin, Request_AFPAccount, Request_AFPVerifyCode,
  Response_AFPVerifyCode, Request_AFPReadMobile, Response_AFPReadMobile } from '@app/_models';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
declare var AppleID: any;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-login-register-modal',
  templateUrl: './login-register-modal.component.html',
})
export class LoginRegisterModalComponent implements OnInit, OnDestroy {
  /** FB、Google 第三方登入 User容器 */
  private thirdUser: SocialUser;
  /** Apple 第三方登入 User容器 */
  private appleUser: Third_AppleUser;
  /** 是否正在使用FB或Google第三方登入(擋套件執行) */
  private regClick = false;
  /** 第三方登入 request */
  public thirdRequest: Request_AFPThird = new Request_AFPThird();
  /** Mobii 會員登入 request */
  public loginRequest: Request_AFPLogin = new Request_AFPLogin();
  /** 設備是否為Apple (是則不顯示Apple登入) */
  public isApple: boolean;
  /** 註冊 request */
  public registerRequest: Request_AFPAccount = {
    AFPType: 1,
    AFPAccountCTY: 886,
    AFPAccount: null,
    AFPPassword: null,
    Agree: false,
    VerifiedInfo: {
      VerifiedPhone: null,
      CheckValue: null,
      VerifiedCode: null
    }
  };
  // public registerRequest: Request_AFPAccount = new Request_AFPAccount();
  /** 登入頁密碼是否可見 */
  public loginPswVisible = false;
  /** 註冊頁密碼1是否可見 */
  public regPsw1Visible = false;
  /** 註冊頁密碼2是否可見 */
  public regPsw2Visible = false;
  /** 註冊-重新發送驗證碼剩餘秒數 */
  public remainingSec = 0;
  /** 註冊-重新發送驗證碼倒數 timer */
  public vCodeTimer;
  /** 註冊-輸入帳號是否已存在 */
  public existingAccount = false;

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
      redirectURI: 'https://www-uat.mobii.ai', // 正式/測試站, 結尾無"/" + environment.sit的api url
      state: 'Mobii Apple Login',
      usePopup : true
    });

    // Apple 登入授權成功，第三方登入取得資料
    document.addEventListener('AppleIDSignInOnSuccess', (authData: any) => {
      this.stopListeningApple();
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
      this.stopListeningApple();
      this.bsModalRef.hide(); // 關閉視窗
      this.modal.show('message', { initialState: { success: false, message: 'Apple登入失敗', note: error.detail.error, showType: 1 } });
    });
  }

  /** 登入表單送出 */
  onSubmit(form: NgForm): void {
    this.appService.openBlock();
    this.loginRequest.Cart_Count = Number(this.cookieService.get('cart_count'));
    this.appService.toApi('AFPAccount', '1104', this.loginRequest).subscribe((data: Response_AFPLogin) => {
      sessionStorage.setItem('userName', data.Model_UserInfo.Customer_Name);
      sessionStorage.setItem('userCode', data.Model_UserInfo.Customer_Code);
      sessionStorage.setItem('CustomerInfo', data.Model_UserInfo.CustomerInfo);
      sessionStorage.setItem('userFavorites', JSON.stringify(data.List_UserFavourite));

      // tslint:disable: max-line-length
      this.cookieService.set('userName', data.Model_UserInfo.Customer_Name, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.set('userCode', data.Model_UserInfo.Customer_Code, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.set('CustomerInfo', data.Model_UserInfo.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.appService.loginState = true;
      this.bsModalRef.hide();
      this.appService.showFavorites();
      this.appService.readCart();
      // 通知推播
      this.appService.initPush();
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
      this.cookieService.set('userName', data.Model_UserInfo.Customer_Name, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.set('userCode', data.Model_UserInfo.Customer_Code, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.set('CustomerInfo', data.Model_UserInfo.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.set('Mobii_ThirdLogin', 'true', 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.appService.loginState = true;
      // 關閉視窗
      this.bsModalRef.hide();
      this.appService.showFavorites();
      this.appService.readCart();
      // 通知推播
      this.appService.initPush();
    });
  }

  /** 註冊-發送手機驗證碼 */
  sendRegVCode() {
    this.remainingSec = 60;
    const request: Request_AFPVerifyCode = {
      SelectMode: 11,
      VerifiedAction: 1,
      VerifiedInfo: {
        VerifiedPhone: this.registerRequest.AFPAccount,
        CheckValue: null,
        VerifiedCode: null
      }
    };

    this.appService.toApi('AFPAccount', '1112', request).subscribe((data: Response_AFPVerifyCode) => {
      // 開始倒數
      this.vCodeTimer = setInterval(() => {
        this.remainingSec -= 1;
        if (this.remainingSec <= 0) {
          clearInterval(this.vCodeTimer);
        }
      }, 1000);
      // 接使用者編碼
      this.registerRequest.VerifiedInfo.CheckValue = data.VerifiedInfo.CheckValue;
      document.getElementById('registeredCheck1').focus();
    });
  }

  /** 檢查帳號是否已存在 */
  checkAccount(): void {
    if (this.registerRequest.AFPAccount.length < 10) {
      this.existingAccount = false;
    } else {
      const request: Request_AFPReadMobile = {
        User_Code: sessionStorage.getItem('userCode'),
        SelectMode: 2,
        UserAccount: this.registerRequest.AFPAccount
      };
      this.appService.toApi('Member', '1111', request).subscribe((data: Response_AFPReadMobile) => {
        this.existingAccount = data.IsExist;
      });
    }
  }

  /** 註冊送出 */
  onRegSubmit() {
    this.registerRequest.VerifiedInfo.VerifiedPhone = this.registerRequest.AFPAccount;
    this.appService.openBlock();
    this.appService.toApi('AFPAccount', '1101', this.registerRequest).subscribe((data: Response_AFPLogin) => {
      // 後端自動登入，前端直接接login response
      sessionStorage.setItem('userName', data.Model_UserInfo.Customer_Name);
      sessionStorage.setItem('userCode', data.Model_UserInfo.Customer_Code);
      sessionStorage.setItem('CustomerInfo', data.Model_UserInfo.CustomerInfo);

      this.cookieService.set('userName', data.Model_UserInfo.Customer_Name, 90, '/',
        environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.set('userCode', data.Model_UserInfo.Customer_Code, 90, '/',
        environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.set('CustomerInfo', data.Model_UserInfo.CustomerInfo, 90, '/',
        environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.appService.loginState = true;
      this.bsModalRef.hide();
      // 提示社群綁定
      const msg = `註冊成功！歡迎加入Mobii!\n小技巧：綁定您的社群帳號，未來就可快速登入囉！`;
      this.modal.show('message', { initialState: { success: true, message: msg, showType: 4 } });
      // 通知推播
      this.appService.initPush();
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

  stopTimer() {
    clearInterval(this.vCodeTimer);
  }

  closeModal() {
    this.bsModalRef.hide();
    clearInterval(this.vCodeTimer);
  }

  /** 停止聽取Apple登入的DOM event */
  stopListeningApple() {
    document.removeEventListener('AppleIDSignInOnSuccess', (authData: any) => {});
    document.removeEventListener('AppleIDSignInOnFailure', (error: any) => {});
  }

  ngOnDestroy() {
    clearInterval(this.vCodeTimer);
    this.stopListeningApple();
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
