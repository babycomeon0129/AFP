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
      /** 「登入1-1-3」APP訪問 */
      if  (typeof params.deviceType !== 'undefined' && this.appService.isApp === 1) {
        // App (接收App queryParams：isApp, deviceType, deviceCode)
        this.oauthService.loginRequest.deviceType = Number(params.deviceType);
        this.oauthService.loginRequest.fromOriginUri = '/Login'; // APP返回預設
      } else {
        // Web
        this.oauthService.loginRequest.deviceType = 0;
        this.oauthService.loginRequest.fromOriginUri = localStorage.getItem('M_fromOriginUri');
      }
      localStorage.setItem('M_deviceType', this.oauthService.loginRequest.deviceType.toString());
      this.oauthService.loginRequest.deviceCode =
        (typeof params.deviceCode !== 'undefined') ? params.deviceCode : localStorage.getItem('M_DeviceCode');


      /** 「登入2-1」 艾斯身份識別登入成功後，由Redirect API取得grantCode及List_MultipleUser */
      if (typeof params.loginJson !== 'undefined') {
        const loginJson = JSON.parse(params.loginJson);
        if (loginJson.errorCode === '996600001') {
          if (typeof loginJson.data.grantCode !== 'undefined') {
            localStorage.setItem('M_grantCode', loginJson.data.grantCode);
          }
          console.log('2-1Redirect API:', loginJson.data.grantCode, loginJson.data.List_MultipleUser);
          /** 「登入2-2」多重帳號頁面渲染 */
          if (loginJson.data.List_MultipleUser !== null) {
            this.viewType = 1;
            this.List_MultipleUser = loginJson.data.List_MultipleUser;
            console.log('2-2List_MultipleUser', this.List_MultipleUser);
          }
        } else {
          const content = `登入註冊失敗<br>錯誤代碼：${params.errorCode}<br>請重新登入註冊`;
          this.modal.show('message', {
            class: 'modal-dialog-centered',
            initialState: { success: true, message: content, showType: 3, checkBtnMsg: '我知道了', checkBtnUrl: '/Login' } });
        }
      }
    });
  }

  ngOnInit() {
    this.getViewData();
    this.onGetTokenApi();
    /** 「登入4-1」M_upgrade=1代表曾經登入過不跳公告頁，直接至艾斯身份識別登入 */
    if (localStorage.getItem('M_upgrade') === '1') {
      console.log('4-1', this.viewData);
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
      localStorage.setItem('M_viewData', JSON.stringify(data));
      this.viewList = Object.entries(data).map(([key, val]) => {
        return {name: key, value: val};
      });
      this.appService.blockUI.stop();
    });
  }

  onLoginEyes() {
    /** 「登入1-3」FORM POST給艾斯識別(M_upgrade:1 代表不再顯示公告頁) */
    localStorage.setItem('M_upgrade', '1');
    (document.getElementById('oauthLoginForm') as HTMLFormElement).submit();
  }

  onGetTokenApi() {
    /** 「登入3-1」曾經登入過且點擊過公告頁登入註冊按鈕，可取得Response中的idToken */
    if (localStorage.getItem('M_grantCode') !== null && localStorage.getItem('M_upgrade') === '1') {
      const request = {
        grantCode: localStorage.getItem('M_grantCode'),
        uuid: this.uuid || null,
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
          setTimeout(() => {
            this.appService.blockUI.stop();
            const uri = (localStorage.getItem('M_fromOriginUri') !== null) ? localStorage.getItem('M_fromOriginUri') : '/' ;
            this.router.navigate([uri]);
          }, 1500);
        } else {
          const content = `登入註冊失敗<br>錯誤代碼：${tokenData.errorCode}<br>請重新登入註冊`;
          this.modal.show('message', {
            class: 'modal-dialog-centered',
            initialState: { success: true, message: content, showType: 3, checkBtnMsg: '我知道了', checkBtnUrl: '/Login' } });
        }
      });
    }
  }


  ngAfterViewInit() {
  }
  // onSubmit(form: NgForm) {
  //   localStorage.setItem('M_loginCheckBox', form.value.loginCheck);
  // }

}
