import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { AppService } from '@app/app.service';
import { AFP_VouFlashSale, Request_ECVouFlashSale, Response_ECVouFlashSale, AFP_ADImg, AFP_Voucher } from '@app/_models';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['../shopping-offers/shopping-offers.scss', '../offers/offers.scss']
})
export class SalesComponent implements OnInit, OnDestroy {
  /** 置頂廣告 */
  public adTopList: AFP_ADImg[];
  /** 活動資訊 */
  public activity: AFP_VouFlashSale;
  /** 優惠券列表 */
  public saleVouchers: AFP_Voucher[];
  /** 活動剩餘時間 */
  public distance: number;
  /** 活動所剩時數 */
  public hours: number;
  /** 活動所剩分鐘數 */
  public minutes: number;
  /** 活動所剩秒數 */
  public seconds: number;
  /** 限時搶購結束倒數時鐘 */
  private countdown: NodeJS.Timer;

  /** 置頂廣告 swiper */
  public adTop: SwiperOptions = {
    slidesPerView: 1,
    autoplay: {
        delay: 3000,
    }
  };

  constructor(public appService: AppService, private meta: Meta, private title: Title, public router: Router) {
    this.title.setTitle('限時搶購優惠 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 限時搶購優惠。這裡會顯示 Mobii! 合作店家的限時優惠，限時限量、要買要快，你還在猶豫的時候，東西可能就已經賣光了唷！'});
    this.meta.updateTag({content: '限時搶購優惠 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 限時搶購優惠。這裡會顯示 Mobii! 合作店家的限時優惠，限時限量、要買要快，你還在猶豫的時候，東西可能就已經賣光了唷！', property: 'og:description'});
  }

  ngOnInit() {
    this.readData();
  }

  readData(): void {
    this.appService.openBlock();
    const request: Request_ECVouFlashSale = {
      SelectMode: 5
    };
    this.appService.toApi('EC', '1207', request).subscribe((data: Response_ECVouFlashSale) => {
      this.adTopList = data.List_ADImg;
      this.activity = data.AFP_VouFlashSale;
      if (this.activity !== null) {
        this.saleVouchers = data.List_VouFlashSale;
        this.saleCountdown();
      }
    });
  }

  /** 限時搶購倒數 */
  saleCountdown(): void {
    const saleEndTime = new Date(this.activity.VouFlashSale_OfflineDate).getTime();
    this.countdown = setInterval(() => {
      const currentTime = new Date().getTime();
      this.distance = saleEndTime - currentTime;
      // 計算剩餘時分秒
      const days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
      this.minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
      this.hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + days * 24;
      // 顯示
      if (this.distance === 0) {
        clearInterval(this.countdown);
        // call api to update voucher points below
        this.readData();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    // 離開此頁前Stop interval timers (avoid memory leak)
    clearInterval(this.countdown);
  }

}
