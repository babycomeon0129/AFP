import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MessageModalComponent } from '@app/shared/modal/message-modal/message-modal.component';
import { Response_APIModel } from '@app/_models';

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
    fromOriginUri: '/'
  };
  /** toTokenApi所需要的Request */
  public grantRequest = {
    grantCode: '',
    UserInfoId: 0,
  };
  /** 登入憑證 */
  public M_idToken = this.cookiesGet('idToken').cookieVal;
  /** 現有域名前置 */
  public preName = '';

  constructor(private router: Router, private http: HttpClient, public cookieService: CookieService,
              private bsModalService: BsModalService) {
  }

  /** 取得域名前置 */
  getLocation() {
    switch (location.hostname) {
      case 'sit.mobii.ai':
        this.preName = 'sit.';
        break;
      case 'localhost':
      case 'www-uuat.mobii.ai':
        this.preName = 'uuat.';
        break;
      case 'www-uat.mobii.ai':
        this.preName = 'uat.';
        break;
      default:
        // 預設正式站、一頁式活動
        this.preName = '';
        break;
    }
    return this.preName;
  }
  /** 「艾斯身份證別_登入1-1-3」呼叫APP跳出登入頁、Web返回頁儲存
   * App：原生點擊登入按鈕（帶queryParams：isApp,deviceType,deviceCode），統一由Web向艾斯識別驗證
   * Web：登入按鈕帶入pathname，做為返回依據
   */
  loginPage(code: number, pathname: string): any {
    this.onClearLogin();
    if (code === 1) {
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        AppJSInterface.login();
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'login' });
      }
    } else {
      let pathTemp = '';
      switch (pathname) {
        case 'undefined':
          pathTemp = '/';
          break;
        case '/':
          pathTemp = '/';
          break;
        case '/Login':
          pathTemp = '/';
          break;
        default:
          pathTemp = pathname;
          break;
      }
      this.loginRequest.fromOriginUri = pathTemp;
      this.router.navigate(['/Login'], { queryParams: {fromOriginUri: pathTemp}});
    }
  }

  /** 「艾斯身份證別_登入1-2-2」取得AJAX資料並POST給後端，以便取得viewConfig資料  */
  toOauthRequest(req: RequestOauthLogin): Observable<any> {
    const formData = new FormData();
    formData.append('deviceType', req.deviceType.toString());
    formData.append('deviceCode', req.deviceCode);
    formData.append('fromOriginUri', req.fromOriginUri);
    return this.http.post(environment.loginUrl, formData)
      .pipe(map((data: ResponseOauthLogin) => {
        switch (data.errorCode) {
          case '996600001':
            return data.data;
          default:
            this.msgModal(`登入逾時<br>錯誤代碼：${data.errorCode}<br>請重新登入註冊`);
            break;
        }
      }, catchError(this.handleError)));
  }

  /** 「艾斯身份證別_登入3-2-2」將grantCode或勾選的帳號給後端，以便取得Response
   * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/30001-token-api-mobii
   */
  toTokenApi(req: RequestIdTokenApi): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return this.http.post(environment.tokenUrl, JSON.stringify(this.grantRequest), { headers })
      .pipe(map((data: ResponseOauthApi) => {
        switch (data.errorCode) {
          case '996600001':
            return data;
          default:
            this.msgModal('註冊失敗');
            break;
        }
      }, catchError(this.handleError)));
  }

  /** 「艾斯身份證別_變更密碼2」 */
  toModifyEyes(app: number, token: string): Observable<any> {
    if (token) {
      const headers = new HttpHeaders({
        Authorization:  'Bearer ' + token,
      });
      const request = {
        isApp: (app !== undefined && app !== null) ? app : 0
      };
      return this.http.post(environment.modifyUrl, request, { headers })
        .pipe(map((data: ResponseOauthApi) => {
          if (data.errorCode === '996600001') {
            return data.data;
          }
        }, catchError(this.handleError)));
    } else {
      this.msgModal('請重新登入');
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


  /** 「cookie,session管理_設定」
   * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/mobiicookiesession
   */
  cookiesSet(data: cookieDeclare) {
    // console.log('cookiesSet', data);
    this.getLocation();
    const cookieData = JSON.parse(JSON.stringify(data));
    for (const item of Object.keys(cookieData)) {
      if (cookieData[item] !== undefined && cookieData[item] !== '') {
        if (this.preName !== '') {
          // 子域塞cookie及session
          sessionStorage.setItem(this.preName + item, cookieData[item]);
          this.cookieService.set(
            this.preName + item, cookieData[item], 90, '/',
            location.hostname, environment.cookieSecure, 'Lax'
          );
          // 子域要另塞M_idToken，以便活動頁存取用
          if (item === 'idToken') {
            sessionStorage.setItem('M_' + item, cookieData[item]);
            this.cookieService.set('M_' + item, cookieData[item], 90, '/',
              environment.cookieDomain, environment.cookieSecure, 'Lax');
          }
        } else {
          // .mobii.ai塞cookie及session
          sessionStorage.setItem('M_' + item, cookieData[item]);
          this.cookieService.set('M_' + item, cookieData[item], 90, '/',
            environment.cookieDomain, environment.cookieSecure, 'Lax');
        }
      }
    }
  }

  /** 「cookie,session管理_取得」
   * session未設定為null；cookie未設定為''
   */
  cookiesGet(item: string) {
    this.getLocation();
    let sessionVal = '';
    let cookieVal = '';
    let itemName = '';
    // 子域不為空時，取子域的session及cookie
    if (this.preName !== '') {
      itemName = this.preName + item;
    } else {
      itemName = 'M_' + item;
    }
    sessionVal = sessionStorage.getItem(itemName);
    cookieVal = this.cookieService.get(itemName);
    // console.log(itemName, sessionVal, cookieVal);
    return {sessionVal, cookieVal};
  }

  /** 「cookie,session管理_刪除」 */
  cookiesDel(item: string) {
    // console.log('cookiesDel', item);
    this.getLocation();
    const upgrade = (this.cookiesGet('upgrade').cookieVal).slice(0);
    const show = (this.cookiesGet('show').cookieVal).slice(0);
    if (item === '/') {
      sessionStorage.clear();
      this.cookieService.deleteAll('/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.deleteAll('/', location.hostname , environment.cookieSecure, 'Lax');
    } else {
      sessionStorage.removeItem('M_' + item);
      sessionStorage.removeItem(this.preName + item);
      this.cookieService.deleteAll(item, environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.deleteAll(item, location.hostname, environment.cookieSecure, 'Lax');
    }
    if (upgrade === '1') { this.cookiesSet({upgrade: '1'}); }
    if (show === '1') { this.cookiesSet({show: '1'}); }
  }

  /** 清除登入來源(非登出) */
  onClearLogin() {
    this.cookiesDel('fromOriginUri');
    this.cookiesDel('deviceType');
  }


  /** 登入註冊用提示視窗 */
  msgModal(msg: any) {
    this.bsModalService.show(MessageModalComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        success: true,
        message: msg,
        showType: 5,
        leftBtnMsg: '我知道了',
        rightBtnMsg: '登入/註冊',
        rightBtnFn: () => {
          this.onClearLogin();
          this.loginPage(0, location.pathname);
        }
      }
    });
  }


  /** 登出 */
  onLogout(): void {
    // 登出紀錄
    const request = {
      User_Code: this.cookiesGet('userCode').sessionVal
    };
    this.toApi_Logout('Home', '1109', request).subscribe((Data: any) => { });

    // APP登出導頁
    const appVisit =
      (this.cookiesGet('deviceType').cookieVal === '') ? '0' : '1';
    if (appVisit === '1') {
      location.href = '/ForApp/AppLogout';
    }

    // web導頁(清除logout參數)
    const url = new URL(location.href);
    const params = new URLSearchParams(url.search);
    const logout = params.get('logout');
    if (logout) {
      this.router.navigate([location.pathname], {queryParams: {isApp: appVisit}});
    }

    // 清除session、cookie
    sessionStorage.clear();
    this.cookieService.deleteAll();
    this.cookiesDel('/');
  }

  /** 登出用
   * @param ctrl 目標
   * @param command 指令編碼
   * @param request 傳送資料
   */
  toApi_Logout(ctrl: string, command: string, request: any, lat: number = null, lng: number = null): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      xEyes_Command: command,
      xEyes_X: (lng != null) ? lng.toString() : '',
      xEyes_Y: (lat != null) ? lat.toString() : '',
      xEyes_DeviceType: (this.cookiesGet('deviceType').cookieVal === '') ? '0' : this.cookiesGet('deviceType').cookieVal,
      Authorization: (this.cookiesGet('idToken').cookieVal === '') ? '' : ('Bearer ' + this.cookiesGet('idToken').cookieVal),
    });

    return this.http.post(environment.apiUrl + ctrl, { Data: JSON.stringify(request) }, { headers })
      .pipe(map((data: Response_APIModel) => {
        return JSON.parse(data.Data);
      }, catchError(() => null)));
  }


}


