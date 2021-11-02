import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService, ResponseOauthApi, ViewConfig } from '@app/modules/oauth/oauth.service';
import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { environment } from '@env/environment';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';
import { BsModalService } from 'ngx-bootstrap';
import { MessageModalComponent } from '@app/shared/modal/message-modal/message-modal.component';

@Component({
  selector: 'app-oauth-login',
  templateUrl: './oauth-login.component.html',
  styleUrls: ['./oauth-login.component.scss',
    '../../../../styles/layer/shopping-footer.scss'],
})
export class OauthLoginComponent implements OnInit, AfterViewInit {

  /** 頁面切換 0:帳號升級公告 1:帳號整併 2:未登入(無idToken) 3:已登入(有idToken) */
  public viewType = '2';
  public viewTitle: string;
  /** 艾斯身份識別登入API uri */
  public AuthorizationUri: string;
  /** 艾斯身份識別登入 列表 */
  public viewData: ViewConfig[] = [];
  /** 艾斯身份識別登入 FormPost渲染 */
  public viewList = [];
  /** 多重帳號列表 */
  public List_MultipleUser = [];
  /** 使用者UserInfoId */
  public UserInfoId: number;
  /** 使用者grantCode */
  public grantCode = '';
  /** 登入憑證 */
  public M_idToken = this.cookieService.get('M_idToken');
  /** 「艾斯身份證別_登入」後端回傳資料 */
  public loginJsonData: object;
  // TODO 測試用
  // public temp: any;

