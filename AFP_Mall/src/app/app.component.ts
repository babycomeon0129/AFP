import { environment } from 'src/environments/environment';
import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Model_ShareData, Model_CustomerDetail } from './_models';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ModalService } from './service/modal.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { SwPush } from '@angular/service-worker';
import firebase from 'firebase/app';
import 'firebase/messaging';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: './app.component.html',
  animations: [slideInAnimation]
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  /** 前往頁面url (手機版footer icon變色判別 ) */
  public headingPage = '';
  /** 不顯示手機版footer的頁面 */
  public mobileNoFooter = ['Map', 'ShoppingCart', 'ShoppingOrder', 'ShoppingPayment', 'Game/', 'QA',
  'ExploreDetail', 'ProductDetail', 'VoucherDetail', 'Notification/', 'Terms', 'Privacy', 'MyProfile', 'CellVerification',
   'MyAddress', 'PasswordUpdate', 'ThirdBinding', 'QA', 'DeliveryInfo' ];
  /** 是否顯示手機版footer */
  public showMobileFooter = true;
  /** GUID (推播使用) */
  public deviceCode: string;

  constructor(private router: Router, public appService: AppService, private activatedRoute: ActivatedRoute, public modal: ModalService,
              private cookieService: CookieService, private swPush: SwPush) {
    if (sessionStorage.getItem('CustomerInfo') !== null && sessionStorage.getItem('userCode') !== null
      && sessionStorage.getItem('userName') !== null) {
      this.appService.loginState = true;
    }

    // App訪問
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.appService.isApp == null && typeof params.isApp !== 'undefined') {
        this.appService.isApp = params.isApp;
      }

      if (typeof params.loginType !== 'undefined') {
        // tslint:disable-next-line: triple-equals
        if (params.loginType == 1) {
          if (typeof params.customerInfo !== 'undefined' && typeof params.userCode !== 'undefined'
            && typeof params.userName !== 'undefined') {
            sessionStorage.setItem('CustomerInfo', encodeURIComponent(params.customerInfo));
            sessionStorage.setItem('userCode', encodeURIComponent(params.userCode));
            sessionStorage.setItem('userName', params.userName);

            // tslint:disable: max-line-length
            this.cookieService.set('userName', params.userName, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
            this.cookieService.set('userCode', encodeURIComponent(params.userCode), 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
            this.cookieService.set('CustomerInfo', encodeURIComponent(params.customerInfo), 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');

            this.appService.loginState = true;
          }
          // tslint:disable-next-line: triple-equals
        } else if (params.loginType == 2) {
          sessionStorage.clear();
          this.cookieService.deleteAll();
          this.appService.loginState = false;
        }
      }

      //  訂單用
      if (typeof params.Order_CInfo !== 'undefined' && typeof params.Order_UserCode !== 'undefined'
        && typeof params.Order_UserName !== 'undefined') {
        sessionStorage.setItem('CustomerInfo', params.Order_CInfo);
        sessionStorage.setItem('userCode', params.Order_UserCode);
        sessionStorage.setItem('userName', params.Order_UserName);

        this.cookieService.set('userName', params.Order_UserName, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
        this.cookieService.set('userCode', params.Order_UserCode, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
        this.cookieService.set('CustomerInfo', params.Order_CInfo, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
        this.appService.loginState = true;
      }
      //  購物車編碼 APP用
      if (typeof params.cartCode !== 'undefined') {
        this.cookieService.set('cart_code', params.cartCode, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        this.headingPage = this.router.url;
        return;
      }
      window.scrollTo(0, 0);
      // 手機版-只有大首頁、探索周邊首頁、任務牆、通知頁、我的列表頁露出footer
      this.showMobileFooter = !this.mobileNoFooter.some(page => this.router.url.includes(page));
      this.appService.appShowbottomBar(this.showMobileFooter);
    });

    // 通知推播
    if (environment.production) {
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
        Notification
          .requestPermission()
          .then(() => messaging.getToken())
          .then(token => {
            // send token to BE
            // get GUID (device code) from session, or generate one if there's no
            if (sessionStorage.getItem('M_DeviceCode') !== null) {
              this.deviceCode = sessionStorage.getItem('M_DeviceCode');
            } else {
              this.deviceCode = this.guid();
              sessionStorage.setItem('M_DeviceCode', this.deviceCode);
            }

            const request: Request_AFPPushToken = {
              User_Code: sessionStorage.getItem('userCode'),
              Token: token
            };
            this.appService.toApi('Home', '1113', request, null, null, this.deviceCode).subscribe((data: Response_AFPPushToken) => {
              sessionStorage.setItem('CustomerInfo', data.CustomerInfo);
              this.cookieService.set('CustomerInfo', data.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
            });
          });
        } else {
          console.warn('No active service worker found, not able to get firebase messaging');
        }
      });

      this.swPush.messages.subscribe(msg => {
        // count msg length and show red point
        this.appService.pushCount += 1;
      });
    }

    // this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => window.scrollTo(0, 0));

    // // App訪問
    // this.activatedRoute.queryParams.subscribe(params => {
    //   if (this.appService.isApp == null && typeof params.isApp !== 'undefined') {
    //     this.appService.isApp = params.isApp;
    //   }

    //   if (typeof params.loginType !== 'undefined') {
    //     // tslint:disable-next-line: triple-equals
    //     if (params.loginType == 1) {
    //       if (typeof params.customerInfo !== 'undefined' && typeof params.userCode !== 'undefined'
    //         && typeof params.userName !== 'undefined') {
    //         sessionStorage.setItem('CustomerInfo', encodeURIComponent(params.customerInfo));
    //         sessionStorage.setItem('userCode', encodeURIComponent(params.userCode));
    //         sessionStorage.setItem('userName', params.userName);

    //         this.cookieService.set('userName', params.userName, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    //         this.cookieService.set('userCode', encodeURIComponent(params.userCode), 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    //         this.cookieService.set('CustomerInfo', encodeURIComponent(params.customerInfo), 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    //         this.appService.loginState = true;
    //         console.log('set2:' + this.appService.loginState);
    //       }
    //       // tslint:disable-next-line: triple-equals
    //     } else if (params.loginType == 2) {
    //       sessionStorage.clear();
    //       this.cookieService.deleteAll();
    //     }
    //   }

    //   //  訂單用
    //   if (typeof params.Order_CInfo !== 'undefined' && typeof params.Order_UserCode !== 'undefined'
    //         && typeof params.Order_UserName !== 'undefined') {
    //         sessionStorage.setItem('CustomerInfo', params.Order_CInfo);
    //         sessionStorage.setItem('userCode', params.Order_UserCode);
    //         sessionStorage.setItem('userName', params.Order_UserName);

    //         this.cookieService.set('userName', params.Order_UserName, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    //         this.cookieService.set('userCode', params.Order_UserCode, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    //         this.cookieService.set('CustomerInfo', params.Order_CInfo, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    //         this.appService.loginState = true;
    //       }
    //   //  購物車編碼 APP用
    //   if (typeof params.cartCode !== 'undefined') {
    //     this.cookieService.set('cart_code', params.cartCode, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    //   }
    // });
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

  /** 前往頁面前判斷登入狀態 */
  goTo() {
    if (this.appService.loginState === true) {
      this.router.navigate(['/Notification']);
    } else {
      this.appService.loginPage();
    }
  }

  /** 獲取這個 outlet 指令的值（透過 #outlet="outlet"），並根據當前活動路由的自訂資料返回一個表示動畫狀態的字串值。用此資料來控制各個路由之間該執行哪個轉場 */
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  ngAfterViewInit(): void {
    const $window = $(window);

    $window.on('scroll', () => {
      if ($window.scrollTop() > 100) {
        $('.scroll-top-wrapper').addClass('show');
      } else if ($window.scrollTop() < 200) {
        $('.tag-topbox').removeClass('fixed-top container');
        $('.nav-tabs-box').removeClass('tag-top');
      }
    });

  }

  ngAfterViewChecked() {
    // 隱藏抓不到src的圖片(例: 類型為線上商店的優惠券icon)
    $('img').on('stalled', function() {
      $(this).hide();
    });
  }
}

interface Request_AFPPushToken extends Model_ShareData {
  Token: string;
}

interface Response_AFPPushToken extends Model_ShareData {
  CustomerInfo: string;
}
