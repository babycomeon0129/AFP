import { Component, OnInit, OnDestroy, DoCheck, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { AppService } from 'src/app/app.service';
import {AFP_VouFlashSale, Request_ECVouFlashSale, Response_ECVouFlashSale, AFP_ChannelVoucher, AFP_Voucher } from '../../../_models';
import { SwiperOptions } from 'swiper';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ModalService } from '../../../shared/modal/modal.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['../../../../dist/style/offers.min.css']
})
export class OffersComponent implements OnInit, DoCheck, OnDestroy {
  /** 上方限時搶購優惠券(最多4筆) */
  public saleTop: AFP_Voucher[];
  /** 找優惠各目錄(下方) */
  public offers: AFP_ChannelVoucher[] = [];
  /** 限時搶購活動資訊 */
  public saleIndex: AFP_VouFlashSale;
  /** 限時搶購活動所剩時間 */
  public saleDistance: number;
  /** 限時搶購結束倒數時鐘 */
  public countdown;
  /** 限時搶購所剩小時 */
  public hours: number;
  /** 限時搶購所剩分鐘 */
  public minutes: number;
  /** 限時搶購所剩秒數 */
  public seconds: number;
  /** 變化追蹤(登入狀態) */
  private serviceDiffer: KeyValueDiffer<string, any>;

  public TabCode = 0;

  /** 分類導覽 swiper */
  public boxTabs: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 10,
    breakpoints: {
      320: {
        slidesPerView: 3,
        spaceBetween: 10
      },
      480: {
        slidesPerView: 4,
        spaceBetween: 15
      },
      640: {
        slidesPerView: 5,
        spaceBetween: 20
      }
    }
  };

  constructor(public appService: AppService, private activatedRoute: ActivatedRoute, private differs: KeyValueDiffers,
              private meta: Meta, private title: Title, private modal: ModalService) {
    this.serviceDiffer = this.differs.find({}).create();
    // tslint:disable: max-line-length
    this.title.setTitle('找優惠 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 找優惠。這裡會顯示 Mobii! 合作店家的優惠券，吃喝玩樂、食衣住行，你想得到、想不到的，都在 Mobii! 找優惠裡！' });
    this.meta.updateTag({ content: '找優惠 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 找優惠。這裡會顯示 Mobii! 合作店家的優惠券，吃喝玩樂、食衣住行，你想得到、想不到的，都在 Mobii! 找優惠裡！', property: 'og:description' });

    this.activatedRoute.queryParams.subscribe(params => {
      //  目標Tab
      if (typeof params.tabCode !== 'undefined') {
        this.TabCode = params.tabCode;
      }
    });

    this.readData();
  }

  ngOnInit() {
  }

  /** 讀取資料 */
  readData() {
    const request: Request_ECVouFlashSale = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 4,
      SearchModel: {
        VouChannel_Code: 1111111 // 優惠券推薦
      }
    };
    this.appService.toApi('EC', '1207', request).subscribe((data: Response_ECVouFlashSale) => {
      this.offers = data.List_Voucher;
      this.saleIndex = data.AFP_VouFlashSale;
      if (this.saleIndex !== null) {
        this.saleTop = data.List_VouFlashSale;
        this.saleCountdown();
      }

      if (this.offers.length > 0) {
        // tslint:disable-next-line: triple-equals
        const findCode = this.offers.find(item => item.UserDefine_Code == this.TabCode);
        if (typeof findCode === 'undefined') {
          this.TabCode = 0;
        }
      }
    });
  }

  /** 兌換優惠券
   * @param voucher 優惠券詳細
   */
  toVoucher(voucher: AFP_Voucher): void {
    if ( this.appService.loginState) {
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
              message: `<div class="no-data"><img src="../../../../img/shopping/payment-failed.png"><p>兌換失敗！</p></div>`
            };
            this.modal.show('message', { initialState });
          }
        });
      } else {
        this.appService.onVoucher(voucher);
      }
    } else {
      this.appService.loginPage();
    }
  }

  /** 限時搶購倒數顯示 */
  saleCountdown() {
    const saleEndTime = new Date(this.saleIndex.VouFlashSale_OfflineDate).getTime();
    this.countdown = setInterval(() => {
      const currentTime = new Date().getTime();
      this.saleDistance = saleEndTime - currentTime;
      // 計算剩餘時分秒
      const days = Math.floor(this.saleDistance / (1000 * 60 * 60 * 24));
      this.minutes = Math.floor((this.saleDistance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((this.saleDistance % (1000 * 60)) / 1000);
      this.hours = Math.floor((this.saleDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + days * 24;
      // 顯示
      if (this.saleDistance <= 0) {
        clearInterval(this.countdown);
        // call api to update voucher points below
        this.offers = []; // 先清空避免跑版
        this.readData();
      }
    }, 1000);
  }

  ngDoCheck() {
    // call api to update voucher button & points info after LOGIN
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

  ngOnDestroy(): void {
    // 離開此頁前Stop interval timers (avoid memory leak)
    clearInterval(this.countdown);
  }

}
