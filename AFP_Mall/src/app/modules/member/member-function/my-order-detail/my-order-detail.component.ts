import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Request_MemberOrder, Response_MemberOrder, AFP_MemberOrder, AFP_ECStore, AFP_ItemInfoPart, AFP_Voucher,
  Model_ShareData, Request_MemberCheckStatus, Response_MemberCheckStatus, AFP_UserReport } from '@app/_models';
import { ModalService } from '../../../../shared/modal/modal.service';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation } from '../../../../animations';

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
  /** 同頁滑動切換 */
  public layerTrig = 0;

  constructor(private route: ActivatedRoute, public appService: AppService, private modal: ModalService,
              private meta: Meta, private title: Title) {
    this.title.setTitle('訂單詳情 - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: '訂單詳情 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});

    this.orderNo = this.route.snapshot.params.Order_TableNo;
  }

  ngOnInit() {
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
  claimOrder() {
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
          // 將訂單詳情狀態顯示為「完成」
          this.orderInfo.OrderState = 3;
          this.orderInfo.Order_AppreciationDate = data.AFP_MemberOrder.Order_AppreciationDate;
          this.layerTrig = 0;
          // tslint:disable-next-line: max-line-length
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

  // 按「回上一頁」時也要clearTimeout(this.checkTimer);
  stopClaim() {
    clearInterval(this.checkTimer);
    this.layerTrig = 0;
    clearTimeout(this.timer3Mins);
  }

  ngOnDestroy(): void {
    clearInterval(this.checkTimer);
    clearTimeout(this.timer3Mins);
  }

  /** 同頁滑動切換 */
  layerToggle(e) {
    this.layerTrig = e;
  }
}
