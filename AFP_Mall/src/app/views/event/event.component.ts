import { Component, OnInit, DoCheck, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { AFP_ChannelVoucher, AFP_ADImg, Request_ECVoucher, Response_ECVoucher } from '../../_models';
import { AppService } from 'src/app/app.service';
import { SwiperOptions } from 'swiper';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['../../../dist/style/offers.min.css']
})
export class EventComponent implements OnInit, DoCheck {
  /** 置頂圖片 */
  public coverImg: AFP_ADImg[];
  /** 優惠券列表 */
  public voucherList: AFP_ChannelVoucher[];
  /** 置頂圖片swiper設定 */
  public adTop: SwiperOptions = {
    slidesPerView: 1,
    autoplay: {
        delay: 3000,
    }
  };
  /** 變化追蹤（登入狀態） */
  private serviceDiffer: KeyValueDiffer<string, any>;

  constructor(public appService: AppService, private differs: KeyValueDiffers, private meta: Meta, private title: Title) {
    this.serviceDiffer = this.differs.find({}).create();
    // tslint:disable: max-line-length
    this.title.setTitle('1元搶購優惠 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 1 元搶購優惠。這裡會顯示 Mobii! 合作店家的 1 元搶購優惠內容，想要搶得1元的店家優惠，請先登入註冊 Mobii! 會員。'});
    this.meta.updateTag({content: '1元搶購優惠 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 1 元搶購優惠。這裡會顯示 Mobii! 合作店家的 1 元搶購優惠內容，想要搶得1元的店家優惠，請先登入註冊 Mobii! 會員。', property: 'og:description'});

    this.readData();
  }

  ngOnInit() {
  }

  /** 讀取資料 */
  readData() {
    this.appService.openBlock();
    const request: Request_ECVoucher = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 5
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
