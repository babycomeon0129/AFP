import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { layerAnimation, layerAnimationUp } from '@app/animations';
import { AppService } from '@app/app.service';
import {
  AFP_ChannelVoucher, AFP_Voucher, AFP_VouFlashSale, Model_DictionaryShort, Request_ECVouFlashSale, Response_ECVouFlashSale
} from '@app/_models';
import { SwiperComponent } from 'ngx-useful-swiper';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.scss'],
  animations: [layerAnimation, layerAnimationUp]
})
export class OffersComponent implements OnInit, OnDestroy {
  @ViewChild('tabSwiper', { static: false }) tabSwiper: SwiperComponent;

  /** 上方限時搶購優惠券(最多4筆) */
  public saleTop: AFP_Voucher[];
  /** 找優惠各目錄(下方) */
  public offers: AFP_ChannelVoucher[] = [];
  /** 限時搶購活動資訊 */
  public saleIndex: AFP_VouFlashSale;
  /** 限時搶購活動所剩時間 */
  public saleDistance: number;
  /** 限時搶購結束倒數時鐘 */
  public countdown: NodeJS.Timer;
  /** 限時搶購所剩小時 */
  public hours: number;
  /** 限時搶購所剩分鐘 */
  public minutes: number;
  /** 限時搶購所剩秒數 */
  public seconds: number;
  /** 搜尋輸入文字 */
  public searchText: string;
  /** 取消按鈕切換 */
  public cancelIsOpen = false;
  /** 優惠券列表(原始名單) */
  public voucherListOrig: AFP_Voucher[] = [];
  /** 優惠券列表 */
  public voucherList: AFP_Voucher[] = [];
  /** 優惠券排序: 1 依即將到期優先 2 依上架時間(由新到舊) 3 依上架時間(由舊到新) */
  public voucherSort = 1;
  /** 優惠券使用類型分類 */
  public showType: Model_DictionaryShort[];
  /** 優惠券折扣類型使用 */
  public voucherType: Model_DictionaryShort[];
  /** 使用範圍  */
  public useType: Model_DictionaryShort[];
  /** 優惠券數量 */
  public voucherCount = 0;
  /** 重置按鈕開啟 */
  public resetOpen = false;
  /** 沒有優惠券的提醒 */
  public noVoucherBlock = false;
  /** TAb編碼 (即商品目錄編碼) */
  public TabCode = 0;
  /** 同頁滑動切換 0:本頁 1:排序清單 */
  public layerTrig = 0;

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

  constructor(public appService: AppService, private activatedRoute: ActivatedRoute,
    private meta: Meta, private title: Title, public location: Location) {
    this.title.setTitle('找優惠 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 找優惠。這裡會顯示 Mobii! 合作店家的優惠券，吃喝玩樂、食衣住行，你想得到、想不到的，都在 Mobii! 找優惠裡！' });
    this.meta.updateTag({ content: '找優惠 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 找優惠。這裡會顯示 Mobii! 合作店家的優惠券，吃喝玩樂、食衣住行，你想得到、想不到的，都在 Mobii! 找優惠裡！', property: 'og:description' });

