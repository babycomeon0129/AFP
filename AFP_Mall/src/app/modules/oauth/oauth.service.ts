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

  /** Mobii login所需要的Request
   * @param deviceType 登入裝置類型 0:Web 1:iOS 2:Android
   * @param fromOriginUri 登入流程結束後要回去的頁面(預設首頁)
   */
   public loginRequest = {
    deviceType: 0,
    deviceCode: '',
    fromOriginUri: ''
  };

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) {}

  /** 「登入1-2-2」從後端取得資料AJAX POST給後端，以便取得viewConfig資料  */
  toOauthRequest(req: RequestOauthLogin): Observable<any> {
    const formData = new FormData();
    formData.append('deviceType', req.deviceType.toString());
    formData.append('deviceCode', req.deviceCode);
    formData.append('fromOriginUri', req.fromOriginUri);
    return this.http.post(environment.loginUrl, formData)
      .pipe(map((data: ResponseOauthLogin) => {
        if (data.errorCode !== '996600001') {
          // 不成功導回登入頁
          this.router.navigate(['/Login']);
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
      this.loginRequest.fromOriginUri = pathname;
      localStorage.setItem('M_fromOriginUri', pathname);
      console.log(pathname);
      this.router.navigate(['/Login']);
    }
  }

}

/** 登入 API Request interface
 * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/oauth2-api
 */

export interface RequestOauthLogin {
  deviceType: number;
  deviceCode: string;
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
