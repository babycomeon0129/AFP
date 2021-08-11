import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Request_MemberOrder, Response_MemberOrder, AFP_MemberOrder, AFP_ECStore, AFP_ItemInfoPart, AFP_Voucher
        , Request_MemberCheckStatus, Response_MemberCheckStatus, AFP_UserReport } from '@app/_models';
import { ModalService } from '@app/shared/modal/modal.service';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation } from '@app/animations';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';
@Component({
  selector: 'app-my-order-detail',
  templateUrl: './my-order-detail.component.html',
  styleUrls: ['../../member/member.scss',
              '../../member-function/member-order/member-order.scss',
              '../../../order/shopping-order/shopping-order.scss'],
  animations: [layerAnimation]
})
export class MyOrderDetailComponent implements OnInit, OnDestroy {
  /** 訂單編號 */
  public orderNo: number;
  /** 訂單詳細 */
  public orderInfo: AFP_MemberOrder;
  /** 訂單商家資訊 */
  public storeInfo: AFP_ECStore;
  /** 訂單商品 */
  public productsData: AFP_ItemInfoPart[];
  /** 訂單使用優惠券 */
  public voucherInfo: AFP_Voucher[] = [];
  /** 商品總(原)金額 */
  public originalTotal: number;
  /** 今日日期 */
  public today = new Date();
  /** 鑑賞期到期日 */
  public trialEndDate: Date;
  /** 確認取貨5秒interval */
  public checkTimer;
  /** 取貨3分鐘倒數timeout */
  public timer3Mins;
  /** UserReport (地址對照顯示) */
  public userReport: AFP_UserReport[];
  /** 同頁滑動切換 0:本頁 1:取貨提醒 */
  public layerTrig = 0;

  constructor(private route: ActivatedRoute, public appService: AppService, private modal: ModalService, private router: Router,
              private meta: Meta, private title: Title, private appJSInterfaceService: AppJSInterfaceService) {
    this.title.setTitle('訂單詳情 - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: '訂單詳情 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});

    this.orderNo = this.route.snapshot.params.Order_TableNo;
  }

  ngOnInit() {
    this.appService.openBlock();
    const request: Request_MemberOrder = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 2, // 詳細查詢
      SearchModel: {
        OrderNo: this.orderNo
      }
    };

    this.appService.toApi('Member', '1512', request).subscribe((data: Response_MemberOrder) => {
      this.orderInfo = data.AFP_MemberOrder;
      this.storeInfo = data.AFP_ECStore;
      this.productsData = data.List_ItemInfoPart;
      this.voucherInfo = data.List_UserVoucher;
      this.userReport = data.AFP_UserReport;
      // 鑑賞期
      if (this.orderInfo.Order_AppreciationDate !== null) {
        this.trialEndDate = new Date(this.orderInfo.Order_AppreciationDate);
      }
      // 計算商品總(原)金額
      this.originalTotal = this.orderInfo.Order_Amount - this.orderInfo.Order_ShippingAmount;

      this.storeInfo.ECStore_Justka = data.JustKaUrl;
    });
  }

  /** 增加天數後日期
   * @param date 日期
   * @param days 天數
   * @returns 新日期
   */
  addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    return new Date(newDate.setDate(newDate.getDate() + days));
  }

  /** 取貨（每五秒確認一次，若持續三分鐘則停止並跳出連線逾時訊息） */
  claimOrder(): void {
    // 每5秒問一次API是否已取貨
    this.checkTimer = setInterval(() => {
      const request: Request_MemberCheckStatus = {
        User_Code: sessionStorage.getItem('userCode'),
        SelectMode: 1,
        QRCode: this.orderInfo.Order_QRCode
      };
      this.appService.toApi('Member', '1516', request).subscribe((data: Response_MemberCheckStatus) => {
        // 若已取貨(鑑賞日期 !== null)，則跳出訊息，3秒後clearInterval()、回到上一頁
        if (data.AFP_MemberOrder.Order_AppreciationDate !== null) {
          clearInterval(this.checkTimer);
          clearTimeout(this.timer3Mins);
          // 點選「取貨」需call 原生關閉返回鍵(MOB-3197)
          if (this.appService.isApp !== null) { this.appJSInterfaceService.appShowBackButton(false); }
          // 將訂單詳情狀態顯示為「完成」
          this.orderInfo.OrderState = 3;
          this.orderInfo.Order_AppreciationDate = data.AFP_MemberOrder.Order_AppreciationDate;
          this.layerTrig = 0;
          this.modal.show('message', { initialState: { success: true, message: '收貨愉快!', showType: 1, note: '提醒您，如有退貨需求，請於商品猶豫期內提出申請。'}});
          return false;
        }
      });
    }, 5000);

    // 三分鐘後(若還在此頁)則停止timer
    this.timer3Mins = setTimeout(() => {
      this.modal.show('message', { initialState: { success: false, message: '連線逾時，請重新操作。', showType: 1}});
      clearInterval(this.checkTimer);
      this.layerTrig = 0;
    }, 180000);
  }

  /** 前往商店詳細頁
   * App特例處理，需要CALL原生商店詳細頁(MOB-3197)
   */
  goToECStore(storeCode: number): void {
    if (this.appService.isApp !== null) {
      this.appJSInterfaceService.goAppExploreDetail(storeCode);
    } else {
      if ( this.storeInfo.ECStore_State) {
        this.router.navigate(['/Explore/ExploreDetail', this.storeInfo.ECStore_Code],
          { queryParams: { showBack: this.appService.showBack } });
      } else {
        this.modal.show('message', { initialState: { success: false, message: 'Oops！該商店營運調整中！', showType: 1}});
      }
    }
  }

  /** 前往商品詳細頁
   * @param UserDefineCode 目錄編碼
   * @param ItemCode 項目編碼
   * App特例處理，需要CALL原生商品詳細頁(MOB-3197)
   */
  goToProductDetail(UserDefineCode: number, ItemCode: number, Product_State: boolean): void {
    if (Product_State) {
      (this.appService.isApp !== null) ?
        this.appJSInterfaceService.goAppShoppingDetail(ItemCode, UserDefineCode) :
        this.router.navigate(['/Shopping/ProductDetail', UserDefineCode, ItemCode],
        { queryParams: { showBack: this.appService.showBack } });
    } else {
      this.modal.show('message', { initialState: { success: false, message: 'Oops！該商品已全部銷售完畢囉！', showType: 1}});
    }
  }

  /** 按「回上一頁」時也要clearTimeout(this.checkTimer); */
  stopClaim(): void {
    clearInterval(this.checkTimer);
    this.layerTrig = 0;
    clearTimeout(this.timer3Mins);
  }

  ngOnDestroy(): void {
    clearInterval(this.checkTimer);
    clearTimeout(this.timer3Mins);
  }

}
