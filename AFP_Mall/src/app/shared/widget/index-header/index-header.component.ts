import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';

@Component({
  selector: 'app-index-header',
  templateUrl: './index-header.component.html',
  styleUrls: ['./index-header.component.scss']
})
export class IndexHeaderComponent implements OnInit {
  /** 只在電腦版顯示 */
  @Input() forPc = false;

  constructor(public appService: AppService, public oauthService: OauthService, private router: Router) { }

  ngOnInit(): void {
  }

  /** 搜尋Bar，搜尋完畢後前往「找優惠」
   * @param searchText 搜尋文字
   */
   searchOffers(searchText: string): void {
    this.router.navigate(['/Voucher/Offers'], { queryParams: { search: searchText } });
  }

  /** 前往頁面前判斷登入狀態 */
  goTo() {
    if (!this.appService.loginState) {
      this.oauthService.loginPage(this.appService.isApp, location.pathname);
    } else {
      this.router.navigate(['/Notification/NotificationList']);
    }
  }
}
