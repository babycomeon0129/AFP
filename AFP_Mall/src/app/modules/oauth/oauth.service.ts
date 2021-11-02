import { AppService } from '@app/app.service';
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
  public grantRequest = {
    grantCode: '',
    UserInfoId: 0,
  };
  /** 登入憑證 */
  public M_idToken = this.cookieService.get('M_idToken');

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService,
              private bsModalService: BsModalService) {}


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
      console.log(location.pathname, pathname);
      this.loginRequest.fromOriginUri = pathTemp;
      localStorage.setItem('M_fromOriginUri', pathTemp);
      this.router.navigate(['/Login'], { preserveQueryParams: true });
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
            this.onClearStorage();
            this.msgModal(`登入逾時<br>錯誤代碼：${data.errorCode}<br>請重新登入註冊`);
            break;
        }
      }, catchError(this.handleError)));
  }

  /** 「艾斯身份證別_登入2-3」將grantCode或勾選的帳號給後端，以便取得Response
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
            this.onClearStorage();
            this.msgModal('註冊失敗');
            break;
        }
      }, catchError(this.handleError)));
  }

  /** 「艾斯身份證別_變更密碼2」 */
  toModifyEyes(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization:  'Bearer ' + this.M_idToken,
    });
    return this.http.post(environment.modifyUrl, '', { headers })
      .pipe(map((data: ResponseOauthApi) => {
        switch (data.errorCode) {
          case '996600001':
            location.href = data.data;
            break;
          default:
            this.onClearStorage();
            this.msgModal('請重新登入');
            break;
        }
      }, catchError(this.handleError)));
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

  /** 清除Storage */
  onClearStorage() {
    sessionStorage.clear();
    this.cookieService.deleteAll('/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    localStorage.removeItem('M_fromOriginUri');
    localStorage.removeItem('M_deviceType');
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
