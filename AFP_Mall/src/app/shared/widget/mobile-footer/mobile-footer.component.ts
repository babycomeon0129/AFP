import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AppService } from './../../../app.service';

declare var AppJSInterface: any;

@Component({
  selector: 'app-mobile-footer',
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.css']
})
export class MobileFooterComponent implements OnInit {
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
    // 初始時告訴app開啟footer
    this.appService.appShowMobileFooter(true);
    // router改變而當頁有footer時，再次告訴app開啟footer
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
                      .subscribe((event: NavigationEnd) => {
                        this.appService.appShowMobileFooter(true);
                      });
  }

  /** 前往頁面前判斷登入狀態 */
  goTo() {
    if (this.appService.loginState === true) {
      this.router.navigate(['/Notification/NotificationList']);
    } else {
      this.appService.loginPage();
    }
  }

}
