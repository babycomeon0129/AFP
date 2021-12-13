import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { AFP_ADImg, AFP_ChannelVoucher, Request_ECVoucher, Response_ECVoucher } from '@app/_models';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-shopping-offers',
  templateUrl: './shopping-offers.component.html',
  styleUrls: ['./shopping-offers.scss']
})
export class ShoppingOffersComponent implements OnInit {
  /** 購物車內商品數 */
  public cartCount: number;
  /** 置頂圖片 */
  public coverImg: AFP_ADImg[] = [];
  /** 優惠券列表 */
  public voucherList: AFP_ChannelVoucher[] = [];
  /** 置頂廣告 swiper */
  public adTop: SwiperOptions = {
    slidesPerView: 1,
    autoplay: {
      delay: 3000,
    }
  };

  constructor(public appService: AppService, private oauthService: OauthService, private meta: Meta, private title: Title, public router: Router) {
    this.title.setTitle('線上優惠專區 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 線上優惠專區。這裡會顯示 Mobii! 合作店家的優惠券內容，想要搶得店家的優惠，請先登入註冊 Mobii! 會員。' });
    this.meta.updateTag({ content: '線上優惠專區 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 線上優惠專區。這裡會顯示 Mobii! 合作店家的優惠券內容，想要搶得店家的優惠，請先登入註冊 Mobii! 會員。', property: 'og:description' });

    this.cartCount = Number(this.oauthService.cookiesGet('cart_count_Mobii').cookieVal);
  }

  ngOnInit() {
    this.readData();
  }

  /** 讀取資料 */
  readData(): void {
    const request: Request_ECVoucher = {
      SelectMode: 4
    };
    this.appService.toApi('EC', '1205', request).subscribe((data: Response_ECVoucher) => {
      this.voucherList = data.List_Voucher;
      this.coverImg = data.List_ADImg;
    });
  }
}
