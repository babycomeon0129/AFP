import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Response_APIModel, Request_MemberFavourite, Response_MemberFavourite, AFP_Voucher,
  Request_MemberUserVoucher, Response_MemberUserVoucher, Request_ECCart, Response_ECCart, Model_ShareData
} from '@app/_models';
import { BsModalService } from 'ngx-bootstrap';
import { MessageModalComponent } from './shared/modal/message-modal/message-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from '@env/environment';
import { ModalService } from './shared/modal/modal.service';
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
  /** 首頁進場廣告是否開啟 (要再確認過瀏覽器版本後打開) */
  public adIndexOpen = false;
  /** 滑動layer */
  // public tmpLayer = [];
  // public tmpLayerSort = [];
  // public tmpLayerUp = [];

  @BlockUI() blockUI: NgBlockUI;
  constructor(private http: HttpClient, private bsModal: BsModalService, public modal: ModalService, private router: Router,
              private cookieService: CookieService, private route: ActivatedRoute, private authService: AuthService,
              private swPush: SwPush) {
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
        switch (data.Base.Rtn_State) {
          case 1: // Response OK
            // 手機是否驗證
            switch (data.Verification.MobileVerified) {
              case 1:
                // 「一般登入」、「第三方登入」、「登入後讀購物車數量」、「推播」不引導驗證手機
                if (command !== '1104' && command !== '1105' && command !== '1204' && command !== '1113') {
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
          case 9998: // user資料不完整，讓使用者登出
            this.modal.show('message', { initialState: { success: false, message: '請先登入', showType: 1}});
            this.onLogout();
            break;
          default: // 其他錯誤
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
        // if (data.Base.Rtn_State !== 1) {
        //   this.bsModal.show(MessageModalComponent
        //     , {
        //       class: 'modal-sm modal-smbox', initialState: {
        //         success: false, message: data.Base.Rtn_Message
        //         , target: data.Base.Rtn_URL
        //       }
        //     });
        //   this.blockUI.stop();
        //   throw new Error('bad request');
        // }
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
    // 第三方登入套件登出
    if (this.cookieService.get('Mobii_ThirdLogin') === 'true') {
      this.authService.signOut();
    }
    // 清除session、cookie、localStorage、我的收藏資料，重置登入狀態及通知數量
    sessionStorage.clear();
    localStorage.clear();
    this.cookieService.deleteAll('/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    // 為避免刪除不到以前存的Domain設置為www.mobii.ai的cookie，而導致的無法登出問題
    this.cookieService.deleteAll('/', 'www.mobii.ai', environment.cookieSecure, 'Lax');
    this.loginState = false;
    this.userFavCodes = [];
    this.pushCount = 0;

    //  APP登出導頁
    if (this.isApp !== null) {
      window.location.href = '/AppLogout';
    }
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
            if (voucher.Voucher_DedPoint > 0) {
              const initialState = {
                success: true,
                type: 1,
                message: `<div class="no-data"><img src="../../../../img/shopping/payment-ok.png"><p>兌換成功！</p></div>`
              };
              this.modal.show('message', { initialState });
            }
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
            this.router.navigate(['/Voucher/VoucherDetail', code]);
          } else {
            // APP特例處理: 若是從會員過去則要隱藏返回鍵
            if (this.route.snapshot.queryParams.showBack) {
              const navigationExtras: NavigationExtras = {
                queryParams: { showBack: true }
              };
              this.router.navigate(['/Voucher/VoucherDetail', code], navigationExtras);
            }
          }
          break;
      }
    } else {
      this.loginPage();
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


  /** 打開JustKa iframe */
  showJustka(url: string): void {
    this.modal.show('justka', { initialState: { justkaUrl: url } });
  }

  /** 初始化推播 (註冊firebase、取得token、產生/取得deviceCode、傳送給後端並取得新消費者包) */
  initPush() {
    if (environment.production) {
      // 不重複初始化
      if (!firebase.apps.length) {
        firebase.initializeApp(environment.firebase);
        const messaging = firebase.messaging();
        navigator.serviceWorker.ready.then(registration => {
          if (
            !!registration &&
            registration.active &&
            registration.active.state &&
            registration.active.state === 'activated'
          ) {
            messaging.useServiceWorker(registration);
            if (Notification.permission !== 'denied') {
              Notification
                .requestPermission()
                .then((permission) => {
                  if (permission === 'granted') {
                    messaging.getToken().then(token => {
                      this.firebaseToken = token;
                      // send token to BE
                      // get GUID (device code) from session, or generate one if there's no
                      if (sessionStorage.getItem('M_DeviceCode') !== null) {
                        this.deviceCode = sessionStorage.getItem('M_DeviceCode');
                      } else {
                        this.deviceCode = this.guid();
                        sessionStorage.setItem('M_DeviceCode', this.deviceCode);
                      }
                      this.toPushApi();
                    });
                  } else {
                    console.warn('The notification permission was not granted and blocked instead');
                  }
                });
            }
          } else {
            console.warn('No active service worker found, not able to get firebase messaging');
          }
        });
      } else {
        firebase.app();
        this.toPushApi();
      }

      this.swPush.messages.subscribe(msg => {
        // count msg length and show red point
        this.pushCount += 1;
      });
    }
  }

  /** 推播-取得含device code的新消費者包 */
  toPushApi() {
    const request: Request_AFPPushToken = {
      User_Code: sessionStorage.getItem('userCode'),
      Token: this.firebaseToken
    };
    this.toApi('Home', '1113', request, null, null, this.deviceCode).subscribe((data: Response_AFPPushToken) => {
      sessionStorage.setItem('CustomerInfo', data.CustomerInfo);
      this.cookieService.set('CustomerInfo', data.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    });
  }

  /** 產生device code */
  guid(): string {
    let d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line: no-bitwise
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // tslint:disable-next-line: no-bitwise
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

   /** 通知APP是否開啟BottomBar */
   appShowMobileFooter(isOpen: boolean): void {
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

  /** 分享功能 */
  shareContent(sharedContent: string) {
    if (this.isApp === null) {
      // web
      this.modal.show('msgShare', { initialState: {sharedText: sharedContent} });
    } else {
      // APP: 呼叫APP分享功能
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        AppJSInterface.appShare(sharedContent);
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'appShare', content: sharedContent });
      }
    }
  }

  // 開啟側邊功能
  // multilayer animateCss
  // callLayer(nextLayer) {
  //   const animationStard = ['slideInRight','animated','d-block','container','faster'];
  //   const target = document.querySelector(nextLayer);
  //   const targetParent = document.querySelector('.multilayer');
  //   this.tmpLayer.push(nextLayer);
  //   if(targetParent.getAttribute('class').length == 10){
  //     for (var i = 0; i < animationStard.length; ++i) {
  //       targetParent.classList.add(animationStard[i]);
  //       target.classList.add(animationStard[i]);
  //     }
  //   }else{
  //     for (var i = 0; i < animationStard.length; ++i) {
  //       target.classList.add(animationStard[i]);
  //     }
  //   }
  // }
  // backLayer() {
  //   const animationEnd = ['slideOutRight','animated','d-block','container','faster'];
  //   const target = document.querySelector(this.tmpLayer.pop());
  //   const targetParent = document.querySelector('.multilayer');
  //   targetParent.classList.replace('slideInRight','slideOutRight');
  //   target.classList.replace('slideInRight','slideOutRight');
  //   if(this.tmpLayer.length == 0){
  //     setTimeout(()=>{
  //       for (var i = 0; i < animationEnd.length; ++i) {
  //         targetParent.classList.remove(animationEnd[i]);
  //         target.classList.remove(animationEnd[i]);
  //       }
  //     },1000);
  //   }else{
  //     setTimeout(()=>{
  //       for (var i = 0; i < animationEnd.length; ++i) {
  //         target.classList.remove(animationEnd[i]);
  //       }
  //     },1000);
  //   };
  // }

  // sortlayer animateCss
  // callsortLayer(nextLayer) {
  //   const animationStard = ['slideInRight','animated','d-block','container','faster'];
  //   const target = document.querySelector(nextLayer);
  //   const targetParent = document.querySelector('.sortlayer');
  //   this.tmpLayerSort.push(nextLayer);
  //   let mask = document.createElement("div");
  //   let maskbox = document.createElement("a");
  //   mask.className = 'masklayer w-100 h-100';
  //   maskbox.className = 'modal-backdrop container';
  //   if(targetParent.getAttribute('class').length == 9){
  //     document.body.prepend(maskbox);
  //     maskbox.prepend(mask);
  //     for (var i = 0; i < animationStard.length; ++i) {
  //       targetParent.classList.add(animationStard[i]);
  //       target.classList.add(animationStard[i]);
  //     }
  //   }else{
  //     for (var i = 0; i < animationStard.length; ++i) {
  //       target.classList.add(animationStard[i]);
  //     }
  //   }
  // }
  // backsortLayer() {
  //   const animationEnd = ['slideOutRight','animated','d-block','container','faster'];
  //   const target = document.querySelector(this.tmpLayerSort.pop());
  //   const targetParent = document.querySelector('.sortlayer');
  //   const maskbox = document.querySelector('.modal-backdrop');
  //   targetParent.classList.replace('slideInRight','slideOutRight');
  //   target.classList.replace('slideInRight','slideOutRight');
  //   if(this.tmpLayerSort.length == 0){
  //     maskbox.remove();
  //     setTimeout(()=>{
  //       for (var i = 0; i < animationEnd.length; ++i) {
  //         targetParent.classList.remove(animationEnd[i]);
  //         target.classList.remove(animationEnd[i]);
  //       }
  //     },1000);
  //   }else{
  //     setTimeout(()=>{
  //       for (var i = 0; i < animationEnd.length; ++i) {
  //         target.classList.remove(animationEnd[i]);
  //       }
  //     },1000);
  //   };
  // }

  // uplayer animateCss
  // callLayerUp(nextLayer) {
  //   const animationStard = ['slideInUp','animated','d-block','container','faster'];
  //   const target = document.querySelector(nextLayer);
  //   const targetParent = document.querySelector('.uplayer');
  //   this.tmpLayerUp.push(nextLayer);
  //   let mask = document.createElement("div");
  //   let maskbox = document.createElement("a");
  //   mask.className = 'masklayer w-100 h-100';
  //   maskbox.className = 'modal-backdrop container';
  //   if(targetParent.getAttribute('class').length == 7){
  //     targetParent.before(maskbox);
  //     maskbox.prepend(mask);
  //     for (var i = 0; i < animationStard.length; ++i) {
  //       targetParent.classList.add(animationStard[i]);
  //       target.classList.add(animationStard[i]);
  //     }
  //   }else{
  //     for (var i = 0; i < animationStard.length; ++i) {
  //       target.classList.add(animationStard[i]);
  //     }
  //   }
  // }
  // backLayerUp() {
  //   const animationEnd = ['slideOutDown','animated','d-block','container','faster'];
  //   const target = document.querySelector(this.tmpLayerUp.pop());
  //   const targetParent = document.querySelector('.uplayer');
  //   const maskbox = document.querySelector('a.modal-backdrop');
  //   targetParent.classList.replace('slideInUp','slideOutDown');
  //   target.classList.replace('slideInUp','slideOutDown');
  //   maskbox.remove();
  //   setTimeout(()=>{
  //     for (var i = 0; i < animationEnd.length; ++i) {
  //       targetParent.classList.remove(animationEnd[i]);
  //       target.classList.remove(animationEnd[i]);
  //     }
  //   },1000);
  // }
}

// tslint:disable-next-line: class-name
// export interface jQuery {
//   animateCss(): void;
// }

// jQuery.prototype.animateCss = function(animationName: string, anotherCss: string, callback: () => void): void {
//   const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
//   const isAdd = anotherCss.substr(0, 1);
//   const addCss = anotherCss.substr(1);
//   if (isAdd === '+' || isAdd === '-') {
//     this.addClass('animated ' + animationName + ' ' + addCss).bind(animationEnd, function() {
//       if (isAdd === '+') { $(this).addClass(addCss); }
//       if (isAdd === '-') { $(this).removeClass(addCss); }
//       $(this).removeClass('animated ' + animationName);
//       if (callback) { callback(); }
//     });
//   }
//   return this;
// };

interface Request_AFPPushToken extends Model_ShareData {
  Token: string;
}

interface Response_AFPPushToken extends Model_ShareData {
  CustomerInfo: string;
}
