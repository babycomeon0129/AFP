import { CookieService } from 'ngx-cookie-service';
import { BlockUI } from 'ng-block-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService, ResponseTokenApi, OauthLoginViewConfig } from '@app/modules/oauth/oauth.service';
import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { ModalService } from '@app/shared/modal/modal.service';
import { environment } from '@env/environment';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';

@Component({
  selector: 'app-oauth-login',
  templateUrl: './oauth-login.component.html',
  styleUrls: ['./oauth-login.component.scss',
    '../../../../styles/layer/shopping-footer.scss'],
})
export class OauthLoginComponent implements OnInit, AfterViewInit {
  /** 頁面切換 0:帳號升級公告 1:帳號整併 */
  public viewType = 0;
  /** 艾斯身份識別登入API uri */
  public AuthorizationUri: string;
  /** 艾斯身份識別登入 列表 */
  public viewData: OauthLoginViewConfig[] = [];
  /** 艾斯身份識別登入 FormPost渲染 */
  public viewList = [];
  /** 多重帳號列表 */
  public List_MultipleUser = [];
  /** 使用者uuid */
  public uuid: string;
  /** 使用者grantCode */
  public grantCode: string;

  constructor(public appService: AppService, public oauthService: OauthService, private router: Router,
              public el: ElementRef, private activatedRoute: ActivatedRoute, public modal: ModalService,
              private callApp: AppJSInterfaceService, private cookieService: CookieService) {

    this.activatedRoute.queryParams.subscribe(params => {
      /** 「登入1-1-3」APP訪問，接收queryParams */
      if (typeof params.deviceType !== 'undefined' && this.appService.isApp === 1) {
        // App (接收App queryParams：isApp, deviceType, deviceCode)
        this.oauthService.loginRequest.deviceType = Number(params.deviceType);
        this.oauthService.loginRequest.fromOriginUri = '/Login'; // APP返回預設
      } else {
        // Web（其他活動頁帶queryParams，按鈕帶pathname）
        this.oauthService.loginRequest.deviceType = 0;
        this.oauthService.loginRequest.fromOriginUri =
          (typeof params.fromOriginUri !== 'undefined') ? params.fromOriginUri : localStorage.getItem('M_fromOriginUri');
      }
      localStorage.setItem('M_deviceType', this.oauthService.loginRequest.deviceType.toString());
      this.oauthService.loginRequest.deviceCode =
        (typeof params.deviceCode !== 'undefined') ? params.deviceCode : localStorage.getItem('M_DeviceCode');


      /** 「登入1-1-4」初始取得viewConfig資料 */
      if (typeof params.loginJson === 'undefined') {
        this.getViewData();
      } else {
        /** 「登入2-1」 艾斯身份識別登入成功後，由Redirect API取得grantCode及List_MultipleUser */
        const loginJson = JSON.parse(params.loginJson);
        if (loginJson.errorCode === '996600001') {
          if (typeof loginJson.data.grantCode !== 'undefined') {
            localStorage.setItem('M_grantCode', loginJson.data.grantCode);
            this.grantCode = loginJson.data.grantCode;
          }
          console.log('2-1Redirect API:', loginJson.data.grantCode, loginJson.data.List_MultipleUser);
          /** 「登入2-2」多重帳號頁面渲染 */
          if (loginJson.data.List_MultipleUser !== null) {
            this.viewType = 1;
            this.List_MultipleUser = loginJson.data.List_MultipleUser;
            console.log('2-2List_MultipleUser', this.List_MultipleUser);
          }
        } else {
          this.appService.onLogout();
          const content = `登入註冊失敗<br>錯誤代碼：${params.errorCode}<br>請重新登入註冊!`;
          this.modal.show('message', {
            class: 'modal-dialog-centered',
            initialState: { success: true, message: content, showType: 3, checkBtnMsg: '我知道了', checkBtnUrl: '/Login' } });
        }
      }
    });
  }

