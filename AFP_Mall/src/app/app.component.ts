import { environment } from '@env/environment';
import { Component, KeyValueDiffer, KeyValueDiffers, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ResolveEnd } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ModalService } from './shared/modal/modal.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { filter } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: './app.component.html',
  animations: [slideInAnimation]
})
export class AppComponent implements OnInit {
  /** 裝置系統或瀏覽器版本是否過舊 */
  public isOld: boolean;
  /** 需更新項目 */
  public targetToUpdate: string;
  /** 是否顯示過舊提示 */
  public showOldHint = true;
  /** 變化追蹤（登入狀態） */
  private serviceDiffer: KeyValueDiffer<string, any>;

  constructor(private router: Router, public appService: AppService, private activatedRoute: ActivatedRoute, public modal: ModalService,
              private cookieService: CookieService, private differs: KeyValueDiffers) {
    this.serviceDiffer = this.differs.find({}).create();
    if (sessionStorage.getItem('CustomerInfo') !== null && sessionStorage.getItem('userCode') !== null
      && sessionStorage.getItem('userName') !== null) {
      this.appService.loginState = true;
      this.appService.userName = sessionStorage.getItem('userName');
    }

    // App訪問
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.appService.isApp == null && typeof params.isApp !== 'undefined') {
        this.appService.isApp = params.isApp;
      }

      if (typeof params.loginType !== 'undefined') {
        // tslint:disable-next-line: triple-equals
        if (params.loginType == 1) {
          // APP 為登入狀態則將該 webview 也同步為登入
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
          // APP 為登出狀態但該 webview 登入狀態被cache住還是登入則將其改為登出
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
    // 當路由器成功完成路由的解析階段時，先通知app將footer關閉(開啟則靠app-mobile-footer通知開啟)
    this.router.events.pipe(filter(event => event instanceof ResolveEnd ))
                      .subscribe((event: ResolveEnd ) => {
                                    window.scrollTo(0, 0);
                                    this.appService.appShowMobileFooter(false);
                                    // 取得前一頁面url
                                    this.appService.prevUrl = this.appService.currentUrl;
                                    this.appService.currentUrl = event.url;
                                    this.appService.verifyMobileModalOpened = false;
                                  });
    this.detectOld();
    this.appService.initPush();
  }


  /** 獲取這個 outlet 指令的值（透過 #outlet="outlet"），並根據當前活動路由的自訂資料返回一個表示動畫狀態的字串值。用此資料來控制各個路由之間該執行哪個轉場 */
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  // tslint:disable: no-redundant-jsdoc
  /** 偵測裝置系統或瀏覽器版本是否過舊（根據Angular browser support）
   * @property target 偵測目標
   * @property type OS - 0, browser - 1
   * @property condition 可從userAgent中找出該目標的條件
   * @property matchRegex 陣列[目標及版本, 版本], parseInt()第[1]個項目後取得版本
   * @property minVer 目前Angular支援該目標的最低版本
   */
  detectOld() {
    const ua = navigator.userAgent;
    const targetList = [
      {
        target: 'iOS',
        type: 0,
        condition: ua.match(/iPhone|iPad|iPod/i) !== null,
        matchRegex: ua.match(/OS\s([0-9\.]*)/i),
        minVer: 12
      },
      {
        target: 'Android',
        type: 0,
        condition: ua.match(/android/i) !== null,
        matchRegex: ua.match(/android\s([0-9\.]*)/i),
        minVer: 7
      },
      {
        target: 'Chrome',
        type: 1,
        condition: ua.includes('Chrome') && !ua.includes('Edg'),
        matchRegex: ua.match(/Chrome\/([0-9]+)\./),
        minVer: 86
      },
      {
        target: 'Firefox',
        type: 1,
        condition: ua.includes('Firefox'),
        matchRegex: ua.match(/Firefox\/([0-9]+)\./),
        minVer: 83
      },
      {
        target: 'Edge',
        type: 1,
        condition: ua.includes('Edg'),
        matchRegex: ua.match(/Edg\/([0-9]+)\./),
        minVer: 86
      },
      {
        target: 'Safari',
        type: 1,
        condition: ua.includes('Safari') && !ua.includes('Chrome'),
        matchRegex: ua.match(/Safari\/([0-9]+)\./),
        minVer: 13
      }
    ];

    const result = targetList.find(t => t.condition && parseInt(t.matchRegex[1], 10) < t.minVer);
    if (result !== undefined) {
      this.isOld = true;
      this.appService.adIndexOpen = false;
      if (result.type === 0) {
        this.targetToUpdate = '裝置';
      } else {
        this.targetToUpdate = '瀏覽器';
      }
    } else {
      this.isOld = false;
      this.appService.adIndexOpen = true;
    }
  }

  ngDoCheck(): void {
    const change = this.serviceDiffer.diff(this.appService);
    if (change) {
      change.forEachChangedItem(item => {
        if (item.key === 'loginState' && item.currentValue && this.appService.userLoggedIn) {
          // 登入時重新訪問目前頁面以讀取會員相關資料
          this.router.routeReuseStrategy.shouldReuseRoute = () => false; // 判斷是否同一路由
          this.router.onSameUrlNavigation = 'reload';
          let url = this.appService.currentUrl;
          if (url.includes('?')) {
            // 若url原有參數則帶著前往
            url = url.split('?')[0];
            this.router.navigate([url], {queryParams: this.activatedRoute.snapshot.queryParams});
          } else {
            this.router.navigate([url]);
          }
          // 更新session中的使用者名稱讓登入後要顯示的頁面使用
          this.appService.userName = sessionStorage.getItem('userName');
        }
      });
    }
  }

}
