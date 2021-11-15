import { AFP_UserFavourite } from './../member/_module-member';
import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { BsModalService } from 'ngx-bootstrap';
import { MessageModalComponent } from '@app/shared/modal/message-modal/message-modal.component';

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
  public M_idToken = this.cookiesGet('idToken').c;
  /** 現有域名前置 */
  private preName = '';

  constructor(private router: Router, private http: HttpClient, public cookieService: CookieService,
              private bsModalService: BsModalService) {

    switch (location.hostname) {
      case 'sit.mobii.ai':
        this.preName = 'sit';
        break;
      case 'www-uuat.mobii.ai':
        this.preName = 'uuat';
        break;
      case 'www-uat.mobii.ai':
        this.preName = 'uat';
        break;
      default:
        // 預設正式
        this.preName = '';
        break;
    }

  }

  /** 「艾斯身份證別_登入1-1-3」呼叫APP跳出登入頁、Web返回頁儲存
   * App：原生點擊登入按鈕（帶queryParams：isApp,deviceType,deviceCode），統一由Web向艾斯識別驗證
   * Web：登入按鈕帶入pathname，做為返回依據
   */
  loginPage(code: number, pathname: string): any {
    this.onClearStorage();
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


  /** cookie設定
   * 為避免域名不同導致錯誤，廣域.mobii.ai及本域都會存放
   */
  cookiesSet(data: cookieDeclare) {
    console.log('1-3', data);

    const cookieData = JSON.parse(JSON.stringify(data));
    for (const item of Object.keys(cookieData)) {
      if (cookieData[item] !== undefined && cookieData[item] !== '') {
        // 登入用
        if (item === 'idToken' || item === 'show' || item === 'upgrade' ||
            item === 'deviceType' || item === 'fromOriginUri') {
          // .mobii.ai塞cookie及session
          sessionStorage.setItem('M_' + item, cookieData[item]);
          this.cookieService.set('M_' + item, cookieData[item], 90, '/',
            environment.cookieDomain, environment.cookieSecure, 'Lax');
          // 子域塞cookie及session
          if (this.preName !== '') {
            sessionStorage.setItem(this.preName + item, cookieData[item]);
            this.cookieService.set(
              this.preName + item, cookieData[item], 90, '/',
              this.preName + environment.cookieDomain, environment.cookieSecure, 'Lax'
            );
          }
        }
        // 取得使用者資料後塞值
        if (item === 'userName' || item === 'userCode') {
          sessionStorage.setItem(item, cookieData[item]);
          this.cookieService.set(item, cookieData[item], 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
        }
        if (item === 'userFavorites') {
          sessionStorage.setItem(item, data.userFavorites);
        }
        // 購物車用data.cart_code, cart_count_Mobii
        // 推播用pushCount, 進場廣告用adTime
        if (item === 'data.cart_code' || item === 'cart_count_Mobii' ||
            item === 'pushCount' || item === 'adTime') {
          this.cookieService.set(item, cookieData[item], 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
        }
      }
    }
  }

  /** 取得cookie */
  cookiesGet(item: string) {
    let s = '';
    let c = '';
    // 子域不為空時，取子域的session及cookie
    if (this.preName !== '') {
      s = sessionStorage.getItem(this.preName + item);
      c = this.cookieService.get(this.preName + item);
    } else {
      s = sessionStorage.getItem('M_' + item);
      c = this.cookieService.get('M_' + item);
    }
    return {s, c};
  }

  /** 刪除cookie */
  cookiesDel(item: string) {
    console.log('cookiesDel', item);
    // session未設定為null, cookie未設定為''
    if (item === '/') {
      sessionStorage.clear();
      this.cookieService.deleteAll('/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.deleteAll('/', this.preName + environment.cookieDomain, environment.cookieSecure, 'Lax');
    } else {
      sessionStorage.removeItem('M_' + item);
      sessionStorage.removeItem(this.preName + item);
      localStorage.removeItem('M_' + item);
      localStorage.removeItem(this.preName + item);
      this.cookieService.deleteAll(item, environment.cookieDomain, environment.cookieSecure, 'Lax');
      this.cookieService.deleteAll(item, this.preName + environment.cookieDomain, environment.cookieSecure, 'Lax');
    }
  }

  /** 清除Storage */
  onClearStorage() {
    sessionStorage.clear();
    this.cookiesDel('/');
    // this.cookieService.deleteAll('/', environment.cookieDomain, environment.cookieSecure, 'Lax');
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
          this.onClearStorage();
          this.loginPage(0, location.pathname);
        }
      }
    });
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
  /** 購物車 */
  cart_code?: string;
  /** 購物車 */
  cart_count_Mobii?: string;
  /** 推播 */
  pushCount?: string;
  /** 進場廣告 */
  adTime?: string;
  /** 來源頁 */
  page?: string;
}
