import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService, RequestOauthLogin, OauthLoginViewConfig } from '@app/modules/oauth/oauth.service';
import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { ModalService } from '@app/shared/modal/modal.service';
import { environment } from '@env/environment';

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
  public grantCode = localStorage.getItem('M_grantCode') || null;

  constructor(public appService: AppService, public oauthService: OauthService, private router: Router,
              public el: ElementRef, private activatedRoute: ActivatedRoute, public modal: ModalService) {

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


      /** 「登入1-4-1」 艾斯身份識別登入成功後，由Redirect API取得grantCode及List_MultipleUser */
      if (typeof params.loginJson !== 'undefined') {
        const loginJson = JSON.parse(params.loginJson);
        if (loginJson.errorCode === '996600001') {
          if (typeof loginJson.data.grantCode !== 'undefined') {
            localStorage.setItem('M_grantCode', loginJson.data.grantCode);
          }
          console.log('1-4-1Redirect API:', loginJson.data.grantCode, loginJson.data.List_MultipleUser);
          /** 「登入1-4-2」預設帳號登入取idToken */
          this.onGetTokenApi();
          /** 「登入1-4-4」多重帳號頁面渲染 */
          if (typeof loginJson.data.List_MultipleUser !== 'undefined' && loginJson.data.List_MultipleUser !== 'null') {
            this.viewType = 1;
            this.List_MultipleUser = loginJson.data.List_MultipleUser;
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
    /** 「登入1-4-3」將grantCode或勾選的帳號給後端，以便取得Response */
    // this.appService.openBlock();
    if (localStorage.getItem('M_grantCode') !== undefined && localStorage.getItem('M_grantCode') !== null) {
      (this.oauthService.toTokenApi(this.grantCode, this.uuid)).subscribe((data: any) => {
        console.log('1-4-3TokenApi', data);
        // this.appService.blockUI.stop();
      });
    }
  }
  ngAfterViewInit() {
  }
  // onSubmit(form: NgForm) {
  //   localStorage.setItem('M_loginCheckBox', form.value.loginCheck);
  // }

}
