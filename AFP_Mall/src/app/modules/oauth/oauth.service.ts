import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';

declare var AppJSInterface: any;
@Injectable({
  providedIn: 'root'
})
export class OauthService {

  /** Eyes登入裝置類型 0:Web 1:iOS 2:Android */
  public loginDeviceType: string;
  public loginApiUrl = 'https://login-uuat.mobii.ai/auth/api/v1/login';

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) {}

  toApiEyes46111(dataJson: any): Observable<any> {
    const obj = JSON.parse(dataJson);
    // const fd = new FormData(obj);
    // fd.append('clientId', obj.clientId);
    // fd.append('scope', obj.scope);
    // fd.append('redirectUri', obj.redirectUri);
    // fd.append('homeUri', obj.homeUri);
    // fd.append('state', obj.state);
    // fd.append('responseType', obj.responseType);
    // fd.append('accountId', obj.accountId);
    // fd.append('viewConfig', obj.viewConfig);

    const dataEyes46111 = {
      clientId: '7a198a98-871d-4d36-866d-3b246488a2cc',
      scope: 'profile,email',
      redirectUri: 'https://login-uuat.mobii.ai/auth/api/v1/oauth2callback',
      homeUri: 'https://login-uuat.mobii.ai/auth/api/v1/home',
      state: '086306',
      responseType: 'code',
      accountId: 'd3f53a60-db70-11e9-8a34-2a2ae2dbcce4',
      viewConfig: '{"prodType":"Mobii"}'
    };
    console.log('46111', dataJson);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post(obj.AuthorizationUri, { Data: JSON.stringify(dataEyes46111) }, { headers })
      .pipe(map((data: eyesLoginAPI46111) => {
        console.log('46111OK', data);
        return data;
      }, catchError(() => null)));
  }
  // toApiEyes46111(): void {
  //   const dataEyes46111 = {
  //     clientId: '7a198a98-871d-4d36-866d-3b246488a2cc',
  //     scope: 'profile,email',
  //     redirectUri: 'https://login-uuat.mobii.ai/auth/api/v1/oauth2callback',
  //     homeUri: 'https://login-uuat.mobii.ai/auth/api/v1/home',
  //     state: '086306',
  //     responseType: 'code',
  //     accountId: 'd3f53a60-db70-11e9-8a34-2a2ae2dbcce4',
  //     viewConfig: '{"prodType":"Mobii"}'
  //   };
  //   const XHR = new XMLHttpRequest();
  //   // const FD  = new FormData();
  //   XHR.open('POST', 'https://uatid.justka.ai/oauth2');
  //   XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //   XHR.setRequestHeader('Access-Control-Allow-Origin', '*');
  //   XHR.send(JSON.stringify(dataEyes46111));
  // }
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

  /** 判斷跳出網頁或APP的登入頁 */
  loginPage(): void {
    if (navigator.userAgent.match(/android/i)) {
      //  Android
      this.loginDeviceType = '2';
      AppJSInterface.login();
    } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
      //  IOS
      this.loginDeviceType = '1';
      (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'login' });
    } else {
      this.router.navigate(['/Login']);
      this.loginDeviceType = '0';
    }
  }
}


export interface eyesLoginAPI46111 {
  AuthorizationUri: string;
  accountId: string;
  clientId: string;
  state: string;
  scope: string;
  redirectUri: string;
  homeUri: string;
  responseType: string;
  viewConfig: string;
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
