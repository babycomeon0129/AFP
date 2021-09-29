import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { OauthLoginComponent } from '../oauth/oauth-login/oauth-login.component';

declare var AppJSInterface: any;
@Injectable({
  providedIn: 'root'
})
export class OauthService {
  /** Mobii login API url */
  public loginApiUrl = 'https://login-uuat.mobii.ai/auth/api/v1/login';
  /** Mobii login所需要的Request
   * @param deviceType 登入裝置類型 0:Web 1:iOS 2:Android
   * @param fromOriginUri 登入流程結束後要回去的頁面 預設首頁
   */
  public loginRequest = {
    deviceType: 0,
    fromOriginUri: '/'
  };
  /** eyesmedia-identity API url */
  public authorizationUri: string;
  /** eyesmedia-identity所需要的Form Body */
  public loginEyesData = {
    accountId: '',
    clientId: '',
    state: '',
    scope: '',
    redirectUri: '',
    homeUri: '',
    responseType: '',
    viewConfig: ''
  };
  @BlockUI() blockUI: NgBlockUI;
  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) {}

  /** 「登入1-1-3」從後端取得資料  */
  toOauthRequest(request: RequestOauthLogin): Observable<any> {
    this.openBlock();
    return this.http.post(this.loginApiUrl, { Data: JSON.stringify(request) })
      .pipe(map((data: ResponseOauthLogin) => {
          if (data.errorCode === '996600001') {
            console.log('1-1-3ok:', data.errorCode);
            return this.toApiEyes46111(data.data);
          }
        }, catchError(() => null)));
  }

  /** 「登入1-1-4」從後端取得的資料，FormPost給艾斯身份識別渲染用 */
  toApiEyes46111(dataJson: any) {
    const obj = JSON.parse(JSON.stringify(dataJson));
    this.loginEyesData.clientId = obj.clientId;
    this.loginEyesData.scope = obj.scope;
    this.loginEyesData.redirectUri = obj.redirectUri;
    this.loginEyesData.homeUri = obj.homeUri;
    this.loginEyesData.state = obj.state;
    this.loginEyesData.responseType = obj.responseType;
    this.loginEyesData.accountId = obj.accountId;
    this.loginEyesData.viewConfig = obj.viewConfig;
    this.authorizationUri = obj.AuthorizationUri;
    console.log('1-1-4toForm:', this.loginEyesData);
    setTimeout(() => {
      this.blockUI.stop();
      console.log('1-1-5toEyes FormPost:', this.authorizationUri);
      (document.getElementById('oauthLoginForm') as HTMLFormElement).submit();
    }, 1500);
  }

  /** 「登入1-1-1」判斷跳出網頁或APP的登入頁
   * App：原生登入後取得idtoken，傳給後端。若無多重帳號由後端轉App；若有多重帳號則fromOriginUri由後端提供
   * Web：pathname由登入按鈕帶入，做為返回依據，為避免重整資料遺失暫存於sessionStorage
   */
  loginPage(pathname: string): void {
    if (navigator.userAgent.match(/android/i)) {
      //  Android
      this.loginRequest.deviceType = 2;
      AppJSInterface.login();
    } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
      //  IOS
      this.loginRequest.deviceType = 1;
      (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'login' });
    } else {
      //  Web
      this.loginRequest.deviceType = 0;
      this.loginRequest.fromOriginUri = (pathname !== null ) ? pathname : '/';
      sessionStorage.setItem('M_fromOriginUri', pathname);
      this.router.navigate(['/Login']);
    }
  }

  /** 打開遮罩 */
  openBlock(): void {
    this.blockUI.start('Loading...'); // Start blocking
  }
}


/** 登入 API Request interface
 * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/oauth2-api
 */

export interface RequestOauthLogin {
  deviceType: number;
  deviceCode?: string;
  fromOriginUri: string;
}

export interface ResponseOauthLogin {
  messageId: string;
  errorCode: string;
  errorDesc: string;
  messageDatetime: string;
  data: string;
}

export interface RequestOauthLoginEyes {
  accountId: string;
  clientId: string;
  state: string;
  scope: string;
  redirectUri: string;
  homeUri: string;
  responseType: string;
  viewConfig: string;
}


