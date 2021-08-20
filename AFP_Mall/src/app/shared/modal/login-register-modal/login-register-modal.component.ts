import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '@env/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AppService } from 'src/app/app.service';
import { AuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { NgForm } from '@angular/forms';
import {
  Model_ShareData, Response_AFPLogin, Request_AFPAccount, Request_AFPVerifyCode,
  Response_AFPVerifyCode, Request_AFPReadMobile, Response_AFPReadMobile, Request_AFPThird
} from '@app/_models';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { ForgetModalComponent } from '../forget-modal/forget-modal.component';
declare var AppleID: any;

@Component({
  selector: 'app-login-register-modal',
  templateUrl: './login-register-modal.component.html',
  styleUrls: ['./login-register-modal.component.scss']
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
  /** 登入頁密碼是否可見 */
  public loginPswVisible = false;
  /** 註冊頁密碼1是否可見 */
  public regPsw1Visible = false;
  /** 註冊頁密碼2是否可見 */
  public regPsw2Visible = false;
  /** 註冊-重新發送驗證碼剩餘秒數 */
  public remainingSec = 0;
  /** 註冊-重新發送驗證碼倒數 timer */
  public vCodeTimer: NodeJS.Timer;
  /** 註冊-輸入帳號是否已存在 */
  public existingAccount = false;
  /** Apple登入 state */
  public signinState: string;
  /** api 路徑 */
  public apiUrl = environment.apiUrl;
  /** 新版第三方request (目前LINE使用) */
  public newThirdRequest: NewThirdRequest = new NewThirdRequest();

  constructor(
    public bsModalRef: BsModalRef, private authService: AuthService, private appService: AppService,
    private cookieService: CookieService, private router: Router, public bsModal: BsModalService) {
    this.detectApple();
  }

  ngOnInit() {
    //  FB、Google 第三方登入取得資料
    this.authService.authState.subscribe((user: SocialUser) => {
      this.thirdUser = user;
      if (this.thirdUser !== null && this.regClick) {
        this.appService.openBlock();
        if (user.provider === 'FACEBOOK' && user.email === undefined) {
          this.thirdRequest.Account = 'fb' + this.thirdUser.id;
        } else {
          this.thirdRequest.Account = this.thirdUser.email;
        }
        this.thirdRequest.NickName = this.thirdUser.name;
        this.thirdRequest.Token = this.thirdUser.id;
        this.thirdRequest.JsonData = JSON.stringify(this.thirdUser);
        this.toThirdLogin();
        this.regClick = false;
      }
    });

    this.signinState = this.appService.getState();

    // Apple 登入初始化 (會將按鈕樣式改為Apple設定的)
    AppleID.auth.init({
      clientId: 'com.eyesmedia.mobii',
      scope: 'email name',
      redirectURI: environment.AppleSignInURI,
      state: this.signinState,
      usePopup: true
    });

    // Apple 登入授權成功，第三方登入取得資料
    document.addEventListener('AppleIDSignInOnSuccess', (authData: CustomEvent) => {
      this.appleUser = authData.detail;
      // 驗證 apple 回傳的 state 是否與此次請求時送去的相同
      if (this.appleUser.authorization.state === this.signinState) {
        this.stopListeningApple();
        // 將 id token 解密取得使用者資訊
        const idTokenModel: any = jwt_decode(this.appleUser.authorization.id_token);
        const appleToken = idTokenModel.sub;
        this.thirdRequest.Account = idTokenModel.email;
        this.thirdRequest.NickName = idTokenModel.email;
        this.thirdRequest.Token = appleToken;
        this.thirdRequest.JsonData = JSON.stringify(this.appleUser);
        this.toThirdLogin();
      } else {
        // this.modal.show('message', { initialState: { success: false, message: 'Apple登入出現錯誤', showType: 1 } });
        this.bsModal.show(MessageModalComponent, { initialState: { success: false, message: 'Apple登入出現錯誤', showType: 1 } });
      }
    });

    // Apple 登入授權失敗，顯示失敗原因
    document.addEventListener('AppleIDSignInOnFailure', (error: any) => {
      this.stopListeningApple();
      this.bsModalRef.hide(); // 關閉視窗
      // 如果錯誤並非用戶直接關掉POPUP視窗，則跳錯誤訊息
      if (error.detail.error !== 'popup_closed_by_user') {
        // his.modal.show('message', { initialState: { success: false, message: 'Apple登入失敗', note: error.detail.error, showType: 1 } });
        this.bsModal.show(MessageModalComponent, { initialState: { success: false, message: 'Apple登入失敗', note: error.detail.error, showType: 1 } });
      }
    });

    // LINE登入資訊
    this.newThirdRequest.DeviceType = this.appService.isApp !== null ? '1' : '0';
    this.newThirdRequest.UserRedirectUri = this.router.url;
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

      this.cookieService.set('userName', data.Model_UserInfo.Customer_Name, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.set('userCode', data.Model_UserInfo.Customer_Code, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.set('CustomerInfo', data.Model_UserInfo.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.appService.userName = data.Model_UserInfo.Customer_Name;
      this.appService.loginState = true;
      this.appService.userLoggedIn = true;
      this.bsModalRef.hide();
      this.appService.showFavorites();
      this.appService.readCart();
      // 通知推播
      // this.appService.initPush();
      this.appService.getPushPermission();
    });
  }

  /** FB登入按鈕 */
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.thirdRequest.Mode = 1;
    this.regClick = true;
  }

  /** LINE 登入 */
  signInWithLine(form: NgForm): void {
    (document.getElementById('postLinelogin') as HTMLFormElement).submit();
    this.appService.openBlock();
  }

  /** Google登入按鈕 */
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.thirdRequest.Mode = 3;
    this.regClick = true;
  }

  /** Apple登入按鈕 */
  signInWithApple(): void {
    this.thirdRequest.Mode = 5;
  }

  /** 進行本站第三方登入 */
  toThirdLogin(): void {
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
      this.appService.userName = data.Model_UserInfo.Customer_Name;
      this.appService.loginState = true;
      this.appService.userLoggedIn = true;
      // 關閉視窗
      this.bsModalRef.hide();
      this.appService.showFavorites();
      this.appService.readCart();
      // 通知推播
      // this.appService.initPush();
      this.appService.getPushPermission();
    });
  }

  /** 註冊-發送手機驗證碼 */
  sendRegVCode(): void {
    this.appService.openBlock();
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
      // 如後端驗證成功，data才會有值，故先判斷是否成功再進行按鈕時間倒數
      if (data !== null) {
        this.remainingSec = 60;
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
      }
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
  onRegSubmit(): void {
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
      this.appService.userName = data.Model_UserInfo.Customer_Name;
      this.appService.loginState = true;
      this.appService.userLoggedIn = true;
      this.bsModalRef.hide();
      // 提示社群綁定
      const msg = `註冊成功！歡迎加入Mobii!\n小技巧：綁定您的社群帳號，未來就可快速登入囉！`;
      // this.modal.show('message', { initialState: { success: true, message: msg, showType: 6, leftBtnMsg: `下次再說`, rightBtnMsg: `立即綁定`, rightBtnUrl: `/Member/ThirdBinding` } });
      this.bsModal.show(MessageModalComponent, { initialState: { success: true, message: msg, showType: 6, leftBtnMsg: `下次再說`, rightBtnMsg: `立即綁定`, rightBtnUrl: `/Member/ThirdBinding` } });
      // 通知推播
      // this.appService.initPush();
      this.appService.getPushPermission();
    });
  }

  /** 跳至忘記密碼視窗 */
  goToforget(): void {
    this.bsModal.show(ForgetModalComponent);
    this.bsModalRef.hide();
  }

  /** 判斷是否為Apple設備 */
  detectApple(): void {
    const iOSDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'];
    if (iOSDevices.includes(navigator.platform) || (navigator.userAgent.includes('Mac'))) {
      this.isApple = true;
    } else {
      this.isApple = false;
    }
  }

  stopTimer(): void {
    clearInterval(this.vCodeTimer);
  }

  closeModal(): void {
    this.bsModalRef.hide();
    clearInterval(this.vCodeTimer);
  }

  /** 停止聽取Apple登入的DOM event */
  stopListeningApple(): void {
    document.removeEventListener('AppleIDSignInOnSuccess', (authData: any) => { });
    document.removeEventListener('AppleIDSignInOnFailure', (error: any) => { });
  }

  ngOnDestroy(): void {
    clearInterval(this.vCodeTimer);
    this.stopListeningApple();
  }
}

/** 登入 RequestModel */
class Request_AFPLogin extends Model_ShareData {
  /** 帳號 */
  AFPAccount: string;
  /** 密碼 */
  AFPPassword: string;
}

/** 第三方登入-Apple 登入 Response */
class Third_AppleUser {
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

/** 新版第三方登入Request */
class NewThirdRequest {
  /** 裝置類型 0: web 1:app */
  DeviceType: string;
  /** 用戶目前所在url */
  UserRedirectUri: string;
}
