import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { Router, NavigationExtras } from '@angular/router';
import { Model_ShareData, AFP_CSPayment, AFP_UserFavourite, OrderInvoice } from '@app/_models';
import { NgForm } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-shopping-payment',
  templateUrl: './shopping-payment.component.html',
  styleUrls: ['../../../../styles/shopping-index.min.css']
})
export class ShoppingPaymentComponent implements OnInit {
  public apiUrl = environment.apiUrl;
  public ablePayment = false;
  public payWays: Response_GetPayment = new Response_GetPayment();
  public reqData: Request_CheckPay = new Request_CheckPay();
  public maskCardNo = {
    showMask: false,
    mask: [
      /\d/, /\d/, /\d/, /\d/, ' ',
      /\d/, /\d/, /\d/, /\d/, ' ',
      /\d/, /\d/, /\d/, /\d/, ' ',
      /\d/, /\d/, /\d/, /\d/
    ]
  };
  public maskCardDate = { mask: [/\d/, /\d/, '/', /\d/, /\d/] };
  public maskCardCSC = { mask: [/\d/, /\d/, /\d/] };
  constructor(public appService: AppService, public modal: ModalService, private router: Router, private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('付款方式｜線上商城 - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: '付款方式｜線上商城 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});

    if (history.state.data !== undefined && sessionStorage.getItem('invoice') !== null) {
      const invoice: OrderInvoice = JSON.parse(sessionStorage.getItem('invoice'));
      const getPayment = new Request_GetPayment();
      getPayment.User_Code = sessionStorage.getItem('userCode');
      this.appService.toApi('EC', '1602', getPayment).subscribe((payWays: Response_GetPayment) => {
        this.payWays = payWays;
        this.reqData.OrderNo = history.state.data.OrderNo;
        this.reqData.UserVoucher_ID = history.state.data.UserVoucher_ID;
        this.reqData.xEyes_CustomerInfo = sessionStorage.getItem('CustomerInfo');
        this.reqData.User_Code = sessionStorage.getItem('userCode');
        this.reqData.InvoiceMode = invoice.invoiceMode;
        switch (invoice.invoiceMode) {
          case 2: { // 公司發票(三聯式)
            this.reqData.InvoiceTitle = invoice.invoiceTitle;
            this.reqData.InvoiceTaxID = invoice.invoiceTaxID;
            break;
          }
          case 3: { // 捐贈發票
            this.reqData.LoveCode = invoice.loveCode;
            break;
          }
          case 4: { // 會員載具
            this.reqData.CarrierType = invoice.carrierType;
            break;
          }
          case 5: { // 手機載具
            this.reqData.InvoiceMode = 4;
            this.reqData.CarrierType = invoice.carrierType;
            this.reqData.CarrierCode = invoice.carrierCode;
            break;
          }
          case 6: { // 收據
            this.reqData.InvoiceMode = 5;
            this.reqData.InvoiceTitle = invoice.invoiceTitle;
            this.reqData.InvoiceTaxID = invoice.invoiceTaxID;
            break;
          }
          case 7: { // 收據但不需抬頭與統編
            this.reqData.InvoiceMode = 5;
            this.reqData.InvoiceTitle = invoice.invoiceTitle;
            this.reqData.InvoiceTaxID = invoice.invoiceTaxID;
            break;
          }
        }
      });
    } else {
      this.router.navigate(['/Shopping/ShoppingCart'], {queryParams: { referrer: 'illegal' }});
    }
  }

  choicePayment(payWay: AFP_CSPayment): void {
    this.reqData.CSPayment_ID = payWay.CSPayment_ID;
    this.reqData.CSPaymentPart_ID = payWay.List_CSPaymentPart[0].CSPaymentPart_ID;
    this.reqData.UserFavourite_ID = null;
    this.ablePayment = true;
  }

  choicePayCard(payWay: AFP_CSPayment, card: AFP_UserFavourite): void {
    this.reqData.CSPayment_ID = payWay.CSPayment_ID;
    this.reqData.CSPaymentPart_ID = payWay.List_CSPaymentPart[0].CSPaymentPart_ID;
    this.reqData.UserFavourite_ID = card.UserFavourite_ID;
    this.ablePayment = true;
  }

  addNewCard(payWay: AFP_CSPayment): void {
    this.ablePayment = false;
    this.reqData.CSPayment_ID = payWay.CSPayment_ID;
    this.reqData.CSPaymentPart_ID = payWay.List_CSPaymentPart[0].CSPaymentPart_ID;
    this.reqData.UserFavourite_ID = null;
    this.appService.callLayer('.shopping-cardnum');
  }

  agreeFastCard(e: any): void {
    if (e.target.checked) {
      this.reqData.CreaditBind = 1;
    } else {
      this.reqData.CreaditBind = 0;
    }
  }

  addCardPayment(): void {
    if (this.reqData.CardNo !== '' && this.reqData.CardDate !== '' && this.reqData.CVC !== '') {
      $('#postPayment').submit();
    } else {
      this.modal.show('message', { initialState: { success: false, message: '資料未完整填寫!', showType: 1 } });
    }
  }

  onSubmit(form: NgForm) {
    this.appService.openBlock();
    $('#postPayment').submit();
  }

  ngOnInit() {
  }

}

export class Request_GetPayment extends Model_ShareData { }

export class Response_GetPayment extends Model_ShareData {
  AFP_CSPayment: AFP_CSPayment[];
  List_BindCard: AFP_UserFavourite[];
}

export class Request_CheckPay extends Model_ShareData {
  constructor() {
    super();
    this.CardNo = '';
    this.CardDate = '';
    this.CVC = '';
    this.UserFavourite_ID = null;
    this.CreaditBind = 0;
    this.CarrierType = null;
    this.CarrierCode = null;
    this.LoveCode = null;
    this.InvoiceTaxID = null;
    this.InvoiceTitle = null;
    this.InvoiceAddress = null;
  }

  /** 特店支付編碼 */
  CSPayment_ID: number;
  /** 特店支付部件編碼 */
  CSPaymentPart_ID: number;
  /** 綁卡判斷 0不綁 1綁 */
  CreaditBind: number;
  /** 卡號 */
  CardNo: string;
  /** 卡片有效日期 */
  CardDate: string;
  /** 卡片後三碼 */
  CVC: string;
  /** 使用者支付設定 */
  UserFavourite_ID?: number;
  /** 訂單編號 [多個逗號區隔] */
  OrderNo: string;
  /**  平台優惠券ID [使用者優惠券ID] */
  UserVoucher_ID?: number;
  /** 載具類型 */
  CarrierType?: number;
  /** 載具號碼 */
  CarrierCode?: string;
  /** 愛心碼 */
  LoveCode?: string;
  /** 發票類型 */
  InvoiceMode: number;
  /** 發票統一編號 */
  InvoiceTaxID?: string;
  /** 發票公司抬頭 */
  InvoiceTitle?: string;
  /** 發票寄送地址 */
  InvoiceAddress: string;
  /** 消費者包資訊，Json加密，(登入前不需要傳) */
  xEyes_CustomerInfo: string;
}
