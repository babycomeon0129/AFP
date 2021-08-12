import { ModalService } from '@app/shared/modal/modal.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Response_APIModel, Request_MemberFavourite, Response_MemberFavourite, AFP_Voucher,
  Request_MemberUserVoucher, Response_MemberUserVoucher, Request_ECCart, Response_ECCart, Model_ShareData
} from '@app/_models';
import { BsModalService } from 'ngx-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from '@env/environment';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'angularx-social-login';
//import { SwPush } from '@angular/service-worker';
// import firebase from 'firebase/app';
// import 'firebase/messaging';
// 推播
import { AngularFireMessaging } from '@angular/fire/messaging';
// Component
import { VerifyMobileModalComponent } from './shared/modal/verify-mobile-modal/verify-mobile-modal.component';
import { FavoriteModalComponent } from './shared/modal/favorite-modal/favorite-modal.component';
import { LoginRegisterModalComponent } from './shared/modal/login-register-modal/login-register-modal.component';
import { JustkaModalComponent } from './shared/modal/justka-modal/justka-modal.component';
import { MsgShareModalComponent } from './shared/modal/msg-share-modal/msg-share-modal.component';
import { MessageModalComponent } from './shared/modal/message-modal/message-modal.component';

declare var AppJSInterface: any;

@Injectable({
  providedIn: 'root'
})
export class AppService {
  /** 登入狀態 */
  public loginState = false;
  /** 使用者暱稱 */
  public userName: string;
  /** App訪問 */
  public isApp: number = null;
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
  public defaultImage = '/img/share/eee.jpg';
  /** 當前訊息 */
  public currentMessage = new BehaviorSubject(null);
  /** 推播訊息數量 */
  public pushCount = Number(this.cookieService.get('pushCount')) || 0;
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
  /** 引導手機驗證 modal 是否已開啟（控制此 modal 只開啟一個，避免在需呼叫１個以上 API 的頁面重複開啟）
   * TODO: 暫時作法
   */
  public verifyMobileModalOpened = false;
  /** 是否顯示返回鍵 (app特例) */
  public showBack = false;
  /** line 登入用 state (用於取code) */
  public lineSigninState: string;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private http: HttpClient, private bsModal: BsModalService, private router: Router,
    private cookieService: CookieService, private route: ActivatedRoute, private authService: AuthService, private angularFireMessaging: AngularFireMessaging, private modal: ModalService) {
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
      xEyes_DeviceType: (this.isApp != null) ? '1' : '0',
      xEyes_CustomerInfo: (sessionStorage.getItem('CustomerInfo') !== null) ? sessionStorage.getItem('CustomerInfo') : '',
      xEyes_DeviceCode: deviceCode === undefined ? '' : deviceCode
    });

    if(command === '1500') {
      console.log(`session:${sessionStorage.getItem('CustomerInfo')}`);
      console.log(headers);
    }
    return this.http.post(environment.apiUrl + ctrl, { Data: JSON.stringify(request) }, { headers })
      .pipe(map((data: Response_APIModel) => {
        this.blockUI.stop();
        switch (data.Base.Rtn_State) {
          case 1: // Response OK
            // 手機是否驗證
            switch (data.Verification.MobileVerified) {
              case 1:
                // 「一般登入」、「第三方登入」、「登入後讀購物車數量」、「推播」不引導驗證手機
                if (command !== '1104' && command !== '1105' && command !== '1204' && command !== '1113') {
                  if (!this.verifyMobileModalOpened) {
                    this.bsModal.show(VerifyMobileModalComponent);
                    this.verifyMobileModalOpened = true;
                  }
                }
                break;
              case 2:
              case 3:
                break;
              case 4:
                sessionStorage.setItem('userCode', data.Verification.UserCode);
                sessionStorage.setItem('CustomerInfo', data.Verification.CustomerInfo);
                this.cookieService.set('userCode', data.Verification.UserCode, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
                this.cookieService.set('CustomerInfo', data.Verification.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
                break;
              default:
                this.onLogout();
                this.router.navigate(['/']);
            }
            return JSON.parse(data.Data);
          case 9996: // 查無商品詳細頁資料
            // this.modal.show('message', { initialState: { success: false, message: data.Base.Rtn_Message, showType: 1, checkBtnMsg: `確定`, target: 'GoBack' } });
            this.bsModal.show(MessageModalComponent, { initialState: { success: false, message: data.Base.Rtn_Message, showType: 1, checkBtnMsg: `確定`, target: 'GoBack' } });
            break;
          case 9998: // user資料不完整，讓使用者登出
            // this.modal.show('message', { initialState: { success: false, message: '請先登入', showType: 2, singleBtnMsg: `重新登入` } });
            this.bsModal.show(MessageModalComponent, { initialState: { success: false, message: '請先登入', showType: 2, singleBtnMsg: `重新登入` } });
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
    // 清除session、cookie、我的收藏資料，重置登入狀態及通知數量
    sessionStorage.clear();
    this.cookieService.deleteAll('/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    this.loginState = false;
    this.userFavCodes = [];
    this.pushCount = 0;
    this.verifyMobileModalOpened = false;

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
    for (var i = timestampStr.length - 1; i >= 0; i--) {
      reverseTimestamp += timestampStr[i];
    }
    // 取前4碼
    const timestampFirst4 = reverseTimestamp.substring(0, 4);
    // 取得10個隨機英文字母，組成字串
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    };
    const engLettersArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
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
  favToggle(favAction: number, favType: number, favCode?: number): void {
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

    if (this.loginState) {
      this.toApi('Member', '1511', request).subscribe((data: Response_MemberFavourite) => {
        // update favorites to session
        sessionStorage.setItem('userFavorites', JSON.stringify(data.List_UserFavourite));
        // update favorites to array
        this.showFavorites();
        if (favAction === 1) {
          // this.modal.openModal('favorite');
          this.bsModal.show(FavoriteModalComponent);

        }
      });
    } else {
      this.loginPage();
    }
  }

  /** 讀取購物車 (主要為更新數量) */
  readCart(): void {
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
  onVoucher(voucher: AFP_Voucher): void {
    // 點擊兌換時先進行登入判斷
    if (this.loginState) {
      switch (voucher.Voucher_IsFreq) {
        case 1:
          // 先判斷是否需要扣點才能兌換，如需扣點必須先跳扣點提示
          if (voucher.Voucher_DedPoint > 0) {
            this.modal.confirm({
              initialState: {
                message: `請確定是否扣除 Mobii! Points ${voucher.Voucher_DedPoint} 點兌換「${voucher.Voucher_ExtName}」？`
              }
            }).subscribe(res => {
              // 點選確定扣點
              if (res) {
                this.exchangeVoucher(voucher);
              } else {
                // 點選取消扣點
                const initialState = {
                  success: true,
                  type: 1,
                  message: `<div class="no-data no-transform"><img src="../../../../img/shopping/payment-failed.png"><p>兌換失敗！</p></div>`
                };
                this.bsModal.show(MessageModalComponent, { initialState });
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
            this.router.navigate(['/Voucher/VoucherDetail', code], { queryParams: { showBack: false } });
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

  /** 兌換優惠券 */
  exchangeVoucher(voucher: AFP_Voucher): void {
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
      // 如果是扣點才能兌換的優惠券，需跳兌換成功提示
      if (voucher.Voucher_DedPoint > 0) {
        const initialState = {
          success: true,
          type: 1,
          message: `<div class="no-data no-transform"><img src="../../../../img/shopping/payment-ok.png"><p>兌換成功！</p></div>`
        };
        // this.modal.show('message', { initialState });
        this.bsModal.show(MessageModalComponent, { initialState });
      }
    });
  }

  //  App導頁用
  AppRouter(active: string, type = 0): void {
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
  loginPage(): void {
    if (this.isApp == null) {
      // this.modal.openModal('loginRegister');
      this.bsModal.show(LoginRegisterModalComponent, { class: 'modal-full' });
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
    // this.modal.show('justka', { initialState: { justkaUrl: url } });
    this.bsModal.show(JustkaModalComponent, { initialState: { justkaUrl: url } });
  }

  /** 初始化推播
   * (註冊 service worker、告訴 firebase.messaging 服務之後的訊息請交由此 SW 處理、取得token、產生/取得 deviceCode、傳送給後端並取得新消費者包)
   */
  // initPush(): void {
  //   if (environment.swActivate) {
  //     // 不重複初始化
  //     if (!firebase.apps.length) {
  //       firebase.initializeApp(environment.firebaseConfig);
  //       const messaging = firebase.messaging();
  //       if ('serviceWorker' in navigator) {
  //         // 註冊 service worker
  //         navigator.serviceWorker.ready.then(registration => {
  //           if (
  //             !!registration &&
  //             registration.active &&
  //             registration.active.state &&
  //             registration.active.state === 'activated'
  //           ) {
  //             messaging.useServiceWorker(registration); // 告訴 firebase.messaging 服務之後的訊息請交由此 SW 處理
  //             if (Notification.permission !== 'denied') {
  //               Notification
  //                 .requestPermission()
  //                 .then((permission) => {
  //                   if (permission === 'granted') {
  //                     // 取得token
  //                     messaging.getToken().then(token => {
  //                       this.firebaseToken = token;
  //                       // send token to BE
  //                       // get GUID (device code) from session, or generate one if there's no
  //                       if (sessionStorage.getItem('M_DeviceCode') !== null) {
  //                         this.deviceCode = sessionStorage.getItem('M_DeviceCode');
  //                       } else {
  //                         this.deviceCode = this.guid();
  //                         sessionStorage.setItem('M_DeviceCode', this.deviceCode);
  //                       }
  //                       this.toPushApi();
  //                     });
  //                   } else {
  //                     console.warn('The notification permission was not granted and blocked instead.');
  //                   }
  //                 });
  //             }
  //           } else {
  //             console.warn('No active service worker found, not able to get firebase messaging.');
  //           }
  //         }, (error) => {
  //           console.log('Service worker registration failed:', error);
  //         });
  //       } else {
  //         console.log('Service workers are not supported.');
  //       }
  //     } else {
  //       firebase.app();
  //       this.toPushApi();
  //     }

  //     // this.swPush.messages.subscribe(msg => {
  //     //   // count msg length and show red point
  //     //   this.pushCount += 1;
  //     //   this.cookieService.set('pushCount', this.pushCount.toString(), 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
  //     // });
  //   }
  // }

  /** 推播-取得含device code的新消費者包 */
  // toPushApi(): void {
  //   const request: Request_AFPPushToken = {
  //     User_Code: sessionStorage.getItem('userCode'),
  //     Token: this.firebaseToken
  //   };
  //   this.toApi('Home', '1113', request, null, null, this.deviceCode).subscribe((data: Response_AFPPushToken) => {
  //     sessionStorage.setItem('CustomerInfo', data.CustomerInfo);
  //     this.cookieService.set('CustomerInfo', data.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
  //   });
  // }

  /** 向firebase message 請求token */
  getPushPermission(): void {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        if (this.loginState) {
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
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
        this.pushCount++;
        this.cookieService.set('pushCount', this.pushCount.toString(), 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      });
  }

  /** 推播-取得含device code的新消費者包 */
  toPushApi(token: string): void {
    if (this.deviceCode === null) {
      this.deviceCode = this.guid();
      localStorage.setItem('M_DeviceCode', this.deviceCode);
      // this.cookieService.set('M_DeviceCode', this.deviceCode, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');

    }
    const request: Request_AFPPushToken = {
      User_Code: sessionStorage.getItem('userCode'),
      Token: token
    };
    this.toApi('Home', '1113', request, null, null, this.deviceCode).subscribe((data: Response_AFPPushToken) => {
      console.log(data);
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
      // this.modal.show('msgShare', { initialState: { sharedText: sharedContent } });
      this.bsModal.show(MsgShareModalComponent, { initialState: { sharedText: sharedContent } });
    } else {
      // APP: 呼叫APP分享功能
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        AppJSInterface.appShare(sharedContent + '\n' + APPShareUrl);
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'appShare', content: sharedContent + '\n' + APPShareUrl });
      }
    }
  }

}


/** 推撥登記 RequestModel */
interface Request_AFPPushToken extends Model_ShareData {
  /** FireBase Token */
  Token: string;
}

/** 推撥登記 ResponseModel */
interface Response_AFPPushToken extends Model_ShareData {
  /** 消費者包 */
  CustomerInfo: string;
}
