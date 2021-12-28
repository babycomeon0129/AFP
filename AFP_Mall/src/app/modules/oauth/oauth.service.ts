import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageModalComponent } from '@app/shared/modal/message-modal/message-modal.component';
import { environment } from '@env/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  /** app訪問 */
  private appVisit = (this.cookiesGet('deviceType').cookieVal > '0') ? 1 : 0;

  constructor(private router: Router, private http: HttpClient, public cookieService: CookieService,
              private bsModalService: BsModalService) {
  }

  /** 取得域名前置 */
  getLocation() {
    switch (location.hostname) {
      case 'localhost':
      case 'sit.mobii.ai':
        this.preName = 'sit.';
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
  /** 「艾斯身份識別_登入1-1-3」呼叫APP跳出登入頁、Web返回頁儲存
   * App：原生點擊登入按鈕（帶queryParams：isApp,deviceType,deviceCode），統一由Web向艾斯識別驗證
   * Web：登入按鈕帶入pathname，做為返回依據
   * @param code isApp
   * @param pathname 返回頁
   * @param pathTemp 返回頁變數
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
      // pathTemp 返回頁變數，避免返回鍵導到404
      let pathTemp = '';
      switch (pathname) {
        case '':
        case '/':
        case 'null':
        case 'undefined':
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

  /** 「艾斯身份識別_登入1-2-2」取得AJAX資料並POST給後端，以便取得viewConfig資料
   *  @param deviceType 裝置識別
   *  @param deviceCode 裝置編碼
   *  @param fromOriginUri的 返回頁
   */
  toOauthRequest(req: RequestOauthLogin): Observable<any> {
    const formData = new FormData();
    formData.append('deviceType', req.deviceType.toString());
    formData.append('deviceCode', req.deviceCode);
    formData.append('fromOriginUri', req.fromOriginUri);
    return this.http.post(environment.loginUrl + 'login', formData)
      .pipe(map((data: ResponseOauthLogin) => {
        switch (data.errorCode) {
          case '996600001':
            return data.data;
          default:
            this.msgModal(this.appVisit, `登入逾時<br>錯誤代碼：${data.errorCode}<br>請重新登入註冊`);
            break;
        }
      }, catchError(this.handleError)));
  }

  /** 「艾斯身份識別_登入3-2-2」將grantCode或勾選的帳號給後端，以便取得Response
   * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/30001-token-api-mobii
   */
  toTokenApi(req: RequestIdTokenApi): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(environment.loginUrl + 'token', JSON.stringify(this.grantRequest), { headers })
      .pipe(map((data: ResponseOauthApi) => {
        switch (data.errorCode) {
          case '996600001':
            return data;
          default:
            this.msgModal(this.appVisit, '註冊失敗');
            break;
        }
      }, catchError(this.handleError)));
  }

  /** 「艾斯身份識別_變更密碼2」 */
  toModifyEyes(app: number, token: string): Observable<any> {
    if (token) {
      const headers = new HttpHeaders({
        Authorization:  'Bearer ' + token,
      });
      const request = {
        isApp: (app !== undefined && app !== null) ? app : 0
      };
      return this.http.post(environment.loginUrl + 'memberModify', request, { headers })
        .pipe(map((data: ResponseOauthApi) => {
          if (data === null) {
            return null;
          } else {
            if (data.errorCode === '996600001') {
              return data.data;
            } else {
              return data.errorCode;
            }
          }
        }, catchError(this.handleError)));
    } else {
      this.msgModal(this.appVisit, '請重新登入');
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
   * @param sessionVal 將返回參數的session值
   * @param cookieVal 將返回參數的cookie值
   * @param itemName 欲取得的參數名稱
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

  /** 「cookie,session管理_刪除」
   * @param item 刪除的參數名稱
   * @param upgrade 登入公告頁hide
   * @param show 下方隱私權hide
   * @param out 登出狀態(除錯用)
   */
  cookiesDel(item: string) {
    this.getLocation();
    const upgrade = (this.cookiesGet('upgrade').cookieVal).slice(0);
    const show = (this.cookiesGet('show').cookieVal).slice(0);
    const out = this.cookiesGet('logout').cookieVal;
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
    this.cookiesSet({logout: out});
  }

  /** 清除登入來源(非登出) */
  onClearLogin() {
    this.cookiesDel('fromOriginUri');
    this.cookiesDel('deviceType');
  }


  /** 登入註冊用提示視窗
   * @param isApp app訪問
   * @param msg 提示文字
   */
  msgModal(isApp: number, msg: any) {
    this.bsModalService.show(MessageModalComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        success: true,
        message: msg,
        showType: 5,
        leftBtnMsg: '我知道了',
        rightBtnMsg: '登入/註冊',
        rightBtnFn: () => {
          // 清除session、cookie
          // this.onClearLogin();
          this.cookiesDel('/');
          sessionStorage.clear();
          this.cookieService.deleteAll();
          this.loginPage(isApp, encodeURI(location.href.replace(location.origin, '')));
        }
      }
    });
  }

  /** 「艾斯身份識別_登出2」
   * @param type 裝置識別
   * @param token 會員識別idToken
   */
  oauthLogout(type: string, token: string): Observable<any>  {
    const headers = new HttpHeaders({
      Authorization:  'Bearer ' + token,
    });
    const reqType =  (type !== '') ? type : '0';
    const formData = new FormData();
    formData.append('deviceType', reqType);
    return this.http.post(environment.loginUrl + 'memberLogout', formData, {headers})
      .pipe(map((data: ResponseOauthLogin) => {
        if (data.errorCode === '996600001') {
          return data.data;
        } else {
          console.log('logout error', data.errorCode);
        }
      }, catchError(this.handleError)));
  }

  /** 登出，由web統一發出登出請求
   * 1.呼叫後端call api 1109紀錄登出狀態（後端處理艾斯登出API-46-112 logout）
   * 2.若為APP則導頁至/ForApp/AppLogout，APP監聽到此頁，會清除Local資料
   * 3.web清除session、cookie、重置登入狀態、我的收藏、通知
   * @param appVisit app訪問
   */
  onLogout(appVisit: number): void {
    /** 「艾斯身份識別_登出1」 */
    this.oauthLogout(this.cookiesGet('deviceType').cookieVal, this.cookiesGet('idToken').cookieVal).subscribe((Data: any) => {});

    // APP登出導頁
    if (appVisit === 1) {
      this.cookiesSet({
        logout: appVisit + ',' + location.href
      });
      location.href = '/ForApp/AppLogout';
      console.log('app logout');
    } else {
      // web導頁(清除logout參數)
      const url = new URL(location.href);
      const params = new URLSearchParams(url.search);
      const logout = params.get('logout');
      if (logout) {
        this.cookiesSet({
          logout: appVisit + ',psw logout: ' + location.href
        });
        this.router.navigate([location.pathname]);
      } else {
        this.cookiesSet({
          logout: appVisit + ',web logout: ' + location.href
        });
        this.router.navigate(['/Member']);
      }
    }

    // 清除session、cookie
    this.cookiesDel('/');
    sessionStorage.clear();
    this.cookieService.deleteAll();
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
  /** 裝置編碼(0:Web 1:iOS 2:Android) */
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
  /** App訪問 */
  appVisit?: string;
  /** 登出測試 */
  logout?: string;
  /** 來源頁(除錯用) */
  page?: string;
}
