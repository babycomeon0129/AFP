import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { SwPush } from '@angular/service-worker';
// import firebase from 'firebase/app';
// import 'firebase/messaging';
// 推播
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { OauthService } from '@app/modules/oauth/oauth.service';
import {
  AFP_Voucher, Model_ShareData, Request_ECCart, Request_MemberFavourite, Request_MemberUserVoucher,
  Response_APIModel, Response_ECCart, Response_MemberFavourite, Response_MemberUserVoucher
} from '@app/_models';
import { environment } from '@env/environment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmModalComponent } from './shared/modal/confirm-modal/confirm-modal.component';
// Component
import { FavoriteModalComponent } from './shared/modal/favorite-modal/favorite-modal.component';
import { JustkaModalComponent } from './shared/modal/justka-modal/justka-modal.component';
import { MessageModalComponent } from './shared/modal/message-modal/message-modal.component';
import { MsgShareModalComponent } from './shared/modal/msg-share-modal/msg-share-modal.component';

declare var AppJSInterface: any;

@Injectable({
  providedIn: 'root'
})
export class AppService {
  /** 登入狀態 (登入true,登出false) */
  public loginState = false;
  /** App訪問 (1:App) */
  public isApp: number = null;
  /** App狀態 (登入1,登出2) */
  public appLoginType: string;
  /** 使用者暱稱 */
  public userName = this.oauthService.cookiesGet('userName').sessionVal || null;
  /** 我的收藏物件陣列 */
  public userFavArr = [];
  /** 我的收藏編碼陣列 */
  public userFavCodes: number[] = [];
  /** APP 下載引導是否顯示（手機web上方） */
  public showAPPHint = true;
  /** 前一頁url */
  public prevUrl = '';
  /** lazyload 的初始圖片 */
  public defaultImage = '/img/share/eee.jpg';
  /** 當前訊息 */
  public currentMessage = new BehaviorSubject(null);
  /** 推播訊息數量 */
  public pushCount = Number(this.oauthService.cookiesGet('pushCount').cookieVal) || 0;
  /** 推播紅點顯示與否(false:不顯示, true:顯示) */
  public alertStatus: boolean;
  /** GUID (推播使用) */
  public deviceCode = localStorage.getItem('M_DeviceCode') || null;
  /** firebase 推播 token */
  public firebaseToken: string;
  /** 首頁進場廣告是否開啟 (要再確認過瀏覽器版本後打開) */
  public adIndexOpen = false;
  /** 會員是否在此次訪問執行了登入
   * @description 用於判斷 loginState 由 false 轉為 true 不是因為在之前的訪問所保留的登入狀態下再次進行訪問，
   * APP 因此重新建構及初始化導致，而是因為確實執行了登入。符合此狀況才在 app.component 的變化追蹤 (serviceDiffer)
   * 偵測到 loginState 由 false 轉為 true時，重新訪問當前頁面以取得會員相關資訊。
   */
  public userLoggedIn = false;
  /** 是否顯示返回鍵 (app特例) */
  public showBack = false;
  /** line 登入用 state (用於取code) */
  public lineSigninState: string;
  private idToken = null;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private http: HttpClient, private router: Router, private bsModalService: BsModalService,
              public cookieService: CookieService, private route: ActivatedRoute,
              private angularFireMessaging: AngularFireMessaging, private oauthService: OauthService) {
    // firebase message設置。這裡在幹嘛我也不是很懂
    // 詳：https://stackoverflow.com/questions/61244212/fcm-messaging-issue
    this.angularFireMessaging.messages.subscribe(
      (_messaging: AngularFireMessaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      });
  }

  toApi(ctrl: string, command: string, request: any, lat: number = null, lng: number = null, deviceCode?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      xEyes_Command: command,
      xEyes_X: (lng != null) ? lng.toString() : '',
      xEyes_Y: (lat != null) ? lat.toString() : '',
      xEyes_DeviceType: (this.isApp != null) ? this.oauthService.loginRequest.deviceType.toString() : '0',
      xEyes_DeviceCode: deviceCode === undefined ? '' : deviceCode,
      Authorization: (this.oauthService.cookiesGet('idToken').cookieVal === '') ? '' :
        ('Bearer ' + this.oauthService.cookiesGet('idToken').cookieVal),
    });

    return this.http.post(environment.apiUrl + ctrl, { Data: JSON.stringify(request) }, { headers })
      .pipe(map((data: Response_APIModel) => {
        this.blockUI.stop();
        // 除錯用
        // if (location.hostname.indexOf('localhost') === 0 ||
        //   location.hostname.indexOf('sit') >= 0 ||
        //   location.hostname.indexOf('uat') >= 0) {
        //   console.log('isApp', this.isApp, command, data);
        // }

        switch (data.Base.Rtn_State) {
          case 1:
            /** 「艾斯身份識別_更新idToken」 */
            const toApiData = data;
            if (toApiData.IdToken && toApiData.IdToken !== null) {
              // 避免call api時，重複存M_idToken
              if (this.idToken === null) {
                this.idToken = toApiData.IdToken;
                this.oauthService.cookiesSet({
                  idToken: toApiData.IdToken,
                  page: location.href
                });
              }
              if (this.oauthService.cookiesGet('idToken').cookieVal !== toApiData.IdToken) {
                this.oauthService.cookiesSet({
                  idToken: toApiData.IdToken,
                  page: location.href
                });
              }
              this.loginState = true;
              this.userLoggedIn = true;
            }
            return JSON.parse(data.Data);
          case 9996: // 查無商品詳細頁資料
            this.bsModalService.show(MessageModalComponent, {
              class: 'modal-dialog-centered',
              initialState: { success: false, message: data.Base.Rtn_Message, showType: 2, checkBtnMsg: '確定', target: 'GoBack' }
            });
            break;
          case 9998: // user資料不完整，讓使用者登出
            this.logoutModal();
            break;
          case 609840001: // 登入不完整，讓使用者登出
            this.logoutModal();
            break;
          default: // 其他錯誤
            this.bsModalService.show(MessageModalComponent, {
              class: 'modal-dialog-centered',
              initialState: { success: false, message: data.Base.Rtn_Message, showType: 2, target: data.Base.Rtn_URL }
            });
            throw new Error('bad request');
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

  /** 我的檔案證件上傳 */
  tofile(ctrl: string, request: any): Observable<any> {
    const headers = new HttpHeaders({
      xEyes_Command: '9901',
    });
    return this.http.post(environment.apiUrl + ctrl, request, { headers })
      .pipe(map((data: Response_APIModel) => {
        if (data.Base.Rtn_State !== 1) {
          this.bsModalService.show(MessageModalComponent, {
            class: 'modal-dialog-centered',
            initialState: { success: false, message: data.Base.Rtn_Message, showType: 2, target: data.Base.Rtn_URL }
          });
          throw new Error('bad request');
        }
        return JSON.parse(data.Data);
      }, catchError(() => null)));
  }

  /** formData給後端(意見回饋) */
  toFormData(ctrl: string, headers: any, request: any): Observable<any> {
    return this.http.post(environment.apiUrl + ctrl, request, { headers })
      .pipe(map((data: Response_APIModel) => {
        return data.MissionInfo;
      }, catchError(() => null)));
  }

  /** 登入註冊提示視窗(完全登出含app) */
  logoutModal() {
    this.bsModalService.show(MessageModalComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        success: false,
        message: '請先登入!',
        showType: 5,
        leftBtnMsg: '我知道了',
        rightBtnMsg: '登入/註冊',
        rightBtnFn: () => {
          // 避免購物車遺失，需帶入返回網址
          let uri = location.href;
          if (uri.indexOf('ShoppingCart') > -1) {
            uri = uri + '&cartCode=' + this.oauthService.cookiesGet('cart_code').cookieVal;
          }
          if (this.loginState) {
            // 清除session、cookie、我的收藏資料，重置登入狀態及通知數量
            this.loginState = false;
            this.userLoggedIn = false;
            this.userFavCodes = [];
            this.pushCount = 0;
            this.alertStatus = false;
            this.oauthService.onLogout(this.isApp);
          }
          this.oauthService.loginPage(this.isApp, encodeURI(uri.replace(location.origin, '')));
        }
      }
    });
  }

  /** 登入初始化需帶入的 state，Apple、Line登入都需要用到
   * @description unix timestamp 前後相反後前4碼+ 10碼隨機英文字母 (大小寫不同)
   * @returns state 的值
   */
  getState(): string {
    // 取得 unix
    const dateTime = Date.now();
    const timestampStr = Math.floor(dateTime / 1000).toString();
    // 前後相反
    let reverseTimestamp = '';
    for (let i = timestampStr.length - 1; i >= 0; i--) {
      reverseTimestamp += timestampStr[i];
    }
    // 取前4碼
    const timestampFirst4 = reverseTimestamp.substring(0, 4);
    // 取得10個隨機英文字母，組成字串
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    }
    const engLettersArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let randomEngLetter = '';
    for (let x = 0; x < 10; x++) {
      const randomInt = getRandomInt(engLettersArr.length);
      randomEngLetter += engLettersArr[randomInt];
    }
    // 組成 state
    return timestampFirst4 + randomEngLetter;
  }

  /** 打開遮罩 */
  openBlock(): void {
    this.blockUI.start('Loading...'); // Start blocking
  }

  /** 顯示我的收藏 */
  showFavorites(): void {
    // get favorite from session and turn it from string to json
    if (this.oauthService.cookiesGet('userFavorites').sessionVal != null) {
      this.userFavArr = JSON.parse(this.oauthService.cookiesGet('userFavorites').sessionVal);
      // reset userFavCodes array (after create/delete favorite)
      this.userFavCodes = [];
      // push all favorite codes to array
      for (const item of Object.keys(this.userFavArr)) {
        const fav = this.userFavArr[item];
        this.userFavCodes.push(fav.UserFavourite_TypeCode);
      }
    }
  }

  /** 新增/刪除我的收藏
   * @param favAction 1 新增, 2: 刪除
   * @param favType 51 商品, 52 商家, 53 周邊, 54 行程
   * @param favCode 商品/商家/周邊/行程編碼
   */
  favToggle(favAction: number, favType: number, favCode?: number): void {
    if (!this.oauthService.cookiesGet('idToken').cookieVal) {
      this.logoutModal();
    } else {
      const request: Request_MemberFavourite = {
        SelectMode: favAction,
        AFP_UserFavourite: {
          UserFavourite_ID: 0,
          UserFavourite_CountryCode: 886,
          UserFavourite_Type: favType,
          UserFavourite_UserInfoCode: 0,
          UserFavourite_TypeCode: favCode,
          UserFavourite_IsDefault: 0
        },
      };

      this.toApi('Member', '1511', request).subscribe((data: Response_MemberFavourite) => {
        // update favorites to session
        this.oauthService.cookiesSet({
          userFavorites: JSON.stringify(data.List_UserFavourite),
          page: location.href
        });
        // update favorites to array
        this.showFavorites();
        if (favAction === 1) {
          this.bsModalService.show(FavoriteModalComponent);
        }
      });
    }
  }

  /** 讀取購物車 (主要為更新數量) */
  readCart(): void {
    if (Number(this.oauthService.cookiesGet('cart_code').cookieVal)) {
      const request: Request_ECCart = {
        SelectMode: 4, // 固定讀取
        SearchModel: {
          Cart_Code: Number(this.oauthService.cookiesGet('cart_code').cookieVal)
        },
      };

      this.toApi('EC', '1204', request).subscribe((data: Response_ECCart) => {
        this.oauthService.cookiesSet({
          cart_count_Mobii: JSON.stringify(data.Cart_Count),
          page: location.href
        });
      });
    }
  }

  /**
   * 優惠券按鈕行為（優惠券詳細不共用）
   * @param voucher 所選優惠券資訊
   * Voucher_FreqName: 0 已兌換 1 兌換 2 去商店 3 已使用 4 兌換完畢（限一元搶購） 5 使用 6 已逾期（限我的優惠+優惠券詳細） 7 未生效（限我的優惠+優惠券詳細） 8 使用中
   */
  onVoucher(voucher: AFP_Voucher): void {
    // 點擊兌換時先進行登入判斷
    if (!this.oauthService.cookiesGet('idToken').cookieVal) {
      this.logoutModal();
    } else {
      switch (voucher.Voucher_IsFreq) {
        case 1:
          // 先判斷是否需要扣點才能兌換，如需扣點必須先跳扣點提示
          if (voucher.Voucher_DedPoint > 0) {
            this.confirm({
              initialState: {
                message: `請確定是否扣除 Mobii! Points ${voucher.Voucher_DedPoint} 點兌換「${voucher.Voucher_ExtName}」？`
              }
            }).subscribe(res => {
              // 點選確定扣點
              if (res) {
                this.exchangeVoucher(voucher);
              } else {
                // 點選取消扣點
                const content =
                  `<div class="no-data no-transform"><img src="../../../../img/shopping/payment-failed.png"><p>兌換失敗！</p></div>`;
                this.bsModalService.show(MessageModalComponent, {
                  class: 'modal-dialog-centered',
                  initialState: { success: true, message: content, showType: 1 }
                });
              }
            });
          } else {
            this.exchangeVoucher(voucher);
          }
          break;
        case 2:
          // 導去該優惠券商店的商品tab
          if (voucher.Voucher_URL !== null) {
            if (voucher.Voucher_URL.substring(0, 1) === '/') {
              // 連到站內頁（URL開頭為'/'）
              const navigationExtras: NavigationExtras = {
                queryParams: { navNo: 3 }
              };
              this.router.navigate([voucher.Voucher_URL], navigationExtras);
            } else {
              window.open(voucher.Voucher_URL, voucher.Voucher_URLTarget);
            }
          } else {
            // 去商店網址 [Voucher_URL] 若空值未填，則預設為去店家詳情頁_所有商品分頁
            const navigationExtras: NavigationExtras = {
              queryParams: { showBack: this.route.snapshot.queryParams.showBack, navNo: 3 }
            };
            this.router.navigate(['/Explore/ExploreDetail', voucher.Voucher_ECStoreCode], navigationExtras);
          }
          break;
        case 5:
          // 前往優惠券詳細
          // 特例: 若從我的優惠前往或是兌換後使用則傳使用者優惠券編號
          let code = 0;
          if (voucher.Voucher_UserVoucherCode === null) {
            code = voucher.Voucher_Code;
          } else {
            code = voucher.Voucher_UserVoucherCode;
          }
          this.router.navigate(['/Voucher/VoucherDetail', code], { queryParams: { showBack: this.showBack } });
          break;
      }
    }
  }

  /** 確認視窗(爲解決循環依賴，僅提供appservice使用) */
  confirm(options: ModalOptions): Observable<any> {
    const ModalRef = this.bsModalService.show(ConfirmModalComponent, options);
    return ModalRef.content.action;
  }

  /** 兌換優惠券 */
  exchangeVoucher(voucher: AFP_Voucher): void {
    // 加入到「我的優惠券」
    const request: Request_MemberUserVoucher = {
      SelectMode: 1, // 新增
      Voucher_Code: voucher.Voucher_Code, // 優惠券Code
      Voucher_ActivityCode: null, // 優惠代碼
      SearchModel: {
        SelectMode: null
      }
    };
    this.toApi('Member', '1510', request).subscribe((data: Response_MemberUserVoucher) => {
      // 按鈕顯示改變
      voucher.Voucher_UserVoucherCode = data.AFP_UserVoucher.UserVoucher_Code;
      voucher.Voucher_IsFreq = data.Model_Voucher.Voucher_IsFreq;
      voucher.Voucher_FreqName = data.Model_Voucher.Voucher_FreqName;
      voucher.Voucher_ReleasedCount += 1;
      // 如果是扣點才能兌換的優惠券，需跳兌換成功提示
      if (voucher.Voucher_DedPoint > 0) {
        const content =
          `<div class="no-data no-transform"><img src="../../../../img/shopping/payment-ok.png"><p>兌換成功！</p></div>`;
        this.bsModalService.show(MessageModalComponent, {
          class: 'modal-dialog-centered',
          initialState: { success: true, message: content, showType: 1 }
        });
      }
    });
  }

  /** 打開JustKa iframe */
  showJustka(url: string): void {
    if (!this.oauthService.cookiesGet('idToken').cookieVal) {
      this.logoutModal();
    } else {
      this.bsModalService.show(JustkaModalComponent, {
        initialState: {
          justkaUrl: url + '&J_idToken=' + this.oauthService.cookiesGet('idToken').cookieVal
        }
      });
    }
  }

  /** 向firebase message 請求token */
  getPushPermission(): void {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        if (this.deviceCode === null) {
          this.deviceCode = this.guid();
          localStorage.setItem('M_DeviceCode', this.deviceCode);
        }
        const fireBaseToken = localStorage.getItem('FireMessaging_token') || null ;
        // 如果localStorage沒有存token或存放的token不是新版，更新token並傳給後端(api 1113)
        if (fireBaseToken === null || fireBaseToken !== token) {
          localStorage.setItem('FireMessaging_token', token);
          this.toPushApi(token);
        }
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /** 接收推播訊息 */
  receiveMessage(): void {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        // console.log('new message received. ', payload);
        this.currentMessage.next(payload);
        this.pushCount++;
        this.oauthService.cookiesSet({
          pushCount: JSON.stringify(this.pushCount),
          page: location.href
        });
      });
  }

  /** 推播-取得含device code的新消費者包 */
  toPushApi(token: string): void {
    if (token !== null && token !== undefined) {
      const request: Request_AFPPushToken = {
        Token: token
      };
      this.toApi('Home', '1113', request, null, null, this.deviceCode).subscribe((data) => { });
    }
  }

  /** 產生device code */
  guid(): string {
    let d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  /** 分享功能
   * @param sharedContent 分享內容文案
   * @param APPShareUrl APP分享時使用的url（直接抓當前url在APP中會帶入使用者相關資訊因此不使用）
   */
  shareContent(sharedContent: string, APPShareUrl: string): void {
    if (this.isApp === null) {
      // web
      this.bsModalService.show(MsgShareModalComponent, { initialState: { sharedText: sharedContent } });
    } else {
      // APP: 呼叫APP分享功能
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        AppJSInterface.appShare(sharedContent + '\n' + APPShareUrl);
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({
          action: 'appShare', content: sharedContent + '\n' + APPShareUrl
        });
      }
    }
  }

  /** 網頁跳轉（瀏覽器會紀錄連結的歷史紀錄） */
  jumpHref(link: string, tag: string) {
    switch (tag) {
      case '_blank':
        if (link.slice(0, 1) === '/') {
          // blank需要絕對路徑
          window.open(location.origin + link, tag);
        } else {
          window.open(link, tag);
        }
        break;
      default:
        if (link.startsWith('https') || link.startsWith('http')) {
          // 絕對路徑
          const openUrl = new URL(link);
          if (openUrl.host !== location.host) {
            location.href = link;
          } else {
            // 若絕對路徑為站內連結
            if (link.includes('?')) {
              // 若原有參數則帶著前往
              const selfUrl = link.split('?')[0];
              this.router.navigate([selfUrl], { queryParams: this.route.snapshot.queryParams });
            } else {
              this.router.navigate([link]);
            }
          }
        } else {
          // 相對路徑
          if (link.includes('?')) {
            // 若原有參數則帶著前往
            const selfUrl = link.split('?')[0];
            this.router.navigate([selfUrl], { queryParams: this.route.snapshot.queryParams });
          } else {
            this.router.navigate([link]);
          }
        }
        break;
    }
  }

  /** 網頁跳轉(登入用，不會紀錄連結的歷史紀錄) */
  jumpUrl(uri: string) {
    if (uri === '' || uri === 'null') {
      this.router.navigate(['/']);
    } else {
      location.replace(decodeURI(uri));
    }
  }
}


/** 推撥登記 RequestModel */
interface Request_AFPPushToken extends Model_ShareData {
  /** FireBase Token */
  Token: string;
}


