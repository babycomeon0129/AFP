import { Component, OnInit, DoCheck, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AFP_ChannelVoucher, AFP_ADImg, Request_ECVoucher, Response_ECVoucher } from '../../_models';
import { SwiperOptions } from 'swiper';
import { CookieService } from 'ngx-cookie-service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-shopping-offers',
  templateUrl: './shopping-offers.component.html',
  styleUrls: ['../../../dist/style/shopping-index.min.css']
})
export class ShoppingOffersComponent implements OnInit, DoCheck {
  /** 購物車內商品數 */
  public cartCount: number;
  /** 置頂圖片 */
  public coverImg: AFP_ADImg[] = [];
  /** 優惠券列表 */
  public voucherList: AFP_ChannelVoucher[] = [];
  /** 變化追蹤（登入狀態） */
  private serviceDiffer: KeyValueDiffer<string, any>;
  /** 置頂廣告 swiper */
  public adTop: SwiperOptions = {
    slidesPerView: 1,
    autoplay: {
        delay: 3000,
    }
  };

  constructor(public appService: AppService, private cookieService: CookieService, private differs: KeyValueDiffers,
              private meta: Meta, private title: Title) {
    this.serviceDiffer = this.differs.find({}).create();
    // tslint:disable: max-line-length
    this.title.setTitle('線上優惠專區 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 線上優惠專區。這裡會顯示 Mobii! 合作店家的優惠券內容，想要搶得店家的優惠，請先登入註冊 Mobii! 會員。'});
    this.meta.updateTag({content: '線上優惠專區 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 線上優惠專區。這裡會顯示 Mobii! 合作店家的優惠券內容，想要搶得店家的優惠，請先登入註冊 Mobii! 會員。', property: 'og:description'});

    this.cartCount = Number(this.cookieService.get('cart_count_Mobii'));
  }

  ngOnInit() {
    this.readData();
  }

  /** 讀取資料 */
  readData() {
    const request: Request_ECVoucher = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 4
    };
    this.appService.toApi('EC', '1205', request).subscribe((data: Response_ECVoucher) => {
      this.voucherList = data.List_Voucher;
      this.coverImg = data.List_ADImg;
    });
  }

  ngDoCheck() {
    const change = this.serviceDiffer.diff(this.appService);
    if (change) {
      change.forEachChangedItem(item => {
        if (item.key === 'loginState' && item.currentValue === true) {
          // 在此頁登入則更新優惠券資料
          this.readData();
        }
      });
    }
  }

}
