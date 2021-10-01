import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

declare var AppJSInterface: any;
@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) {}

  /** 「登入1-2-2」從後端取得資料AJAX  */
  toOauthRequest(req: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const request = {
      deviceType: req.deviceType,
      deviceCode: req.deviceCode,
      fromOriginUri: req.fromOriginUri
    };
    console.log(JSON.stringify(request));
    return this.http.post(environment.loginUrl, { Data: JSON.stringify(request) }, { headers })
      .pipe(map((data: ResponseOauthLogin) => {
        if (data.errorCode !== '996600001') {
          // 不成功導回登入頁
          this.router.navigate(['/Login'], {queryParams: {fromOriginUri: req.fromOriginUri}});
        }
        return data.data;
      }, catchError(() => null)));
  }


  /** 「登入1-1-2」判斷跳出網頁或APP的登入頁
   * App：原生點擊登入按鈕（帶queryParams：isApp,deviceType,deviceCode），統一由Web向艾斯識別驗證idtoken
   * Web：登入按鈕帶入pathname，做為返回依據
   */
  loginPage(pathname: string): void {
    if (navigator.userAgent.match(/android/i)) {
      //  Android call webView
      AppJSInterface.login();
    } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
      //  IOS call webView
      (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'login' });
    } else {
      //  Web
      this.router.navigate(['/Login'], {queryParams: {fromOriginUri: pathname}});
    }
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
  data: Res_ViewConfig[];
}
export class Res_ViewConfig {
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
export interface OauthLoginViewConfig {
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
