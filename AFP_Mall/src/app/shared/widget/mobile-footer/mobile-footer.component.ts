import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';


@Component({
  selector: 'app-mobile-footer',
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.scss']
})
export class MobileFooterComponent implements OnInit {
  /** 當前網址（判斷icon是否填滿） */
  public currentUrl = '';
  /** 不顯示mobile footer的頁面 */
  // public mobileNoFooter = ['ExploreDetail', 'Map', 'ShoppingCart', 'ShoppingOrder', 'ShoppingPayment', 'ProductDetail',
  // 'Return', 'ReturnDetail', 'ReturnDialog', 'ETicketOrder', 'ETicketDetail', 'MyOrderDetail', 'ETocketOrderDetail',
  // 'MyProfile', 'MyPayment', 'CellVerification', 'MyAddress', 'PasswordUpdate', 'ThirdBinding', 'DeliveryInfo', 'Game/', 'VoucherDetail',
  // 'NotificationDetail', 'Terms', 'Privacy', 'QA', 'Error404', 'Error500', 'Error503'];

  constructor(public appService: AppService, public oauthService: OauthService,
              public router: Router, private callApp: AppJSInterfaceService, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.currentUrl = this.router.url;
    // 初始時告訴app開啟footer
    this.callApp.appShowMobileFooter(true);
  }

}
