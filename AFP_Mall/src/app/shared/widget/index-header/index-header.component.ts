import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';

@Component({
  selector: 'app-index-header',
  templateUrl: './index-header.component.html',
  styleUrls: ['./index-header.component.scss']
})
export class IndexHeaderComponent implements OnInit {
  /** 只在電腦版顯示 */
  @Input() forPc = false;

  constructor(public appService: AppService, private router: Router) { }

  ngOnInit(): void {
  }

  /** 搜尋Bar，搜尋完畢後前往「找優惠」
   * @param searchText 搜尋文字
   */
   searchOffers(searchText: string): void {
    this.router.navigate(['/Voucher/Offers'], { queryParams: { search: searchText } });
  }

}