  constructor(public appService: AppService, public oauthService: OauthService, private router: Router,
              public el: ElementRef, private activatedRoute: ActivatedRoute, public bsModalService: BsModalService,
              private callApp: AppJSInterfaceService, private cookieService: CookieService) {

    this.activatedRoute.queryParams.subscribe(params => {

      /** 「艾斯身份證別_登入1-1-2」接收queryParams */
      if (params.isApp === '1') {
        /** 「艾斯身份證別_登入1-1-1b」 App (接收App queryParams：isApp, deviceType, deviceCode) */
        this.oauthService.loginRequest.deviceType = Number(params.deviceType);
        localStorage.setItem('M_deviceType', params.deviceType);
        this.appService.isApp = params.isApp;
        this.oauthService.loginRequest.deviceCode = params.deviceCode;
      } else {
        /** 「艾斯身份證別_登入1-1-1a」活動頁帶返回頁參數 */
        this.oauthService.loginRequest.deviceType = 0;
        localStorage.setItem('M_deviceType', '0');
        if (typeof params.fromOriginUri !== 'undefined') {
          this.oauthService.loginRequest.fromOriginUri = params.fromOriginUri;
          localStorage.setItem('M_fromOriginUri', params.fromOriginUri);
        }
        this.oauthService.loginRequest.deviceCode = localStorage.getItem('M_DeviceCode');
      }

      if (typeof params.IdToken !== 'undefined' && params.IdToken !== null) {
        this.cookieService.set('M_idToken', params.IdToken, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      }
      /** 「艾斯身份證別_登入2-1」 艾斯身份識別登入成功後，由Redirect API取得grantCode及List_MultipleUser
       * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/30001-token-api-mobii
       */
      if (!this.M_idToken) {
        if (typeof params.loginJson !== 'undefined' && JSON.parse(params.loginJson).errorCode === '996600001') {
          const loginJson = JSON.parse(params.loginJson);
          this.viewType = '2';
          this.appService.isApp = loginJson.data.isApp;
          // 只能打一次，否則errorCode:609830001
          if (loginJson.data.grantCode) {
            this.grantCode = loginJson.data.grantCode;
            /** 「艾斯身份證別_登入2-2」多重帳號頁面渲染
             * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/30001-token-api-mobii
             */
            if (loginJson.data.List_MultipleUser) {
              /** 「艾斯身份證別_登入2-2-1」有多重帳號時，使用者點擊取得idToken */
              this.viewType = '1';
              this.List_MultipleUser = loginJson.data.List_MultipleUser;
              this.UserInfoId = loginJson.data.List_MultipleUser[0].UserInfoId;
            } else {
              /** 「艾斯身份證別_登入2-2-2」無多重帳號時，用grantCode取得idToken */
              this.onGetToken(loginJson.data.grantCode, 0);
            }
          }
        }
      } else if (this.M_idToken !== '' && this.M_idToken !== 'undefined') {
        this.onLoginOK();
      }

      /** 「艾斯身份證別_忘記密碼1」Redirect API由後端取得艾斯導頁 */
      if (params.forgetPassword === 'true' && (this.M_idToken !== '' && this.M_idToken !== 'undefined')) {
        this.onLoginOK();
      }

    });
  }

  ngOnInit() {
    // 避免直接貼上，導回Login頁
    if (localStorage.getItem('M_fromOriginUri') === '/Login') { localStorage.removeItem('M_fromOriginUri'); }

    // TODO 測試用
    // document.getElementById('loginRequest').innerHTML = this.temp +
    //     '<div>loginState: ' + this.appService.loginState + '</div>' +
    //     '<div>idToken: ' + this.M_idToken + '</div>';
    // console.log('ngOnInit viewType', this.viewType, localStorage.getItem('M_upgrade'), this.appService.isApp);
    // console.log('ngOnInit M_idToken', this.cookieService.get('M_idToken'));
    this.appService.openBlock();
    if (localStorage.getItem('M_upgrade') === null) {
      this.viewType = '0';
    }
    switch (this.viewType) {
      case '0':
        this.viewTitle = '帳號升級公告';
        this.getViewData();
        break;
      case '1':
        this.viewTitle = '帳號整併';
        break;
      case '2':
        this.getViewData();
        break;
      case '3':
        if (this.M_idToken !== '' && this.M_idToken !== 'undefined') {
          this.onLoginOK();
        } else {
          this.getViewData();
        }
        break;
      default:
        this.viewTitle = '';
        this.getViewData();
        break;
    }
  }

  getViewData() {
    /** 「艾斯身份證別_登入1-2-1」AJAX提供登入所需Request給後端，以便response取得後端提供的資料 */
    this.oauthService.toOauthRequest(this.oauthService.loginRequest).subscribe((data: ViewConfig) => {
      /** 「艾斯身份證別_登入1-2-3」取得Response資料，讓Form渲染 */
      this.viewData = Object.assign(data);
      this.AuthorizationUri = data.AuthorizationUri;
      this.viewList = Object.entries(data).map(([key, val]) => {
        return {name: key, value: val};
      });
      /** 「艾斯身份證別_登入4-1-1」曾經登入成功過(沒有idToken)，需等待form渲染後，再至艾斯登入 */
      if (this.viewList.length > 0 && !this.M_idToken &&
          localStorage.getItem('M_upgrade') === '1' && this.viewType === '2') {
        this.appService.openBlock();
        this.delaySubmit().then(() => {
          this.appService.blockUI.stop();
        });
      }
    });
  }

  onLoginEyes() {
    /** 「艾斯身份證別_登入1-3」點擊登入註冊按鈕FORM POST給艾斯識別(M_upgrade:1 代表不再顯示公告頁) */
    localStorage.setItem('M_upgrade', '1');
    (document.getElementById('oauthLoginForm') as HTMLFormElement).submit();
  }

  delaySubmit() {
    return new Promise(() => {
      setTimeout(() => {
        if (this.viewList.length > 0 && !this.M_idToken &&
          localStorage.getItem('M_upgrade') === '1' && this.viewType === '2') {
          (document.getElementById('oauthLoginForm') as HTMLFormElement).submit();
        }
      }, 2000);
    });
  }

  onGetToken(code: string, uid: number) {
    // 有grantCode禁止回上一頁
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', () => {
      history.pushState(null, null, document.URL);
    });
    /** 「艾斯身份證別_登入3-1」已登入過艾斯(未有idToken)且非多重帳號，點擊過公告頁登入註冊按鈕(M_upgrade=1)，可取得idToken，則否讓使用者選完再取得idToken
     * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/20001-redirect-api-mobii
     */
    if (code && code !== '') {
      if (!this.M_idToken) {
        // grantCode只能使用一次，註冊Mobii會員
        this.oauthService.grantRequest.grantCode = code;
        this.oauthService.grantRequest.UserInfoId = uid;
        /** 「艾斯身份證別_登入3-2-1」取得idToken */
        this.oauthService.toTokenApi(this.oauthService.grantRequest).subscribe((data: ResponseOauthApi) => {
          const tokenData =  Object.assign(data);
          if (tokenData.errorCode === '996600001') {
            /** 「艾斯身份證別_登入3-2-2」取得idToken帶入header:Authorization */
            sessionStorage.setItem('M_idToken', tokenData.data.idToken);
            sessionStorage.setItem('userName', tokenData.data.Customer_Name);
            sessionStorage.setItem('userCode', tokenData.data.Customer_Code);
            sessionStorage.setItem('userFavorites', JSON.stringify(tokenData.data.List_UserFavourite));
            this.cookieService.set('M_idToken', tokenData.data.idToken, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
            this.cookieService.set('userName', tokenData.data.Customer_Name, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
            this.cookieService.set('userCode', tokenData.data.Customer_Code, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
            this.appService.userName = tokenData.data.Customer_Name;
            this.appService.loginState = true;
            this.appService.userLoggedIn = true;
            this.appService.showFavorites();
            this.appService.readCart();
            this.viewType = '3';
            /** 「艾斯身份證別_登入3-2-3」裝置若為APP傳interface */
            if (this.appService.isApp === 1) {
              this.callApp.getLoginData(tokenData.data.idToken, tokenData.data.Customer_Code, tokenData.data.Customer_Name);
            } else {
              this.appService.jumpUrl();
            }
          // } else {
          //   const content = `登入註冊失敗<br>錯誤代碼：${tokenData.errorCode}<br>請重新登入註冊`;
          //   this.bsModalService.show(MessageModalComponent, {
          //     class: 'modal-dialog-centered',
          //     initialState: { success: true, message: content, showType: 2, checkBtnMsg: '我知道了' } });
          }
        });
      }
    }
  }

  /** 「艾斯身份證別_登入4-2」曾經登入成功過(有idToken)，登入狀態true，導回原頁 */
  onLoginOK() {
    console.log('login ok>>>>>>');
    this.appService.blockUI.stop();
    this.appService.loginState = true;
    this.appService.userLoggedIn = true;
    this.appService.showFavorites();
    this.appService.readCart();
    if (this.appService.isApp === 1) {
      this.callApp.getLoginData(this.cookieService.get('M_idToken'),
      this.cookieService.get('userCode'), this.cookieService.get('userCode'));
    } else {
      this.appService.jumpUrl();
    }
  }

  ngAfterViewInit() {
    this.appService.blockUI.stop();
  }

}
