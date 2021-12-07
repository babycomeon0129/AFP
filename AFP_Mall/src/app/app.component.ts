import { environment } from '@env/environment';
import { Component, DoCheck, KeyValueDiffer, KeyValueDiffers, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ResolveEnd, RouterOutlet } from '@angular/router';
import { AppJSInterfaceService } from './app-jsinterface.service';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { CookieService } from 'ngx-cookie-service';
import { slideInAnimation } from './animations';
import { filter } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  animations: [slideInAnimation]
})
export class AppComponent implements OnInit, DoCheck, OnDestroy {
  /** 裝置系統或瀏覽器版本是否過舊 */
  public isOld: boolean;
  /** 需更新項目 */
  public targetToUpdate: string;
  /** 是否顯示過舊提示 */
  public showOldHint = true;
  /** 變化追蹤（登入狀態） */
  private serviceDiffer: KeyValueDiffer<string, any>;
  /** 版本號,版本日期 */
  public enVersion: string;
  /** 錯誤提示用 */
  public test: string;
  public testCount = 0;

  constructor(private router: Router, public appService: AppService, private activatedRoute: ActivatedRoute, public modal: ModalService,
              public cookieService: CookieService, private differs: KeyValueDiffers, private callApp: AppJSInterfaceService,
              public oauthService: OauthService, public bsModalService: BsModalService, private gtmService: GoogleTagManagerService) {
    this.serviceDiffer = this.differs.find({}).create();

    // App訪問
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.appService.isApp == null && typeof params.isApp !== 'undefined') {
        this.appService.isApp = Number(params.isApp);
        // 識別是否為App訪問，直至登出才會清除
        if (params.isApp === '1') {
          this.oauthService.getLocation();
          this.oauthService.cookiesSet({appVisit: '1'});
        }
      }

      //  購物車編碼 (APP用)
      if (typeof params.cartCode !== 'undefined') {
        this.oauthService.cookiesSet({
          cart_code: params.cartCode,
          page: location.href
        });
      }

      // 任務用 & 我的用 (APP用)
      if (typeof params.loginType !== 'undefined') {
        this.appService.appLoginType = params.loginType;
        if (params.loginType === '1' && (typeof params.M_idToken !== 'undefined' && params.M_idToken !== null)) {
          // APP 為登入狀態則將該 webview 也同步為登入
          this.oauthService.cookiesSet({
            idToken: params.M_idToken,
            page: location.href
          });
          if (typeof params.userCode !== 'undefined') {
            this.oauthService.cookiesSet({
              userCode: params.userCode,
              page: location.href
            });
          }
          if (typeof params.userName !== 'undefined') {
            this.oauthService.cookiesSet({
              userName: params.userName,
              page: location.href
            });
          }
          if (typeof params.userFavorites !== 'undefined') {
            this.oauthService.cookiesSet({
              userFavorites: encodeURIComponent(params.userFavorites),
              page: location.href
            });
          }
          this.appService.userName = params.userName;
          this.appService.loginState = true;
          this.appService.userLoggedIn = true;
          this.appService.showFavorites();
          this.appService.readCart();
          // 通知推播
          // this.appService.initPush();
        }
      }

      /** 「艾斯身份識別_登出」變更密碼返回登出，並清除logout參數 */
      if (params.logout === 'true') {
        this.appService.loginState = false;
        this.appService.userLoggedIn = false;
        this.appService.userFavCodes = [];
        this.appService.pushCount = 0;
        this.oauthService.onLogout(this.appService.isApp);
      }
    });

  }

  ngOnInit() {
    /** 「艾斯身份識別_登入4-3」曾經登入成功過(有idToken)，重整頁面避免登入狀態遺失 */
    if (this.oauthService.cookiesGet('idToken').cookieVal && this.appService.isApp !== 1) {
      this.appService.loginState = true;
      this.appService.userLoggedIn = true;
    }
    this.appService.getPushPermission();
    this.appService.receiveMessage();
    // 當路由器成功完成路由的解析階段時，先通知app將footer關閉(開啟則靠app-mobile-footer通知開啟)
    this.router.events.pipe(filter(event => event instanceof ResolveEnd))
      .subscribe((event: ResolveEnd) => {
        window.scrollTo(0, 0);
        if (this.appService.isApp === 1) {
          this.callApp.appShowMobileFooter(false);
        }
        this.appService.prevUrl = event.url;  // 取得前一頁面url
        // 追蹤每個頁面資訊，推送給GA
        const gtmTag = {
          event: 'page',
          pageName: event.url
        };
        this.gtmService.pushTag(gtmTag);
      });
    this.detectOld();
    // this.appService.initPush();

    // TODO 點10下用
    setInterval(() => {
      this.test = location.href;
    }, 1000);

    // TODO 測試用
    if (this.appService.isApp === 1 && this.oauthService.preName !=='') {
      document.getElementById('loginRequest').innerHTML =
      '<p>isApp: ' + this.appService.isApp + '</p>' +
      '<p>deviceType: ' + this.oauthService.cookiesGet('deviceType').cookieVal + '</p>';
    }

    /** 版本號(上版時需在環境配置檔，自訂日期及版號) */
    const versionDate = new Date(environment.versionDate);
    this.enVersion =
      'Ver.' + environment.version + '_' +
      (versionDate.getMonth() + 1) + versionDate.getDate() + ' | ' +
      versionDate.toLocaleString();
  }

  /** 獲取這個 outlet 指令的值（透過 #outlet="outlet"），並根據當前活動路由的自訂資料返回一個表示動畫狀態的字串值。用此資料來控制各個路由之間該執行哪個轉場 */
  prepareRoute(outlet: RouterOutlet): void {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  /** 偵測裝置系統或瀏覽器版本是否過舊（根據Angular browser support）
   * @property target 偵測目標
   * @property type OS - 0, browser - 1
   * @property condition 可從userAgent中找出該目標的條件
   * @property matchRegex 陣列[目標及版本, 版本], parseInt()第[1]個項目後取得版本
   * @property minVer 目前Angular支援該目標的最低版本
   */
  detectOld(): void {
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
      this.targetToUpdate = result.type === 0 ? '裝置' : '瀏覽器';
    } else {
      this.isOld = false;
      this.appService.adIndexOpen = true;
    }
  }

  ngDoCheck() {
    const change = this.serviceDiffer.diff(this.appService);
    if (change) {
      change.forEachChangedItem(item => {
        if (item.key === 'loginState' && item.currentValue && this.appService.userLoggedIn) {
          // 登入時重新訪問目前頁面以讀取會員相關資料
          this.router.routeReuseStrategy.shouldReuseRoute = () => false; // 判斷是否同一路由
          this.router.onSameUrlNavigation = 'reload';
          let url = this.router.url;
          if (url.includes('?')) {
            // 若url原有參數則帶著前往
            url = url.split('?')[0];
            this.router.navigate([url], { queryParams: this.activatedRoute.snapshot.queryParams });
          } else {
            this.router.navigate([url]);
          }
        }
      });
    }
  }

  ngOnDestroy() {
    // 應用程式銷毀前，判斷是否有isApp，for App用
  }

}
