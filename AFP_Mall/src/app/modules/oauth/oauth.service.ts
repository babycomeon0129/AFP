import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var AppJSInterface: any;
@Injectable({
  providedIn: 'root'
})
export class OauthService {

  @BlockUI() blockUI: NgBlockUI;
  /** Mobii login所需要的Request
   * @param deviceType 登入裝置類型 0:Web 1:iOS 2:Android
   * @param fromOriginUri 登入流程結束後要回去的頁面(預設首頁)
   */
   public loginRequest = {
    deviceType: 0,
    deviceCode: '',
    fromOriginUri: '/'
  };

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) {}

  /** 「艾斯身份證別-登入1-1-2」判斷跳出網頁或APP的登入頁
   * App：原生點擊登入按鈕（帶queryParams：isApp,deviceType,deviceCode），統一由Web向艾斯識別驗證
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
      console.log('M_fromOriginUri', pathname);
      this.router.navigate(['/Login']);
    }
  }

  /** 「艾斯身份證別-登入1-2-2」取得AJAX資料並POST給後端，以便取得viewConfig資料  */
  toOauthRequest(req: RequestOauthLogin): Observable<any> {
    const formData = new FormData();
    formData.append('deviceType', req.deviceType.toString());
    formData.append('deviceCode', req.deviceCode);
    formData.append('fromOriginUri', req.fromOriginUri);
    return this.http.post(environment.loginUrl, formData)
      .pipe(map((data: ResponseOauthLogin) => {
        this.blockUI.stop();
        return data.data;
      }, catchError(() => null)));
  }

  /** 「艾斯身份證別-登入2-3」將grantCode或勾選的帳號給後端，以便取得Response  */
  toTokenApi(request: string): Observable<any> {
    const req = JSON.parse(request);
    const formData = new FormData();
    formData.append('grantCode', req.grantCode);
    if (req.uid !== undefined) { formData.append('userInfoId', req.uid); }
    return this.http.post(environment.tokenUrl, formData)
      .pipe(map((data: ResponseTokenApi) => {
        this.blockUI.stop();
        console.log('2-3-1TokenApiRequest', req.grantCode, req.uid);
        return data;
      }, catchError(() => null)));
  }

  /** 「艾斯身份證別-登入4-1-2」曾經登入成功過(沒有idToken)，直接post至艾斯登入，取得idToken */
  toEyesRequest(request: RequestEyes, uri: string): Observable<any> {
    const req = request;
    console.log('4-1-2', req);
    const headers = new HttpHeaders({
    });
    const input = new FormData();
    input.append('accountId', req.accountId);
    input.append('clientId', req.clientId);
    input.append('state', req.state);
    input.append('scope', req.scope);
    input.append('redirectUri', req.redirectUri);
    input.append('homeUri', req.homeUri);
    input.append('responseType', req.responseType);
    input.append('viewConfig', req.viewConfig);
    return this.http.post(uri, input, {headers})
    .pipe(map((data: ResponseEyes) => {
      this.blockUI.stop();
      console.log('4-2', data);
      return data;
    }, catchError(() => null)));
  }
  /** 「艾斯身份證別-密碼修改2」 */
  toModifyEyes() {
    if (this.cookieService.get('M_idToken') === '') {
      this.loginPage('/Member/Setting');
    } else {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization:  'Bearer ' + this.cookieService.get('M_idToken'),
      });
      return this.http.post(environment.modifyUrl, {  }, { headers })
        .pipe(map((data: any) => {
          this.blockUI.stop();
          return data;
        }, catchError(() => null)));
    }
  }
  /** 清除Storage */
  onClearStorage() {
    sessionStorage.clear();
    localStorage.removeItem('M_grantCode');
    localStorage.removeItem('M_fromOriginUri');
    localStorage.removeItem('M_deviceType');
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
export interface ResponseTokenApi {
  idToken: string;
  Customer_Name: string;
  Customer_Code: string;
  Customer_UUID: string;
  List_UserFavourite: [];
}

export interface RequestEyes {
  accountId: string;
  clientId: string;
  state: string;
  scope: string;
  redirectUri: string;
  homeUri: string;
  responseType: string;
  viewConfig: string;
}
export interface ResponseEyes {
  code?: string;
  state: string;
  messageId: string;
  messageDatetime: string;
  error?: string;
  errorDescription?: string;
}
