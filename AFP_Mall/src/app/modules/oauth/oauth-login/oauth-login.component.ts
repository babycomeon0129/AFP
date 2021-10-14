import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService, ResponseIdTokenApi, ViewConfig } from '@app/modules/oauth/oauth.service';
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
  /** 頁面切換 0:帳號升級公告 1:帳號整併 2:曾登入(無idToken) 3:已登入(不處理) */
  public viewType: string;
  /** 艾斯身份識別登入API uri */
  public AuthorizationUri: string;
  /** 艾斯身份識別登入 列表 */
  public viewData: ViewConfig[] = [];
  /** 艾斯身份識別登入 FormPost渲染 */
  public viewList = [];
  /** 多重帳號列表 */
  public List_MultipleUser = [];
  /** 使用者UserInfoId */
  public UserInfoId: string;
  /** 使用者grantCode */
  public grantCode: string;

  constructor(public appService: AppService, public oauthService: OauthService, private router: Router,
              public el: ElementRef, private activatedRoute: ActivatedRoute, public bsModalService: BsModalService,
              private callApp: AppJSInterfaceService, private cookieService: CookieService) {

    this.activatedRoute.queryParams.subscribe(params => {
      /** 「艾斯身份證別-登入1-1-3」APP訪問，接收queryParams */
      if (typeof params.deviceType !== 'undefined' && this.appService.isApp === 1) {
        // App (接收App queryParams：isApp, deviceType, deviceCode)
        this.oauthService.loginRequest.deviceType = Number(params.deviceType);
        this.oauthService.loginRequest.fromOriginUri = '/Login'; // APP返回預設
      } else {
        // Web（其他活動頁帶queryParams，按鈕帶pathname）
        this.oauthService.loginRequest.deviceType = 0;
        if (typeof params.fromOriginUri !== 'undefined') {
          this.oauthService.loginRequest.fromOriginUri = params.fromOriginUri;
        }
      }
      localStorage.setItem('M_deviceType', this.oauthService.loginRequest.deviceType.toString());
      this.oauthService.loginRequest.deviceCode =
        (typeof params.deviceCode !== 'undefined') ? params.deviceCode : localStorage.getItem('M_DeviceCode');


      /** 「艾斯身份證別-登入1-1-4」初始取得viewConfig資料
       * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/10001-login-api-mobii
       */
      if (typeof params.loginJson === 'undefined' && this.cookieService.get('M_idToken') === '') {
        this.getViewData();
      }

      /** 「艾斯身份證別-登入2-1」 艾斯身份識別登入成功後，由Redirect API取得grantCode及List_MultipleUser
       * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/30001-token-api-mobii
       */
      if (typeof params.loginJson !== 'undefined') {
        const loginJson = JSON.parse(params.loginJson);
        if (loginJson.errorCode === '996600001') {
          // 只能打一次，否則errorCode:609830001
          if (typeof loginJson.data.grantCode !== 'undefined') {
            sessionStorage.setItem('M_grantCode', loginJson.data.grantCode);
            this.grantCode = loginJson.data.grantCode;
            console.log('2-1Redirect API:', loginJson.data.grantCode, loginJson.data.List_MultipleUser);
            /** 「艾斯身份證別-登入2-2」多重帳號頁面渲染
             * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/30001-token-api-mobii
             */
            if (loginJson.data.List_MultipleUser !== null) {
              this.viewType = '1';
              localStorage.setItem('M_viewType', '1');
              this.List_MultipleUser = loginJson.data.List_MultipleUser;
              this.UserInfoId = loginJson.data.List_MultipleUser[0].UserInfoId;
              console.log('2-2List_MultipleUser', this.List_MultipleUser);
            }
            if (loginJson.data.List_MultipleUser === null && localStorage.getItem('M_viewType') === '1') {
              /** 「艾斯身份證別-登入2-2」無多重帳號時，用grantCode取得idToken */
              this.onGetToken(this.grantCode, null);
            }
          }
        } else {
          this.appService.onLogout();
          const content = `登入註冊失敗<br>錯誤代碼：${params.errorCode}<br>請重新登入註冊!`;
          this.bsModalService.show(MessageModalComponent, {
            class: 'modal-dialog-centered',
            initialState: { success: true, message: content, showType: 3, checkBtnMsg: '我知道了', checkBtnUrl: '/Login' } });
        }
      }

      /** 「艾斯身份證別-忘記密碼1」Redirect API由後端取得艾斯導頁 */
      if (typeof params.forgetPassword !== 'undefined' && params.forgetPassword === 'true') {
        this.appService.jumpUrl();
      }

    });


  }

  ngOnInit() {
  }

  getViewData() {
    /** 「艾斯身份證別-登入1-2-1」AJAX提供登入所需Request給後端，以便response取得後端提供的資料 */
    (this.oauthService.toOauthRequest(this.oauthService.loginRequest)).subscribe((data: ViewConfig) => {
      /** 「艾斯身份證別-登入1-2-3」取得Response資料，讓Form渲染 */
      console.log('viewData', data);
      this.viewType = '0';
      localStorage.setItem('M_viewType', '0');
      this.viewData = Object.assign(data);
      this.AuthorizationUri = data.AuthorizationUri;
      this.viewList = Object.entries(data).map(([key, val]) => {
        return {name: key, value: val};
      });

      /** 「艾斯身份證別-登入4-1-1」曾經登入成功過(沒有idToken)，重新至艾斯登入 */
      // if (localStorage.getItem('M_viewType') === '2' && this.cookieService.get('M_idToken') !== '') {
      //   (this.oauthService.toEyesRequest(JSON.parse(JSON.stringify(data))))
      //     .subscribe((res: ResponseEyes) => {
      //       console.log('4-1-1', res);
      //   });
      // }
    });
  }

  onLoginEyes() {
    /** 「艾斯身份證別-登入1-3」點擊登入註冊按鈕FORM POST給艾斯識別(M_viewType:1 代表不再顯示公告頁) */
    localStorage.setItem('M_viewType', '1');
    (document.getElementById('oauthLoginForm') as HTMLFormElement).submit();
  }

  onGetToken(code: string, uid: string) {
    /** 「艾斯身份證別-登入3-1」已登入過艾斯(未有idToken)且非多重帳號，點擊過公告頁登入註冊按鈕(M_viewType=1)，可取得idToken，則否讓使用者選完再取得idToken
     * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/20001-redirect-api-mobii
     */
    localStorage.setItem('M_viewType', '2');
    this.cookieService.deleteAll();
    if (code !== undefined) {
      // grantCode只能使用一次，註冊Mobii會員
      const request = {
        grantCode: code,
        UserInfoId: uid,
      };
      /** 「艾斯身份證別-登入3-2-1」取得idToken */
      this.oauthService.toTokenApi(request).subscribe((data: ResponseIdTokenApi) => {
        console.log('3-2TokenApiResponse', JSON.stringify(data));
        const tokenData =  Object.assign(data);
        if (tokenData.errorCode === '996600001') {
          /** 「艾斯身份證別-登入3-2-2」取得idToken帶入header:Authorization */
          this.cookieService.set('M_idToken', tokenData.data.idToken, 90, '/',
            environment.cookieDomain, environment.cookieSecure, 'Lax');
          sessionStorage.setItem('userName', tokenData.data.Customer_Name);
          sessionStorage.setItem('userCode', tokenData.data.Customer_Code);
          sessionStorage.setItem('userFavorites', JSON.stringify(tokenData.data.List_UserFavourite));
          this.cookieService.set('userName', tokenData.data.Customer_Name, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
          this.cookieService.set('userCode', tokenData.data.Customer_Code, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
          this.appService.userName = tokenData.data.Customer_Name;
          this.appService.loginState = true;
          this.appService.userLoggedIn = true;
          this.appService.showFavorites();
          this.appService.readCart();
          console.log('3-2idToken', tokenData.data.idToken);
          if (localStorage.getItem('M_deviceType') !== '0') {
            /** 「艾斯身份證別-登入3-2-3」裝置若為APP傳interface */
            this.callApp.getLoginData(JSON.stringify(data));
          }
          /** 「艾斯身份證別-登入3-2-4」導回原頁 */
          this.appService.jumpUrl();
        } else {
          this.appService.onLogout();
          const content = `登入註冊失敗<br>錯誤代碼：${tokenData.errorCode}<br>請重新登入註冊`;
          this.bsModalService.show(MessageModalComponent, {
            class: 'modal-dialog-centered',
            initialState: { success: true, message: content, showType: 3, checkBtnMsg: '我知道了', checkBtnUrl: '/Login' } });
        }
      });
    }
  }

  ngAfterViewInit() {
  }

}
