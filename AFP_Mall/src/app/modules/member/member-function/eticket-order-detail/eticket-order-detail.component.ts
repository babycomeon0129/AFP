import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { Request_MemberOrder, Response_MemberOrder, AFP_MemberOrder, AFP_ECStore, AFP_ItemInfoPart, AFP_Voucher,
          Model_ShareData, AFP_Services, Request_MemberServices, Response_MemberServices } from '@app/_models';
import { ModalService } from '@app/shared/modal/modal.service';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation } from '@app/animations';

@Component({
  selector: 'app-eticket-order-detail',
  templateUrl: './eticket-order-detail.component.html',
  styleUrls: ['../../member/member.scss',
              '../../member-function/member-order/member-order.scss',
              '../../../order/shopping-order/shopping-order.scss',
              '../../../return/return/return.scss'],
  animations: [layerAnimation]
})
export class ETicketOrderDetailComponent implements OnInit {
  /** 訂單編號 */
  public orderNo: number;
  /** 訂單詳細 */
  public orderInfo: AFP_MemberOrder;
  /** 訂單商家資訊 */
  public storeInfo: AFP_ECStore;
  /** 訂單商品 */
  public productsData: AFP_ItemInfoPart[] = [];
  /** 訂單使用優惠券 */
  public voucherInfo: AFP_Voucher[] = [];
  /** 商品總(原)金額 */
  public originalTotal: number;
  /** 客服單 */
  public servicesModel: AFP_Services = new AFP_Services();
  /** 同頁滑動切換 0:本頁 1:退貨原因 */
  public layerTrig = 0;

  constructor(private route: ActivatedRoute, public appService: AppService, public modal: ModalService,
              private router: Router, private meta: Meta, private title: Title) {
    this.title.setTitle('訂單詳情 - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: '訂單詳情 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});

    this.orderNo = this.route.snapshot.params.Order_TableNo;
  }

  ngOnInit() {
    const request: Request_MemberOrder = {
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
      // 商品總(原)金額
      this.originalTotal = this.orderInfo.Order_Amount;
      this.storeInfo.ECStore_Justka = data.JustKaUrl;

      //  取訂單資訊當客服單預設
      this.servicesModel.Services_OrderTableNo = this.orderInfo.Order_TableNo;
      this.servicesModel.Services_ECStoreCode = this.orderInfo.Order_ECStoreCode;
      this.servicesModel.Services_CPhone = this.orderInfo.Order_RecTel;
      this.servicesModel.Services_CName = this.orderInfo.Order_RecName;
    });
  }

  /** 提出退款 */
  toRefund(): void {
    // 確認是否已使用或已逾期
    if (this.productsData[0].UserTicket_UsedState === 0) {
      this.modal.confirm({ initialState:
        { title: '確認提交退款申請？', message: 'Mobii!將審核您的退款申請，票券如經使用或逾期將無法退款，點選「確認」後無法取消。' } }).subscribe(res => {
        if (res) {
          // 選擇退款原因
          this.layerTrig = 1;
        }
      });
    } else {
      this.modal.show('message', { initialState: { success: false, message: '票券已使用或逾期，無法申請退款。', showType: 1}});
    }
  }

  /** 選擇退貨理由 */
  ChooseReson(reasonNo: number): void {
    if (typeof reasonNo !== 'undefined') {
      this.servicesModel.Services_Reason = reasonNo;
    }
  }

  /** 送出退款理由 */
  sendReason(): void {
    if (this.servicesModel.Services_Reason === undefined) {
      this.modal.show('message', { initialState: { success: false, message: '請選擇退款原因', showType: 1}});
    } else {
      this.appService.openBlock();
      // 系統收回票券（未開通或已開通但未使用才會成功）
      const request: Request_MemberTicketRefund = {
        User_Code: sessionStorage.getItem('userCode'),
        SelectMode: 1,
        SearchModel: {
          Order_TableNo: this.orderInfo.Order_TableNo
        }
      };
      this.appService.toApi('Member', '1520', request).subscribe((data: Response_MemberTicketRefund) => {
        this.modal.confirm({ initialState: { showCancel: false, message: '票券已收回！將會為您進行退款作業。' } }).subscribe(ans => {
          if (ans) {
            // 產生客服單 (with selected reason )
            const serviceRequest: Request_MemberServices = {
              SelectMode: 1,
              AFP_Services: this.servicesModel
            };
            this.appService.toApi('Member', '1515', serviceRequest).subscribe((serviceData: Response_MemberServices) => {
              // 塞入客服單單號
              this.servicesModel.Services_TableNo = serviceData.AFP_Services.Services_TableNo;
              // 導去退貨詳細
              this.router.navigate(['/Return/ReturnDetail', this.servicesModel.Services_TableNo]);
            });
          }
        });
      });
    }
  }

}

/** 電子票卷退票 RequestModel */
interface Request_MemberTicketRefund extends Model_ShareData {
  /** SearchModel */
  SearchModel: Search_MemberTicketRefund;
}

/** 電子票卷退票 RequestModel  SearchModel */
interface Search_MemberTicketRefund {
  /** 訂單編號 */
  Order_TableNo: number;
}

/** 電子票卷退票 ResponseModel */
class Response_MemberTicketRefund extends Model_ShareData {
  constructor() {
    super();
  }
}
