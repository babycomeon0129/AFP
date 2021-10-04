import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService, RequestOauthLogin, OauthLoginViewConfig } from '@app/modules/oauth/oauth.service';
import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
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
  constructor(public appService: AppService, public oauthService: OauthService, private router: Router,
              public el: ElementRef, private activatedRoute: ActivatedRoute) {
    /** 「登入1-1-3」APP訪問 */
    this.activatedRoute.queryParams.subscribe(params => {
      if  (typeof params.deviceType !== 'undefined' && this.appService.isApp === 1) {
        this.oauthService.loginRequest.deviceType = Number(params.deviceType);
        this.oauthService.loginRequest.fromOriginUri = '/Login'; // APP返回預設
      } else {
        this.oauthService.loginRequest.deviceType = 0;
        this.oauthService.loginRequest.fromOriginUri = localStorage.getItem('M_fromOriginUri');
      }
      this.oauthService.loginRequest.deviceCode =
        (typeof params.deviceCode !== 'undefined') ? params.deviceCode : localStorage.getItem('M_DeviceCode');
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
    localStorage.setItem('M_upgrade', 'ok');
    (document.getElementById('oauthLoginForm') as HTMLFormElement).submit();
  }

  ngAfterViewInit() {
  }
  // onSubmit(form: NgForm) {
  //   localStorage.setItem('M_loginCheckBox', form.value.loginCheck);
  // }
  checkUUID(uid: string, e: any) {
    console.log(uid, e);
    e.target.checked = true;
  }
}
