import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService, RequestOauthLogin, OauthLoginViewConfig } from '@app/modules/oauth/oauth.service';
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

  public responseData: string;

  constructor(public appService: AppService, public oauthService: OauthService, private router: Router,
              public el: ElementRef, private activatedRoute: ActivatedRoute, public modal: ModalService,
              private callApp: AppJSInterfaceService) {

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
            initialState: { success: true, message: content, showType: 3, checkBtnMsg: `我知道了`, checkBtnUrl: `/Login` } });
        }
      }
    });
  }

  ngOnInit() {
    this.getViewData();
    this.onGetTokenApi();
    /** 曾經登入過且點擊過公告頁登入註冊按鈕 */
    if (localStorage.getItem('M_upgrade') === 'oauthLoginForm') {
      if (localStorage.getItem('M_grantCode') !== null) { this.grantCode = localStorage.getItem('M_grantCode'); }
      this.viewType = 2;
    }
  }
  getViewData() {
    /** 「登入1-2-1」AJAX提供登入所需Request給後端，以便response取得後端提供的資料 */
    this.appService.openBlock();
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
    /** 「登入1-3」FORM POST給艾斯識別 */
    localStorage.setItem('M_upgrade', 'oauthLoginForm');
    (document.getElementById('oauthLoginForm') as HTMLFormElement).submit();
  }

  onGetTokenApi() {
    /** 「登入2-2」取得Response中的idToken */
    // this.appService.openBlock();
    if (localStorage.getItem('M_grantCode') !== null) {
      const request = {
        grantCode: localStorage.getItem('M_grantCode'),
        uuid: this.uuid || null,
      };
      (this.oauthService.toTokenApi(JSON.stringify(request))).subscribe((data: any) => {
        if (Number(localStorage.getItem('M_deviceType')) === 0) {
          console.log('2-3-2TokenApiResponse', data);
          this.responseData = JSON.stringify(data);
        } else {
          /** 「登入2-4」裝置若為APP傳interface */
          this.callApp.getLoginData(data);
        }
      });
    }
  }

  onClearStorage() {
    localStorage.removeItem('M_upgrade');
    localStorage.removeItem('M_grantCode');
    this.router.navigate(['/Login/Oauth']);
  }
  ngAfterViewInit() {
  }
  // onSubmit(form: NgForm) {
  //   localStorage.setItem('M_loginCheckBox', form.value.loginCheck);
  // }

}
