import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Response_APIModel, Request_MemberFavourite, Response_MemberFavourite, AFP_Voucher,
  Request_MemberUserVoucher, Response_MemberUserVoucher, Request_ECCart, Response_ECCart, Model_ShareData
} from './_models';
import { BsModalService } from 'ngx-bootstrap';
import { MessageModalComponent } from './shared/modal/message-modal/message-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from './../environments/environment';
import { ModalService } from './service/modal.service';
import { Router, NavigationExtras, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'angularx-social-login';
import { SwPush } from '@angular/service-worker';
import firebase from 'firebase/app';
import 'firebase/messaging';

declare var $: any;
declare var AppJSInterface: any;

@Injectable({
  providedIn: 'root'
})
export class AppService {
  /** 登入狀態 */
  public loginState = false;
  /** App訪問 */
  public isApp = null;
  /** callLayer 側邊滑入頁面 */
  public tLayer = [];
  /** callLayer 呼叫頁面 z-index */
  public layerIdx = 1;
  /** callLayerUp 下方上滑頁面 */
  public tLayerUp = [];
  /** callsortLayer 篩選頁面 */
  public sLayer = [];
  /** 我的收藏物件陣列 */
  public userFavArr = [];
  /** 我的收藏編碼陣列 */
  public userFavCodes: number[] = [];
  /** APP 下載引導是否顯示（手機web上方） */
  public showAPPHint = true;
  /** 前一頁url */
  public prevUrl = '';
  /** 當前頁url */
  public currentUrl = this.router.url;
  /** lazyload 的初始圖片 */
  public defaultImage = '../img/share/eee.jpg';
  /** 推播訊息數量 */
  public pushCount = 0;
  /** GUID (推播使用) */
  public deviceCode: string;
  /** firebase 推播 token */
  public firebaseToken: string;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private http: HttpClient, private bsModal: BsModalService, public modal: ModalService, private router: Router,
              private cookieService: CookieService, private route: ActivatedRoute, private authService: AuthService,
              private swPush: SwPush) {
    if (sessionStorage.getItem('CustomerInfo')) {
      this.loginState = true;
    }
    // 取得前一頁面url
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.prevUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  toApi(ctrl: string, command: string, request: any, lat: number = null, lng: number = null, deviceCode?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      xEyes_Command: command,
      xEyes_X: (lng != null) ? lng.toString() : '',
      xEyes_Y: (lat != null) ? lat.toString() : '',
      xEyes_DeviceType: (this.isApp != null) ? '1' : '0',
      xEyes_CustomerInfo: (sessionStorage.getItem('CustomerInfo') !== null) ? sessionStorage.getItem('CustomerInfo') : '',
      xEyes_DeviceCode: deviceCode === undefined ? '' : deviceCode
    });

    return this.http.post(environment.apiUrl + ctrl, { Data: JSON.stringify(request) }, { headers })
      .pipe(map((data: Response_APIModel) => {
        if (data.Base.Rtn_State !== 1) {
          this.bsModal.show(MessageModalComponent
            , {
              class: 'modal-sm modal-smbox', initialState: {
                success: false, message: data.Base.Rtn_Message
                , target: data.Base.Rtn_URL
              }
            });
          this.blockUI.stop();
          throw new Error('bad request');
        }
        // 手機是否驗證
        switch (data.Verification.MobileVerified) {
          case 1:
            // 「一般登入」、「第三方登入」、「登入後讀購物車數量」不引導驗證手機
            if (command !== '1104' && command !== '1105' && command !== '1204') {
              this.modal.openModal('verifyMobile');
            }
            break;
          case 2:
          case 3:
            break;
          case 4:
            // tslint:disable: max-line-length
            sessionStorage.setItem('userCode', data.Verification.UserCode);
            sessionStorage.setItem('CustomerInfo', data.Verification.CustomerInfo);
            this.cookieService.set('userCode', data.Verification.UserCode, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
            this.cookieService.set('CustomerInfo', data.Verification.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
            break;
          default:
            this.onLogout();
            this.router.navigate(['/']);
        }
        this.blockUI.stop();
        return JSON.parse(data.Data);
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

  tofile(ctrl: string, request: any): Observable<any> {
    const headers = new HttpHeaders({
      xEyes_Command: '9901',
    });
    return this.http.post(environment.apiUrl + ctrl, request, { headers })
      .pipe(map((data: Response_APIModel) => {
        if (data.Base.Rtn_State !== 1) {
          this.bsModal.show(MessageModalComponent
            , {
              class: 'modal-sm modal-smbox', initialState: {
                success: false, message: data.Base.Rtn_Message
                , target: data.Base.Rtn_URL
              }
            });
          throw new Error('bad request');
        }
        return JSON.parse(data.Data);
      }, catchError(() => null)));
  }

  /** 登出 */
  onLogout(): void {
    const request = {
      User_Code: sessionStorage.getItem('userCode')
    };
    this.toApi_Logout('Home', '1109', request).subscribe((Data: any) => { });
    sessionStorage.clear();
    localStorage.clear();
    this.cookieService.deleteAll('/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    this.loginState = false;
    this.userFavCodes = [];
    this.pushCount = 0;

    //  APP登出導頁
    if (this.isApp !== null) {
      window.location.href = '/AppLogout';
    }
    // 第三方登入套件登出
    this.authService.signOut();
  }

  /**
   *  登出用
   *
   * @param ctrl 目標
   * @param command 指令編碼
   * @param request 傳送資料
   */
  toApi_Logout(ctrl: string, command: string, request: any, lat: number = null, lng: number = null): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      xEyes_Command: command,
      xEyes_X: (lng != null) ? lng.toString() : '',
      xEyes_Y: (lat != null) ? lat.toString() : '',
      xEyes_DeviceType: (this.isApp != null) ? '1' : '0',
      xEyes_CustomerInfo: (sessionStorage.getItem('CustomerInfo') !== null) ? sessionStorage.getItem('CustomerInfo') : ''
    });

    return this.http.post(environment.apiUrl + ctrl, { Data: JSON.stringify(request) }, { headers })
      .pipe(map((data: Response_APIModel) => {
        return JSON.parse(data.Data);
      }, catchError(() => null)));
  }

  /** 打開遮罩 */
  openBlock(): void {
    this.blockUI.start('Loading...'); // Start blocking
  }

  /** 顯示我的收藏 */
  showFavorites() {
    // get favorite from session and turn it from string to json
    if (sessionStorage.getItem('userFavorites') != null) {
      this.userFavArr = JSON.parse(sessionStorage.getItem('userFavorites'));
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
  favToggle(favAction: number, favType: number, favCode?: number) {
    const request: Request_MemberFavourite = {
      SelectMode: favAction,
      User_Code: sessionStorage.getItem('userCode'),
      AFP_UserFavourite: {
        UserFavourite_ID: 0,
        UserFavourite_CountryCode: 886,
        UserFavourite_Type: favType,
        UserFavourite_UserInfoCode: 0,
        UserFavourite_TypeCode: favCode,
        UserFavourite_IsDefault: 0
      },
    };

    if (this.loginState === true) {
      this.toApi('Member', '1511', request).subscribe((data: Response_MemberFavourite) => {
        // update favorites to session
        sessionStorage.setItem('userFavorites', JSON.stringify(data.List_UserFavourite));
        // update favorites to array
        this.showFavorites();
        if (favAction === 1) {
          this.modal.openModal('favorite');
        }
      });
    } else {
      this.loginPage();
    }
  }

  /** 讀取購物車 (主要為更新數量) */
  readCart() {
    const request: Request_ECCart = {
      SelectMode: 4, // 固定讀取
      User_Code: sessionStorage.getItem('userCode'),
      SearchModel: {
        Cart_Code: Number(this.cookieService.get('cart_code'))
      },
    };

    this.toApi('EC', '1204', request).subscribe((data: Response_ECCart) => {
      this.cookieService.set('cart_count_Mobii', data.Cart_Count.toString(), 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    });
  }

  /**
   * 優惠券按鈕行為（優惠券詳細不共用）
   * @param voucher 所選優惠券資訊
   * Voucher_FreqName: 0 已兌換 1 兌換 2 去商店 3 已使用 4 兌換完畢（限一元搶購） 5 使用 6 已逾期（限我的優惠+優惠券詳細） 7 未生效（限我的優惠+優惠券詳細） 8 使用中
   */
  onVoucher(voucher: AFP_Voucher) {
    if (this.loginState === true) {
      switch (voucher.Voucher_IsFreq) {
        case 1:
          // 加入到「我的優惠券」
          const request: Request_MemberUserVoucher = {
            User_Code: sessionStorage.getItem('userCode'),
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
          });
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
          if (this.route.snapshot.queryParams.showBack === undefined) {
            this.router.navigate(['VoucherDetail', code]);
          } else {
            // APP特例處理: 若是從會員過去則要隱藏返回鍵
            if (this.route.snapshot.queryParams.showBack) {
              const navigationExtras: NavigationExtras = {
                queryParams: { showBack: true }
              };
              this.router.navigate(['VoucherDetail', code], navigationExtras);
            }
          }
          break;
      }
    } else {
      this.loginPage();
    }
  }

  /**
   * 分享此頁（複製網址）
   * @param urlValue 網址
   * 若只需單純複製當前網址則不需傳值
   * 使用頁面: 周邊詳細、商品詳細、商家頁
   */
  onCopyUrl(urlValue?: string) {
    const el = document.createElement('textarea');
    if (urlValue === undefined) {
      el.value = location.href;
    } else {
      el.value = urlValue;
    }
    // 若設備是iphone, ipod 或 ipad且iOS版本比12.4舊
    if (this.iOSversion() !== null && this.iOSversion() <= 12.4) {
      const oldContentEditable = el.contentEditable;
      const oldReadOnly = el.readOnly;
      const range = document.createRange();

      el.contentEditable = 'true';
      el.readOnly = false;
      range.selectNodeContents(el);

      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(range);

      el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

      el.contentEditable = oldContentEditable;
      el.readOnly = oldReadOnly;

      document.execCommand('copy');
    } else {
      // 舊寫法(在iPhone iOS 12.4或之前版本的chrome不能用)
      el.setAttribute('contenteditable', 'true');
      // el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
    }
    document.body.removeChild(el);
    this.modal.show('message', { initialState: { success: true, message: '已複製網址!', showType: 1 } });
  }

  /** 取得設備iOS版本
   * （若設備非iphone, ipod 或 ipad，則回傳null）
   */
  iOSversion(): number {
    // 若設備是 iphone, ipod or ipad
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null) {
      const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      const d = {
        status: true,
        version: parseInt(v[1], 10),
        info: parseInt(v[1], 10) + '.' + parseInt(v[2], 10)
      };
      return Number(d.info);
    } else {
      return null;
    }
  }

  //  App導頁用
  AppRouter(active: string, type = 0) {
    if (this.isApp === null) {
      this.router.navigate([active]);
    } else {
      if (type === 0) {
        window.location.href = '/AppRedirect';
      } else {
        // (告訴APP畫面有轉換)
        window.location.href = active;
      }
    }
  }

  /** 判斷跳出網頁或APP的登入頁 */
  loginPage() {
    if (this.isApp == null) {
      this.modal.openModal('loginRegister');
    } else {
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        AppJSInterface.login();
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'login' });
      }
    }
  }

  /** 通知APP是否開啟BottomBar */
  appShowbottomBar(isOpen: boolean): void {
    if (this.isApp !== null) {
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        AppJSInterface.showBottomBar(isOpen);
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'showBottomBar', isShow: isOpen });
      }
    }
  }

  /** 打開JustKa iframe */
  showJustka(url: string): void {
    this.modal.show('justka', { initialState: { justkaUrl: url } });
  }

  /** 初始化推播 (註冊firebase、取得token、產生/取得deviceCode、傳送給後端並取得新消費者包) */
  initPush() {
    if (environment.production) {
      // 若已初始化過就不再重複一次
      if (!firebase.apps.length) {
        firebase.initializeApp(environment.firebase);
      } else {
        firebase.app();
      }
      const messaging = firebase.messaging();
      navigator.serviceWorker.ready.then(registration => {
        if (
          !!registration &&
          registration.active &&
          registration.active.state &&
          registration.active.state === 'activated'
        ) {
          // 若還未取過token則去要求允許推播，使用者允許後取得token，保存在變數
            if (this.firebaseToken === undefined) {
              messaging.useServiceWorker(registration);
              Notification
              .requestPermission()
              .then(() => messaging.getToken())
              .then(token => {
                this.firebaseToken = token;
                // send token to BE
                // get GUID (device code) from session, or generate one if there's no
                if (sessionStorage.getItem('M_DeviceCode') !== null) {
                  this.deviceCode = sessionStorage.getItem('M_DeviceCode');
                } else {
                  this.deviceCode = this.guid();
                  sessionStorage.setItem('M_DeviceCode', this.deviceCode);
                }
              });
            }

            const request: Request_AFPPushToken = {
              User_Code: sessionStorage.getItem('userCode'),
              Token: this.firebaseToken
            };
            this.toApi('Home', '1113', request, null, null, this.deviceCode).subscribe((data: Response_AFPPushToken) => {
              sessionStorage.setItem('CustomerInfo', data.CustomerInfo);
              this.cookieService.set('CustomerInfo', data.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
            });
          } else {
            console.warn('No active service worker found, not able to get firebase messaging');
          }
      });

      this.swPush.messages.subscribe(msg => {
        // count msg length and show red point
        this.pushCount += 1;
      });
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

  // 開啟側邊功能
  // multilayer animateCss
  callLayer(nextLayer) {
    if (this.tLayer.length === 0) {
      $('.multilayer').animateCss('slideInRight', '+d-block container faster');
    }
    if (this.tLayer[this.tLayer.length - 1] !== nextLayer) { this.tLayer.push(nextLayer); }
    $(nextLayer).animateCss('slideInRight', '+d-block container faster');
    $(nextLayer).css('z-index', this.layerIdx++);
  }
  backLayer() {
    const lastlayer = this.tLayer.pop();
    $(lastlayer).animateCss('slideOutRight', '-d-block container faster').removeAttr('style');
    if (this.tLayer.length === 0) {
      $('.multilayer').animateCss('slideOutRight', '-d-block container faster').removeAttr('style');
      // $('.modal-backdrop').remove();
    }
    this.tLayer = jQuery.grep(this.tLayer, (value) => {
      return value !== lastlayer;
    });
  }
  // sortlayer animateCss
  callsortLayer(nextLayer) {
    if (this.sLayer.length === 0) {
      $('.sortlayer').animateCss('slideInRight', '+d-block container faster');
      // tslint:disable-next-line: max-line-length
      $('body').append('<a class=\'w-100 h-100 masklayer\'><div class=\'modal-backdrop container\'></div></a>');
    }
    if (this.sLayer[this.sLayer.length - 1] !== nextLayer) { this.sLayer.push(nextLayer); }
    $(nextLayer).animateCss('slideInRight', '+d-block container faster');
  }
  backsortLayer() {
    $(this.sLayer.pop()).animateCss('slideOutRight', '-d-block container faster').removeAttr('style');
    if (this.sLayer.length === 0) {
      $('.sortlayer').animateCss('slideOutRight', '-d-block container faster').removeAttr('style');
      $('.masklayer').remove();
    }
  }
  // uplayer animateCss
  callLayerUp(nextLayerUp) {
    if (this.tLayerUp.length === 0) {
      $('.uplayer').animateCss('slideInUp', '+d-block container faster');
      // tslint:disable-next-line: max-line-length
      $('body').append('<a class=\'w-100 h-100 masklayer\'><div class=\'modal-backdrop container\'></div></a>');
    }
    if (this.tLayerUp[this.tLayerUp.length - 1] !== nextLayerUp) { this.tLayerUp.push(nextLayerUp); }
    $(nextLayerUp).animateCss('slideInUp', '+d-block container faster');
  }
  backLayerUp() {
    $(this.tLayerUp.pop()).animateCss('slideOutDown', '-d-block container faster').removeAttr('style');
    if (this.tLayerUp.length === 0) {
      $('.uplayer').animateCss('slideOutDown', '-d-block container faster').removeAttr('style');
      $('.masklayer').remove();
    }
  }


  // black mask
  open_mask(e) {
    $('.mask-bk').removeClass('d-none').addClass('d-block');
    $('.' + e).css('display', 'block');
  }
  close_mask(e) {
    $('.mask-bk').removeClass('d-block').addClass('d-none');
    $('.' + e).css('display', 'none');
  }

  // div switch
  div_switch() {
    $('.div-switch.d-block').removeClass('d-block').addClass('d-none1');
    $('.div-switch.d-none').removeClass('d-none').addClass('d-block');
    $('.div-switch.d-none1').removeClass('d-none1').addClass('d-none');
  }
}

// tslint:disable-next-line: class-name
export interface jQuery {
  animateCss(): void;
}

jQuery.prototype.animateCss = function(animationName, anotherCss, callback): void {
  const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  const isAdd = anotherCss.substr(0, 1);
  const addCss = anotherCss.substr(1);
  if (isAdd === '+' || isAdd === '-') {
    this.addClass('animated ' + animationName + ' ' + addCss).bind(animationEnd, function() {
      if (isAdd === '+') { $(this).addClass(addCss); }
      if (isAdd === '-') { $(this).removeClass(addCss); }
      $(this).removeClass('animated ' + animationName);
      if (callback) { callback(); }
    });
  }
  return this;
};

interface Request_AFPPushToken extends Model_ShareData {
  Token: string;
}

interface Response_AFPPushToken extends Model_ShareData {
  CustomerInfo: string;
}
