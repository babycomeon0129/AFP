import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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
      }, catchError(this.handleError)));
  }

  /** 「艾斯身份證別-登入2-3」將grantCode或勾選的帳號給後端，以便取得Response
   * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/30001-token-api-mobii
   */
  toTokenApi(request: RequestIdTokenApi): Observable<any> {
    return this.http.post(environment.tokenUrl, JSON.stringify(request))
      .pipe(map((data: ResponseIdTokenApi) => {
        this.blockUI.stop();
        console.log('3-1TokenApiRequestGrantCode', request.grantCode, request.UserInfoId);
        return data;
      }, catchError(this.handleError)));
  }

  /** 「艾斯身份證別-登入4-1-2」曾經登入成功過(沒有idToken)，直接post至艾斯登入，取得idToken */
  toEyesRequest(request: ViewConfig): Observable<any> {
    const req = request;
    console.log('4-1-2', req);
    // const headers = new HttpHeaders({});
    const requestEyes = {
      accountId: req.accountId,
      clientId: req.clientId,
      state: req.state,
      scope: req.scope,
      redirectUri: req.redirectUri,
      homeUri: req.homeUri,
      responseType: req.responseType,
      viewConfig: req.viewConfig
    };
    return this.http.post(req.AuthorizationUri, { Data: JSON.stringify(requestEyes) })
    .pipe(map((data: ResponseEyes) => {
      this.blockUI.stop();
      console.log('4-2', data);
      return data;
    }, catchError(this.handleError)));
  }
  /** 「艾斯身份證別-密碼修改」 */
  toModifyEyes(): Observable<any> {
    if (this.cookieService.get('M_idToken') !== '') {
      console.log('passwordUpdate:', this.cookieService.get('M_idToken'));
      const headers = new HttpHeaders({
        Authorization:  'Bearer ' + this.cookieService.get('M_idToken'),
      });
      const request = '';
      return this.http.post(environment.modifyUrl, { Data: JSON.stringify(request) }, { headers })
        .pipe(map((data: any) => {
          location.href = JSON.stringify(data);
          this.blockUI.stop();
          return data;
        }, catchError(this.handleError)));
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.' + error);
  }

  /** 清除Storage */
  onClearStorage() {
    sessionStorage.clear();
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

export interface ResponseEyes {
  code?: string;
  state: string;
  messageId: string;
  messageDatetime: string;
  error?: string;
  errorDescription?: string;
  data?: [];
}
export interface ViewConfig {
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
export interface RequestIdTokenApi {
  grantCode: string;
  UserInfoId: number;
}
export interface ResponseIdTokenApi {
  messageId: string;
  errorCode: string;
  errorDesc: string;
  messageDatetime: string;
  data?: Res_IdTokenApi[];
}
export class Res_IdTokenApi {
  idToken: string;
  Customer_Name: string;
  Customer_Code: string;
  Customer_UUID: string;
  List_UserFavourite: [];
}
