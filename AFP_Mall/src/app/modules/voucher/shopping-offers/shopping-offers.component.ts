import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AFP_ChannelVoucher, AFP_ADImg, Request_ECVoucher, Response_ECVoucher, AFP_Voucher } from '@app/_models';
import { SwiperOptions } from 'swiper';
import { CookieService } from 'ngx-cookie-service';
import { Meta, Title } from '@angular/platform-browser';
import { ModalService } from '@app/shared/modal/modal.service';

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

  constructor(public appService: AppService, private cookieService: CookieService, private meta: Meta, private title: Title, private modal: ModalService) {
    this.title.setTitle('線上優惠專區 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 線上優惠專區。這裡會顯示 Mobii! 合作店家的優惠券內容，想要搶得店家的優惠，請先登入註冊 Mobii! 會員。' });
    this.meta.updateTag({ content: '線上優惠專區 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 線上優惠專區。這裡會顯示 Mobii! 合作店家的優惠券內容，想要搶得店家的優惠，請先登入註冊 Mobii! 會員。', property: 'og:description' });

    this.cartCount = Number(this.cookieService.get('cart_count_Mobii'));
  }

  ngOnInit() {
    this.readData();
  }

  /** 讀取資料 */
  readData(): void {
    const request: Request_ECVoucher = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 4
    };
    this.appService.toApi('EC', '1205', request).subscribe((data: Response_ECVoucher) => {
      this.voucherList = data.List_Voucher;
      this.coverImg = data.List_ADImg;
    });
  }

  /** 兌換優惠券
 * @param voucher 優惠券詳細
 */
  toVoucher(voucher: AFP_Voucher): void {
    if (voucher.Voucher_DedPoint > 0 && voucher.Voucher_IsFreq === 1) {
      this.modal.confirm({
        initialState: {
          message: `請確定是否扣除 Mobii! Points ${voucher.Voucher_DedPoint} 點兌換「${voucher.Voucher_ExtName}」？`
        }
      }).subscribe(res => {
        if (res) {
          this.appService.onVoucher(voucher);
        } else {
          const initialState = {
            success: true,
            type: 1,
            message: `<div class="no-data no-transform"><img src="../../../../img/shopping/payment-failed.png"><p>兌換失敗！</p></div>`
          };
          this.modal.show('message', { initialState });
        }
      });
    } else {
      this.appService.onVoucher(voucher);
    }
  }

}