/** 登入 API Request interface
 * https://bookstack.eyesmedia.com.tw/books/mobii-x/chapter/api
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

export interface ResponseLoginJson {
  messageId: string;
  errorCode: string;
  errorDesc: string;
  messageDatetime: string;
  data: {
    grantCode: string;
    UserInfoId: number;
  };
}

export interface RequestIdTokenApi {
  grantCode: string;
  UserInfoId: number;
}
export interface ResponseOauthApi {
  messageId: string;
  errorCode: string;
  errorDesc: string;
  messageDatetime: string;
  data: string;
}
export class Res_IdTokenApi {
  idToken: string;
  Customer_Name: string;
  Customer_Code: string;
  Customer_UUID: string;
  List_UserFavourite: [];
}

/** 「cookie,session管理_現有參數」 */
export class cookieDeclare {
  /** 身份識別idToken */
  idToken?: string;
  /** 使用者暱稱userName */
  userName?: string;
  /** 使用者編碼userCode */
  userCode?: string;
  /** 使用者收藏userFavorites */
  userFavorites?: string;
  /** fromOriginUri(登入成功返回頁) */
  fromOriginUri?: string;
  /** 裝置編碼(0:web 1:android 2:ios) */
  deviceType?: string;
  /** 公告頁(1不顯示) */
  upgrade?: string;
  /** 首頁隱私權(1不顯示) */
  show?: string;
  /** 購物車編碼(APP用) */
  cart_code?: string;
  /** 購物車 */
  cart_count_Mobii?: string;
  /** 推播 */
  pushCount?: string;
  /** 進場廣告 */
  adTime?: string;
  /** 來源頁(除錯用) */
  page?: string;
}