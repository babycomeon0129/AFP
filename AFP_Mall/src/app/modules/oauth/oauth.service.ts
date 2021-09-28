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
   * @param DeviceType 登入裝置類型 0:Web 1:iOS 2:Android
   * @param fromOriginUri 登入流程結束後要回去的頁面
   */
  public loginRequest = {
    DeviceType: '',
    fromOriginUri: ''
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

  /** 從後端取得viewConfig to eyesmedia-identity  */
  getConfigResponse(request: any): Observable<any> {
    return this.http.post(this.loginApiUrl, { Data: JSON.stringify(request) })
      .pipe(map((data: oauthLoginRequest) => {
        if (data.errorCode === '996600001') {
          const jData = JSON.stringify(data.data);
          this.toApiEyes46111(jData);
          return data.data;
        }
      }, catchError(() => null)));
  }

  /** Form POST to eyesmedia-identity */
  toApiEyes46111(dataJson: any) {
    const obj = JSON.parse(dataJson);
    this.loginEyesData.clientId = obj.clientId;
    this.loginEyesData.scope = obj.scope;
    this.loginEyesData.redirectUri = obj.redirectUri;
    this.loginEyesData.homeUri = obj.homeUri;
    this.loginEyesData.state = obj.state;
    this.loginEyesData.responseType = obj.responseType;
    this.loginEyesData.accountId = obj.accountId;
    this.loginEyesData.viewConfig = obj.viewConfig;
    this.authorizationUri = obj.AuthorizationUri;
    this.openBlock();
    setTimeout(() => {
      (document.getElementById('oauthlogin') as HTMLFormElement).submit();
    }, 1000);
  }

  /** 判斷跳出網頁或APP的登入頁
   * pathname由登入按鈕帶入，傳給fromOriginUri
   */
  loginPage(pathname: string): void {
    if (navigator.userAgent.match(/android/i)) {
      //  Android
      this.loginRequest.DeviceType = '2';
      AppJSInterface.login();
    } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
      //  IOS
      this.loginRequest.DeviceType = '1';
      (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'login' });
    } else {
      this.loginRequest.fromOriginUri = pathname;
      localStorage.setItem('M_fromOriginUri', pathname);
      this.loginRequest.DeviceType = '0';
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
export interface oauthLoginRequest {
  messageId: string;
  errorCode: string;
  errorDesc: string;
  messageDatetime: string;
  data: string;
}