    this.activatedRoute.queryParams.subscribe(params => {
      //  目標Tab
      if (params.tabCode !== undefined) {
        this.TabCode = Number(params.tabCode);
      }

      // 搜尋文字
      if (params.search !== undefined || params.search !== '') {
        this.searchText = params.search;
      }
    });

  }

  ngOnInit() {
    this.readData();
  }

  /** 讀取資料 */
  readData(): void {
    this.appService.openBlock();
    const request: Request_ECVouFlashSale = {
      SelectMode: 4,
      SearchModel: {
        VouChannel_Code: 1111111 // 優惠券推薦
      }
    };
    this.appService.toApi('EC', '1207', request).subscribe((data: Response_ECVouFlashSale) => {
      this.offers = data.List_Voucher;
      this.saleIndex = data.AFP_VouFlashSale;
      this.showType = data.List_ShowType.filter(item => item.Key !== 1000 && item.Key !== 1100);
      this.useType = data.List_UsedType;
      this.voucherType = data.List_VoucherType;
      if (this.saleIndex !== null) {
        this.saleTop = data.List_VouFlashSale;
        this.saleCountdown();
      }
      if (this.offers.length > 0 && this.TabCode === 0 && this.searchText === undefined) {
        this.TabCode = this.offers[0].UserDefine_Code;
      } else {
        // 如有搜尋文字，將Tab自動切換自有內容的Tab
        this.searchTextTab(this.searchText);

      }
      this.offers.forEach((element, index) => {
        if (element.UserDefine_Code === this.TabCode) { this.tabSwiper.swiper.slideTo(index, 1000, false); }
      });
      this.voucherListReflash();
      this.resetSet();
    });
  }

  /** 點擊Tab
   * @param tab 分類編碼
   * @param i 分類索引
   */
  tabCheck(tab: number, i: number): void {
    this.TabCode = tab;
    this.voucherListReflash();
    // TAB滑動到可見位置
    this.tabSwiper.swiper.slideTo(i, 1000, false);
  }

  /** 根據搜尋關鍵字，跳到符合關鍵字的第一順位的 tab  */
  searchTextTab(searchText: string): void {
    let index = 0;
    for (let voucher of this.offers) {
      if (voucher.VoucherData.findIndex(data => data.Voucher_ExtName.includes(searchText) || data.Voucher_Title.includes(searchText)) > -1) {
        this.TabCode = voucher.UserDefine_Code;
        index = this.offers.findIndex(data => data.UserDefine_Code === this.TabCode);
        break;
      }
    }

    // 如果輸入文字完全搜不到優惠券，便跳到第一個tab
    if (index === 0 && searchText !== undefined ) {
      this.TabCode = this.TabCode = this.offers[0].UserDefine_Code;
    }
    // TAB滑動到可見位置
    this.tabSwiper.swiper.slideTo(index, 1000, false);
    this.voucherListReflash();
  }

  /** 優惠券列表清單根據TAB，重新刷新 */
  voucherListReflash(): void {
    this.voucherListOrig = this.offers.filter(data => data.UserDefine_Code === this.TabCode)[0].VoucherData;
    this.voucherList = this.voucherListOrig.concat();
    this.voucherCount = this.voucherList.length;
  }

  /** 使用範圍文字顯示轉換 */
  usetypeTxt(usetype: number): string {
    switch (usetype) {
      case 0:
        return '全部';
      case 2:
        return '線上使用';
      case 3:
        return '到店使用';
      default:
        return '其他';
    }
  }


  /** 使用範圍點選確認 */
  usetypeCheck(type: { isSelect: boolean; }): void {
    this.useType.forEach(item => {
      item.isSelect = false;
    });
    type.isSelect = true;
    this.resetOpen = true;
    this.filterSubmit();
    this.resetStatus();
  }

  /** 篩選分類選擇狀態
   * @param type 優惠券類型
   * @param typeArr 該優惠券類型的所有資料
   */
  seletType(type: any, typeArr: string): void {
    // 如果選了"全部"，其他選項自動取消勾選
    if (type.Key === 0) {
      this[typeArr].forEach((item: { Key: number; isSelect: boolean; }) => {
        item.Key !== 0 ? item.isSelect = false : item.isSelect = true;
      });
    } else {
      // 如果選了其他子項目，"全部"這個選項自動取消勾選
      if (this[typeArr][0].Key === 0) {
        this[typeArr][0].isSelect = false;
      }
      type.isSelect = !type.isSelect;
      // 如果其他子項目沒人點選，便自動勾選"全部"這個選項
      const resetopen = this[typeArr].filter((item: { isSelect: boolean; }) => item.isSelect);
      if (resetopen.length === 0) {
        this[typeArr][0].isSelect = true;
      }
      this.resetOpen = true;
    }
    this.filterSubmit();
    this.resetStatus();
  }

  /** 優惠券折扣類型使用文字顯示轉換 */
  voucherTypeTxt(vtype: number): string {
    switch (vtype) {
      case 0:
        return '全部';
      case 1:
        return '折扣券';
      case 2:
        return '免運券';
      case 11:
        return '贈品券';
      default:
        return '其他';
    }
  }

  /** 篩選 */
  filterSubmit(): void {
    // 先把已選取的(isSelect = ture)的key篩選出來
    // 需篩選的優惠券類型
    const showresult = this.showType.filter(item => item.isSelect).map(item => item.Key);
    // 需篩選的優惠券折扣類型
    const vtyperesult = this.voucherType.filter(item => item.isSelect).map(item => item.Key);
    // 需篩選的優惠券使用範圍
    const useresult = this.useType.filter(item => item.isSelect).map(item => item.Key);
    // 優惠券使用範圍:無論什麼條件都將線上/到店進行篩選，所以先把1放入
    useresult.push(1);
    // 進行篩選
    const filterlist = this.voucherListOrig
      .filter(item => showresult.includes(0) || showresult.includes(item.Voucher_ShowType))
      .filter(item => vtyperesult.includes(0) || vtyperesult.includes(item.Voucher_Type))
      .filter(item => useresult.includes(0) || useresult.includes(item.Voucher_UsedType));
    // 排序
    switch (this.voucherSort) {
      case 1:
        filterlist.sort((prev, next) => prev.Voucher_UsedOffDate > next.Voucher_UsedOffDate ? 1 : -1);
        break;
      case 2:
        filterlist.sort((prev, next) => prev.Voucher_OnlineDate < next.Voucher_OnlineDate ? 1 : -1);
        break;
      case 3:
        filterlist.sort((prev, next) => prev.Voucher_OnlineDate > next.Voucher_OnlineDate ? 1 : -1);
        break;
    }
    this.voucherList = filterlist;
    this.voucherCount = filterlist.length;
  }


  /** 全部重設(按鈕) */
  resetSet(): void {
    this.showType.forEach(item => item.isSelect = item.Key === 0 );
    this.voucherType.forEach(item => item.isSelect = item.Key === 0 );
    this.useType.forEach(item => item.isSelect = item.Key === 0 );
    this.voucherSort = 1;
    this.resetOpen = false;
    this.voucherCount = this.voucherListOrig.length;
    this.voucherList = this.voucherListOrig.concat();
  }

  /** 確認重設按鈕是否啟用 */
  resetStatus(): void {
    if (this.showType[0].isSelect && this.voucherType[0].isSelect && this.useType[0].isSelect) {
      this.resetOpen = false;
    }
  }

  /** 限時搶購倒數顯示 */
  saleCountdown(): void {
    // 優惠券下架時間
    const saleEndTime = new Date(this.saleIndex.VouFlashSale_OfflineDate).getTime();
    const nowTime = new Date().getTime();
    // 防呆，避免後端回傳的VouFlashSale_OfflineDate異常導致無限saleCountdown()與readData()迴圈
    if (saleEndTime > nowTime) {
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
  }

  ngOnDestroy(): void {
    // 離開此頁前Stop interval timers (avoid memory leak)
    clearInterval(this.countdown);
  }

}
