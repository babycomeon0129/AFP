import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './../../../app.service';

declare var AppJSInterface: any;

@Component({
  selector: 'app-mobile-footer',
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.css']
})
export class MobileFooterComponent implements OnInit, OnDestroy {
  /** 當前網址（判斷icon是否填滿） */
  public currentUrl = '';
  /** 不顯示mobile footer的頁面 */
  // public mobileNoFooter = ['ExploreDetail', 'Map', 'ShoppingCart', 'ShoppingOrder', 'ShoppingPayment', 'ProductDetail',
  // 'Return', 'ReturnDetail', 'ReturnDialog', 'ETicketOrder', 'ETicketDetail', 'MyOrderDetail', 'ETocketOrderDetail',
  // 'MyProfile', 'MyPayment', 'CellVerification', 'MyAddress', 'PasswordUpdate', 'ThirdBinding', 'DeliveryInfo', 'Game/', 'VoucherDetail',
  // 'NotificationDetail', 'Terms', 'Privacy', 'QA', 'Error404', 'Error500', 'Error503'];

  constructor(public appService: AppService, public router: Router) { }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.appShowMobileFooter(true);
  }

  /** 前往頁面前判斷登入狀態 */
  goTo() {
    if (this.appService.loginState === true) {
      this.router.navigate(['/Notification/NotificationList']);
    } else {
      this.appService.loginPage();
    }
  }

  /** 通知APP是否開啟BottomBar */
  appShowMobileFooter(isOpen: boolean): void {
    if (this.appService.isApp !== null) {
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        AppJSInterface.showBottomBar(isOpen);
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'showBottomBar', isShow: isOpen });
      }
    }
  }

  ngOnDestroy() {
    this.appShowMobileFooter(false);
  }

}
