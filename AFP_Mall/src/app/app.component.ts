import { environment } from 'src/environments/environment';
import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Model_ShareData, Model_CustomerDetail } from './_models';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ModalService } from './service/modal.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';

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
   'MyAddress', 'PasswordUpdate', 'ThirdBinding', 'QA', 'DeliveryInfo'];
  /** 是否顯示手機版footer */
  public showMobileFooter = true;
  /** 裝置系統或瀏覽器版本是否過舊 */
  public isOld: boolean;
  /** 需更新項目 */
  public targetToUpdate: string;
  /** 是否顯示過舊提示 */
  public showOldHint = true;

  constructor(private router: Router, public appService: AppService, private activatedRoute: ActivatedRoute, public modal: ModalService,
              private cookieService: CookieService) {
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
    this.detectOld();
    this.appService.initPush();

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

  /** 偵測裝置系統或瀏覽器版本是否過舊 */
  detectOld() {
    // mobile OS
      // iOS: 2 most recent major versions
      // Android: 7 - 10
    // browser
      // Chrome: latest; Firefox: latest; Edge: 2 most recent major versions; Safari: 2 most recent major versions
    const ua = navigator.userAgent;

    if (ua.match(/iPhone|iPad|iPod/i)) {
      // iOS
      const match = ua.match(/OS\s([0-9\.]*)/i);
      const ver = parseInt(match[1], 10);
      if (ver < 12) {
        this.isOld = true;
        this.targetToUpdate = '裝置';
      } else {
        this.isOld = false;
      }
    } else if (ua.match(/android/i)) {
      // Android
      const match = ua.match(/android\s([0-9\.]*)/i);
      const ver = parseInt(match[1], 10);
      if (ver < 7) {
        this.isOld = true;
        this.targetToUpdate = '裝置';
      } else {
        this.isOld = false;
      }
    } else if (ua.includes('Chrome') && !ua.includes('Edg')) {
      // Chrome
      const match = ua.match(/Chrome\/([0-9]+)\./);
      const ver = parseInt(match[1], 10);
      if (ver < 86) {
        this.isOld = true;
        this.targetToUpdate = '瀏覽器';
      } else {
        this.isOld = false;
      }
    } else if (ua.includes('Firefox')) {
      // Firefox
      const match = ua.match(/Firefox\/([0-9]+)\./);
      const ver = parseInt(match[1], 10);
      if (ver < 83) {
        this.isOld = true;
        this.targetToUpdate = '瀏覽器';
      } else {
        this.isOld = false;
      }
    } else if (ua.includes('Edg')) {
      // Edge
      const match = ua.match(/Edg\/([0-9]+)\./);
      const ver = parseInt(match[1], 10);
      if (ver < 86) {
        this.isOld = true;
        this.targetToUpdate = '瀏覽器';
      } else {
        this.isOld = false;
      }
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      // Safari
      const match = ua.match(/Safari\/([0-9]+)\./);
      const ver = parseInt(match[1], 10);
      if (ver < 13) {
        this.isOld = true;
        this.targetToUpdate = '瀏覽器';
      } else {
        this.isOld = false;
      }
    }
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