  ngOnInit() {
    /** 「登入3-1」已登入過艾斯(未有idToken)且非多重帳號，可取得idToken，則否讓使用者選完再取得idToken */
    if (localStorage.getItem('M_upgrade') === '1' && sessionStorage.getItem('M_idToken') === null
        && this.List_MultipleUser === undefined
    ) {
      this.onGetTokenApi(this.grantCode, this.uuid);
    }
    /** 「登入4-1」曾經登入成功過(已有idToken)，未登出 */
    if (localStorage.getItem('M_upgrade') === '1' && localStorage.getItem('M_viewData') !== null
      && sessionStorage.getItem('M_idToken') !== null) {
        this.viewType = 2;
        /** 「登入4-2」導回原頁 */
        this.appService.jumpUrl();
    }
  }
  getViewData() {
    /** 「登入1-2-1」AJAX提供登入所需Request給後端，以便response取得後端提供的資料 */
    this.appService.openBlock();
    this.viewType = 0;
    console.log(this.oauthService.loginRequest);
    (this.oauthService.toOauthRequest(this.oauthService.loginRequest)).subscribe((data: OauthLoginViewConfig) => {
      /** 「登入1-2-3」取得Response資料，讓Form渲染 */
      this.viewData = Object.assign(data);
      this.AuthorizationUri = data.AuthorizationUri;
      this.viewList = Object.entries(data).map(([key, val]) => {
        return {name: key, value: val};
      });
      this.appService.blockUI.stop();
    });
  }

  onLoginEyes() {
    /** 「登入1-3」點擊登入註冊按鈕FORM POST給艾斯識別(M_upgrade:1 代表不再顯示公告頁) */
    localStorage.setItem('M_upgrade', '1');
    (document.getElementById('oauthLoginForm') as HTMLFormElement).submit();
  }

