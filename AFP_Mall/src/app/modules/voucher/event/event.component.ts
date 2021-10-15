import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AFP_ADImg, Request_ECVoucher, Response_ECVoucher, AFP_Voucher, Model_DictionaryShort } from '@app/_models';
import { AppService } from '@app/app.service';
import { SwiperOptions } from 'swiper';
import { Meta, Title } from '@angular/platform-browser';
import { ModalService } from '@app/shared/modal/modal.service';
import { layerAnimation, layerAnimationUp } from '@app/animations';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.scss'],
  animations: [layerAnimation, layerAnimationUp]
})
export class EventComponent implements OnInit {
  /** 置頂圖片 */
  public coverImg: AFP_ADImg[];
  /** 優惠券列表(原始名單) */
  public voucherListOrig: AFP_Voucher[];
  /** 優惠券列表 */
  public voucherList: AFP_Voucher[];
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
  /** 置頂圖片swiper設定 */
  public adTop: SwiperOptions = {
    slidesPerView: 1,
    autoplay: {
        delay: 3000,
    }
  };
  /** 搜尋輸入文字 */
  public searchText: string;
  /** 取消按鈕切換 */
  public cancelIsOpen = false;
  /** 同頁滑動切換 0:本頁 1:排序清單 */
  public layerTrig = 0;

  constructor(public appService: AppService, private meta: Meta, private title: Title, private modal: ModalService, public location: Location) {
    this.title.setTitle('M幣商城 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! -M幣商城 Mobii! 點數兌換優惠券，想要搶得店家優惠，請先登入註冊 Mobii! 會員。'});
    this.meta.updateTag({content: '點數兌換 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! -M幣商城。這裡會顯示 Mobii! 點數兌換優惠券，想要搶得店家優惠，請先登入註冊 Mobii! 會員。', property: 'og:description'});

  }

  ngOnInit() {
    this.readData();
  }

  /** 讀取資料 */
  readData(): void {
    this.appService.openBlock();
    const request: Request_ECVoucher = {
      SelectMode: 5
    };
    this.appService.toApi('EC', '1205', request).subscribe((data: Response_ECVoucher) => {
      this.voucherListOrig = data.List_Voucher[0].VoucherData;
      this.voucherList = this.voucherListOrig.concat();
      this.coverImg = data.List_ADImg;
      this.showType = data.List_ShowType.filter(item => item.Key !== 1000 && item.Key !== 1100);
      this.useType = data.List_UsedType;
      this.voucherType = data.List_VoucherType;
      this.voucherCount = this.voucherList.length;
      this.resetSet();
    });
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

}
