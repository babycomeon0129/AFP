import { Component, OnInit } from '@angular/core';
import { Request_MemberUserVoucher, AFP_Voucher, Model_DictionaryShort, Response_MemberUserVoucher } from '@app/_models';
import { AppService } from '@app/app.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ModalOptions } from 'ngx-bootstrap';
import { layerAnimation, layerAnimationUp } from '@app/animations';


@Component({
  selector: 'app-member-discount',
  templateUrl: './member-discount.component.html',
  styleUrls: ['../../member/member.scss'],
  animations: [layerAnimation, layerAnimationUp]
})
export class MemberDiscountComponent implements OnInit {
  /** 優惠券列表(原始名單) */
  public voucherListOrig: AFP_Voucher[];
  /** 優惠券列表 */
  public voucherList: AFP_Voucher[];
  /** 優惠券類別: 1 可用, 2 歷史 */
  public vSelectMode = 1;
  /** 當前日期時間 */
  public today = new Date();
  /** 搜尋輸入文字 */
  public searchText: string;
  /** 優惠券使用類型分類 */
  public showType: Model_DictionaryShort[];
  /** 優惠券折扣類型使用 */
  public voucherType: Model_DictionaryShort[];
  /** 使用範圍  */
  public useType: Model_DictionaryShort[];
  /** 使用範圍點選判斷: 0 全部 1 線上/到店 2 線上 3 到店 */
  public utypeSelect = 0;
  /** 優惠券排序: 1 依即將到期優先 2 依領取時間(由新到舊) 3 依領取時間(由舊到新) */
  public voucherSort = 1;
  /** 優惠券數量 */
  public voucherCount = 0;
  /** 搜尋框開啟 */
  public searchIsOpen = false;
  /** 取消按鈕切換 */
  public cancelIsOpen = false;
  /** 重置按鈕開啟 */
  public resetOpen = false;
  /** 同頁滑動切換 0:本頁 1:排序清單 */
  public layerTrig = 0;

  constructor(public appService: AppService, public modal: ModalService, public router: Router, private route: ActivatedRoute,
    private meta: Meta, private title: Title) {
    this.title.setTitle('我的優惠券 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 我的優惠券。這裡會顯示 Mobii! 用戶領取的優惠券細節，店家、景點優惠券可以在 Mobii! APP首頁的找優惠發掘店家的優惠。' });
    this.meta.updateTag({ content: '我的優惠券 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 我的優惠券。這裡會顯示 Mobii! 用戶領取的優惠券細節，店家、景點優惠券可以在 Mobii! APP首頁的找優惠發掘店家的優惠。', property: 'og:description' });
  }

  ngOnInit() {
    this.readVoucher();
    // 從會員中心進來則隱藏返回鍵
    // this.appService.showBack = this.route.snapshot.queryParams.showBack === 'true';
  }

  /** 讀取優惠券 */
  readVoucher(): void {
    if (this.appService.loginState) {
      this.appService.openBlock();
      const request: Request_MemberUserVoucher = {
        User_Code: sessionStorage.getItem('userCode'),
        SelectMode: 4, // 查詢
        Voucher_Code: null, // 優惠券Code
        Voucher_ActivityCode: null, // 優惠代碼
        SearchModel: {
          SelectMode: this.vSelectMode
        }
      };

      this.appService.toApi('Member', '1510', request).subscribe((data: Response_MemberUserVoucher) => {
        this.voucherListOrig = data.List_UserVoucher;
        this.voucherList = this.voucherListOrig.concat();
        this.useType = data.List_UsedType;
        this.showType = data.List_ShowType.filter(item => item.Key !== 1000 && item.Key !== 1100);
        this.voucherType = data.List_VoucherType;
        if (this.vSelectMode === 1) {
          this.resetSet();
        }
      });
    } else {
      this.appService.loginPage();
    }
  }

  /** 優惠券折扣類型使用文字顯示轉換 */
  vtypeTxt(vtype: number): string {
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
  utypeCheck(type: { isSelect: boolean; }): void {
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
        filterlist.sort((prev, next) => prev.Voucher_ReceiveDate < next.Voucher_ReceiveDate ? 1 : -1);
        break;
      case 3:
        filterlist.sort((prev, next) => prev.Voucher_ReceiveDate > next.Voucher_ReceiveDate ? 1 : -1);
        break;
    }
    this.voucherList = filterlist;
    this.voucherCount = filterlist.length;
  }

  /** 全部重設(按鈕) */
  resetSet(): void {
    this.showType.forEach(item => item.Key !== 0 ? item.isSelect = false : item.isSelect = true);
    this.voucherType.forEach(item => item.Key !== 0 ? item.isSelect = false : item.isSelect = true);
    this.useType.forEach(item => item.Key !== 0 ? item.isSelect = false : item.isSelect = true);
    this.voucherSort = 1;
    this.voucherCount = this.voucherListOrig.length;
    this.voucherList = this.voucherListOrig.concat();
    this.resetOpen = false;
  }

  /** 確認重設按鈕是否啟用 */
  resetStatus(): void {
    if (this.showType[0].isSelect && this.voucherType[0].isSelect && this.useType[0].isSelect) {
      this.resetOpen = false;
    }
  }

  /** 新增優惠券 */
  onAddCoupon(): void {
    this.vSelectMode = 1;
    if (this.appService.loginState) {
      const options: ModalOptions = { class: 'modal-dialog modal-dialog-centered modal-sm' };
      this.modal.addCoupon(options).subscribe(res => {
        if (res) {
          this.modal.show('message', { initialState: { success: true, message: '優惠券新增成功!', showType: 1 } });
          this.readVoucher();
        }
      });
    } else {
      this.appService.loginPage();
    }
  }

  /** 點擊圖片前往優惠券詳細
   * APP特例處理: 若是從會員過去優惠券詳細頁則要顯示返回鍵
   */
  goVDetail(voucher: AFP_Voucher): void {
    if (this.vSelectMode === 1) {
      if (this.route.snapshot.queryParams.showBack === undefined) {
        this.router.navigate(['/Voucher/VoucherDetail', voucher.Voucher_UserVoucherCode]);
      } else {
        if (this.route.snapshot.queryParams.showBack) {
          const navigationExtras: NavigationExtras = {
            queryParams: { showBack: true }
          };
          this.router.navigate(['/Voucher/VoucherDetail', voucher.Voucher_UserVoucherCode], navigationExtras);
        }
      }
    }
  }

}