  onGetTokenApi(code: string, uid: string) {
    this.viewType = 2;
    /** 「登入3-2」點擊過公告頁登入註冊按鈕(M_upgrade=1)，可取得Response中的idToken */
    if (localStorage.getItem('M_grantCode') !== null && localStorage.getItem('M_upgrade') === '1') {
      // grantCode只能使用一次，註冊Mobii新會員用
      const request = {
        grantCode: code,
        uuid: uid,
      };
      (this.oauthService.toTokenApi(JSON.stringify(request))).subscribe((data: ResponseTokenApi) => {
        console.log('2-3-2TokenApiResponse', JSON.stringify(data));
        /** 「登入3-2-1」取得idToken */
        const tokenData =  Object.assign(data);
        if (tokenData.errorCode === '996600001') {
          /** 「登入3-2-2」取得idToken帶入header:Authorization */
          sessionStorage.setItem('M_idToken', tokenData.data.idToken);
          this.cookieService.set('M_idToken', tokenData.data.idToken, 90, '/',
            environment.cookieDomain, environment.cookieSecure, 'Lax');
          this.appService.loginState = true;
          console.log('3-2idToken', tokenData.data.idToken);
          if (Number(localStorage.getItem('M_deviceType')) !== 0) {
            /** 「登入3-2-3」裝置若為APP傳interface */
            this.callApp.getLoginData(JSON.stringify(data));
          }
          /** 「登入3-2-4」導回原頁 */
          this.appService.openBlock();
          this.appService.jumpUrl();
        } else {
          this.appService.onLogout();
          const content = `登入註冊失敗<br>錯誤代碼：${tokenData.errorCode}<br>請重新登入註冊`;
          this.modal.show('message', {
            class: 'modal-dialog-centered',
            initialState: { success: true, message: content, showType: 3, checkBtnMsg: '我知道了', checkBtnUrl: '/Login' } });
        }
      });
    }
  }
  /** 帶假資料 */
  setIdToken() {
    this.appService.loginState = true;
    sessionStorage.setItem('M_idToken', 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxN2IyYTg5NS1lNGZmLTQ4MjktYWQwMC00NmE1ZDI3MDEyYWIiLCJhdWQiOiI3YTE5OGE5OC04NzFkLTRkMzYtODY2ZC0zYjI0NjQ4OGEyY2MiLCJvcGVuSWRQcm92aWRlciI6eyJuYW1lIjoiR29vZ2xlIiwicmVmSWQiOiI5NDQ1Y2FmMzE0ZWY1MzFlZDdlZmNiOTkyMDY0ZjJiOCJ9LCJleHAiOjE2MzM2OTM3NTIsImlhdCI6MTYzMzY1Nzc1MiwidXNlciI6eyJhY2NvdW50SWQiOiJkM2Y1M2E2MC1kYjcwLTExZTktOGEzNC0yYTJhZTJkYmNjZTQiLCJuYW1lIjoiQ2hsb2UgY2h1bmciLCJtb2JpbGUiOiI5MTAqKio0ODEiLCJpZCI6IjE3YjJhODk1LWU0ZmYtNDgyOS1hZDAwLTQ2YTVkMjcwMTJhYiIsImF2YXRhciI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdnODkxVFhpYVNBa3BqSEN1d2JleUMtNHQtZVI4TVdhN0xsVi1vRGxIYz1zOTYtYyIsImNvdW50cnlNY29kZSI6Ijg4NiIsInJlZ2lzdGVyRGF0ZSI6IjE2MzM2MDM1OTYifSwiaXNzIjoiZXllc21lZGlhLmNvbS50dyJ9.M-hmEaU-UrIJd0aF2sM4S4R4i8xIoSOf8ov5W6du6SaKQytBlrUUr8bISm7ih_WeRi4vfh4baTkBlU55qPEFu5ti92R-ToZk9a2weTPSQfwUYZp_OkBQfV5nAH_925qRYx5Cx4ELSbMWzGVMjDGWRewvu9gq5PDNHxZqiOc9FrznHOVz5FZU2HXm_vHJIY5vmw7pLjv3nK8HlcVJjXyI7G4QQZf1mr2GCXMD3DKKK0Yp5Q7DEacS7D2GkVqYROSIunMeKNddiJXwq_3kQ6SmgFZUcsen3QEvpN7-_OL_dExsdpfZ4M6lHP9nx2KUDhe2FbHzOwBTfsCgDNV-UsEJwQ');
    sessionStorage.setItem('M_upgrade', '1');
    localStorage.setItem('M_fromOriginUri', 'Member');
    const data = '{"idToken":"eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxN2IyYTg5NS1lNGZmLTQ4MjktYWQwMC00NmE1ZDI3MDEyYWIiLCJhdWQiOiI3YTE5OGE5OC04NzFkLTRkMzYtODY2ZC0zYjI0NjQ4OGEyY2MiLCJvcGVuSWRQcm92aWRlciI6eyJuYW1lIjoiR29vZ2xlIiwicmVmSWQiOiI5NDQ1Y2FmMzE0ZWY1MzFlZDdlZmNiOTkyMDY0ZjJiOCJ9LCJleHAiOjE2MzM2OTM3NTIsImlhdCI6MTYzMzY1Nzc1MiwidXNlciI6eyJhY2NvdW50SWQiOiJkM2Y1M2E2MC1kYjcwLTExZTktOGEzNC0yYTJhZTJkYmNjZTQiLCJuYW1lIjoiQ2hsb2UgY2h1bmciLCJtb2JpbGUiOiI5MTAqKio0ODEiLCJpZCI6IjE3YjJhODk1LWU0ZmYtNDgyOS1hZDAwLTQ2YTVkMjcwMTJhYiIsImF2YXRhciI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdnODkxVFhpYVNBa3BqSEN1d2JleUMtNHQtZVI4TVdhN0xsVi1vRGxIYz1zOTYtYyIsImNvdW50cnlNY29kZSI6Ijg4NiIsInJlZ2lzdGVyRGF0ZSI6IjE2MzM2MDM1OTYifSwiaXNzIjoiZXllc21lZGlhLmNvbS50dyJ9.M-hmEaU-UrIJd0aF2sM4S4R4i8xIoSOf8ov5W6du6SaKQytBlrUUr8bISm7ih_WeRi4vfh4baTkBlU55qPEFu5ti92R-ToZk9a2weTPSQfwUYZp_OkBQfV5nAH_925qRYx5Cx4ELSbMWzGVMjDGWRewvu9gq5PDNHxZqiOc9FrznHOVz5FZU2HXm_vHJIY5vmw7pLjv3nK8HlcVJjXyI7G4QQZf1mr2GCXMD3DKKK0Yp5Q7DEacS7D2GkVqYROSIunMeKNddiJXwq_3kQ6SmgFZUcsen3QEvpN7-_OL_dExsdpfZ4M6lHP9nx2KUDhe2FbHzOwBTfsCgDNV-UsEJwQ","Customer_Name":"MEIMEI","Customer_Code":"900053291372972","Customer_UUID":"dfa4s4","CustomerInfo":null,"List_UserFavourite":[]}}';
    this.callApp.getLoginData(JSON.stringify(data));
    this.router.navigate(['/Member']);
  }

  ngAfterViewInit() {
  }
  // onSubmit(form: NgForm) {
  //   localStorage.setItem('M_loginCheckBox', form.value.loginCheck);
  // }

}
