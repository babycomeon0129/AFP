import { Component, OnInit } from '@angular/core';
import { Model_ShareData, AFP_Cart, AFP_ECStore, AFP_Product, AFP_Voucher, AFP_Order,
  Request_GetUserVoucher, Response_GetUserVoucher, Request_CheckUserVoucher, Response_CheckUserVoucher,
  AFP_UserVoucher, AFP_VoucherLimit, OrderVoucher, OrderInvoice, OrderStore, OrderPlatform } from '../../_models';
import { ModalService } from 'src/app/service/modal.service';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-eticket-order',
  templateUrl: './eticket-order.component.html',
  styleUrls: ['../../../dist/style/shopping-index.min.css']
})
export class ETicketOrderComponent implements OnInit {
  /** 票券結帳頁資訊整合 */
  public info: OrderInfo = new OrderInfo();
  /** 儲存結帳相關資訊 */
  public checkout: Response_GetTCheckout;
  /** 無法結帳的優惠券 */
  public banVoucher: AFP_Voucher[] = [];
  /** 折扣金額 */
  public discount = 0;
  /** 儲存優惠券相關資訊 */
  public voucher: Response_GetUserVoucher;
  /** 優惠券整理資訊 */
  public userVouchers: AFP_UserVoucher[] = [];

  constructor(public modal: ModalService, private router: Router, public appService: AppService) {
    if (history.state.data !== undefined) {
      const afpCart: AFP_Cart[] = [];
      // 以購物車 ID 取得結帳相關資訊
      history.state.data.checkoutList.forEach((cart: { ProductList: any[]; }) => {
        const checkout = cart.ProductList.filter(x => x.CheckedStatus);
        if (checkout.length > 0) {
          checkout.forEach(product => {
            afpCart.push({ Cart_ID: product.CartId });
          });
        }
      });
      const getTCheckout: Request_GetTCheckout = {
        SelectMode: 4, // 查詢
        User_Code: sessionStorage.getItem('userCode'),
        List_Cart: afpCart
      };
      this.appService.toApi('Checkout', '1609', getTCheckout).subscribe((data: Response_GetTCheckout) => {
        this.checkout = data;
        // 取得使用者優惠券
        const getVoucher: Request_GetUserVoucher = {
          SelectMode: 4, // 查詢
          User_Code: sessionStorage.getItem('userCode'),
          List_Cart: this.checkout.List_Cart
        };

        this.appService.toApi('Checkout', '1606', getVoucher).subscribe((voucher: Response_GetUserVoucher) => {
          this.voucher = voucher;

          // 依商店整理
          data.List_ECStore.forEach(store => {
            this.info.stores.push(store);
            const newStore = this.info.stores[this.info.stores.length - 1];
            newStore.total = 0;
            newStore.order = new AFP_Order();
            newStore.order.Order_ECStoreCode = store.ECStore_Code;
            newStore.order.Order_Currency = 'TWD';
            newStore.preVoucher = new OrderVoucher();
            newStore.voucher = new OrderVoucher();
            newStore.products = this.checkout.List_Cart.filter(x => x.Cart_ECStoreCode === store.ECStore_Code);
            newStore.products.forEach(product => {
              newStore.total += product.Cart_Quantity * product.Cart_Amount;
            });
            // 以總店查詢商店可使用的優惠券
            newStore.vouchers = voucher.List_Voucher
              .filter(x => x.Voucher_ECStoreCode === store.ECStore_Code
                && x.Voucher_UsedLimitType === 11 && x.VoucherRange_Prod !== null);
            if (newStore.vouchers.length > 0) { this.info.visibleVouchers = true; }
            // 無法結帳的優惠券
            this.banVoucher = voucher.List_Voucher.filter(x => x.VoucherRange_Prod === null);
            // 總計訂單金額
            this.info.total += newStore.total;
          });

          // 平台可使用的優惠券整理
          this.info.platform.vouchers = voucher.List_Voucher
            .filter(x => x.Voucher_UsedLimitType <= 2 && x.VoucherRange_Prod !== null);
          if (this.info.platform.vouchers.length > 0) { this.info.visibleVouchers = true; }

          this.recalculate();
        });
      });
    } else {
      this.modal.confirm({
        initialState:
          { message: '請選擇要結帳的車票!', showCancel: false },
        backdrop: 'static',
        keyboard: false
      }).subscribe(option => {
        this.router.navigate(['/']);
      });
    }
  }

  /** 開啟選擇優惠券頁面 */
  toChoiceVoucher(): void {
    // 還原優惠券選項
    this.info.stores.forEach(store => {
      store.preVoucher = JSON.parse(JSON.stringify(store.voucher));
    });
    this.info.platform.preVoucher = JSON.parse(JSON.stringify(this.info.platform.voucher));
    this.discount = this.info.totalDiscount;
    this.appService.callLayer('.shopping-discount');
  }

  /** 重設優惠券選項(刪除所有已選) */
  resetVoucher(): void {
    this.info.stores.forEach(store => {
      store.preVoucher = new OrderVoucher();
      store.order.Order_ChangeAmount = 0;
      store.order.Order_PlatChangeAmount = 0;
    });
    this.discount = 0;
    this.info.totalDiscount = 0;
    this.info.platform.preVoucher = new OrderVoucher();
  }

  /** 選擇優惠券 */
  choiceVoucher(store: OrderStore, voucher: OrderVoucher, e: any): void {
    let result = { success: false, message: '' };
    const tempVoucher = this.info.stores.find(x => x !== store && x.preVoucher === voucher);
    if (tempVoucher) {
      this.modal.show('message', { initialState: { success: false, message: '親,您選到同一張優惠券了!', showType: 1 } });
    } else {
      let productsAmount = 0; // 可優惠的商品總金額
      let productsQTY = 0; // 可優惠的商品數量
      store.products.forEach(product => {
        // 驗證該優惠券優惠範圍內的商品
        if (voucher.VoucherRange_Prod.some(x => x === product.Cart_ProductCode)) {
          productsQTY += product.Cart_Quantity; // 本次優惠範圍內的商品件數
          productsAmount += product.Cart_Quantity * product.Cart_Amount; // 本次優惠範圍內的商品金額
        }
      });
      switch (voucher.Voucher_Type) {
        case 1: { // 依照消費金額
          result = this.validVoucher(voucher, productsAmount, productsAmount, productsQTY);
          break;
        }
        case 2: { // 依照運費金額
          if (store.order.Order_ShippingAmount > 0) {
            result = this.validVoucher(voucher, store.order.Order_ShippingAmount, productsAmount, productsQTY);
          } else {
            e.target.checked = false;
            result.message = '沒有運費需要折抵,請選擇其他優惠券';
          }
          break;
        }
        case 11: { // 贈品
          result = this.validVoucher(voucher, productsAmount, productsAmount, productsQTY);
          break;
        }
      }
      if (result.success) {
        store.preVoucher = voucher;
        if (this.info.platform.preVoucher.Voucher_Code > 0) {
          this.info.platform.preVoucher = new OrderVoucher();
          this.modal.show('message', { initialState: { success: false, message: '請重新選擇平台優惠券!', showType: 1 } });
        }
        this.recalculate();
      } else {
        e.target.checked = false;
        this.modal.show('message', { initialState: { success: false, message: result.message, showType: 1 } });
      }
    }
  }

  choicePlatformVoucher(voucher: OrderVoucher, e: any): void {
    let result = { success: false, message: '' };
    let topFreightStore: OrderStore; // 最高的運費的店家(折扣後)
    let productsAmount = 0; // 可優惠的商品總金額
    let productsQTY = 0; // 可優惠的商品數量
    this.info.stores.forEach(store => {
      store.products.forEach(product => {
        // 驗證平台優惠券優惠範圍商品
        if (voucher.VoucherRange_Prod.some(x => x === product.Cart_ProductCode)) {
          productsAmount += product.Cart_Quantity * product.Cart_Amount; // 本次優惠範圍內的商品金額
          productsQTY += product.Cart_Quantity; // 本次優惠範圍內的商品件數
        }
      });

      // 找出本次結帳運費最高的商店(運算折扣後最高運費商店)
      if (topFreightStore && store.order.Order_ShippingAmount > 0) {
        topFreightStore = (store.order.Order_ShippingAmount - store.preVoucher.discount) >
          (topFreightStore.order.Order_ShippingAmount - topFreightStore.preVoucher.discount) ? store : topFreightStore;
      } else if (store.order.Order_ShippingAmount > 0) {
        topFreightStore = store;
      }

      // 扣除折扣金額，以目前的實付金額計算
      productsAmount = productsAmount - store.preVoucher.discount;
    });

    switch (voucher.Voucher_Type) {
      case 1: { // 依照消費金額
        result = this.validVoucher(voucher, productsAmount, productsAmount, productsQTY);
        break;
      }
      case 2: { // 依照運費金額(折扣後最高的運費)
        if (topFreightStore) {
          const discount = topFreightStore.preVoucher.Voucher_Type === 2 ? topFreightStore.preVoucher.discount : 0;
          // 要計算的金額(運費折扣後)
          const amount = topFreightStore.order.Order_ShippingAmount - discount;

          if (amount > 0) {
            result = this.validVoucher(voucher, amount, productsAmount, productsQTY);
            // this.info.platform.topFreightStore = topFreightStore;
          } else {
            e.target.checked = false;
            result.message = '沒有運費需要折抵,請選擇其他優惠券';
          }
        } else {
          e.target.checked = false;
          result.message = '沒有運費需要折抵,請選擇其他優惠券';
        }
        break;
      }
      case 11: { // 贈品
        result = this.validVoucher(voucher, productsAmount, productsAmount, productsQTY);
        break;
      }
    }
    if (result.success) {
      this.info.platform.preVoucher = voucher;
      this.recalculate();
    } else {
      e.target.checked = false;
      this.modal.show('message', { initialState: { success: false, message: result.message, showType: 1 } });
    }
  }

  /** 確認選擇的優惠券 */
  confirmVoucher(): void {
    const userVouchers = [];

    this.info.stores.forEach(store => {
      if (store.preVoucher.discount > 0) {
        const userVoucher = this.voucher.List_UserVoucher.find(x => x.UserVoucher_VoucherCode === store.preVoucher.Voucher_Code);
        if (userVoucher) {
          userVoucher.UserVoucher_VoucherLimitID = store.preVoucher.limitID;
          userVoucher.UserVoucher_VoucherCode = store.preVoucher.Voucher_Code;
          userVoucher.UserVoucher_UsedECStore = store.ECStore_Code;

          userVouchers.push(userVoucher);
        }
      }
    });
    if (this.info.platform.preVoucher.discount > 0) {
      const userVoucher = this.voucher.List_UserVoucher.find(x => x.UserVoucher_VoucherCode === this.info.platform.preVoucher.Voucher_Code);
      if (userVoucher) {
        userVoucher.UserVoucher_VoucherLimitID = this.info.platform.preVoucher.limitID;
        userVoucher.UserVoucher_VoucherCode = this.info.platform.preVoucher.Voucher_Code;
        userVoucher.UserVoucher_UsedECStore = this.info.stores[0].ECStore_Code;

        userVouchers.push(userVoucher);
      }
    }

    const checkUserVoucher: Request_CheckUserVoucher = {
      User_Code: sessionStorage.getItem('userCode'),
      List_Cart: this.checkout.List_Cart,
      List_UserVoucher: userVouchers
    };

    // 有選擇優惠券時再進入驗證流程
    if (checkUserVoucher.List_UserVoucher.length > 0) {
      this.appService.toApi('EC', '1607', checkUserVoucher).subscribe((data: Response_CheckUserVoucher) => {
        if (data.Success) { // 驗證通過再將所有資訊謄寫至確定欄位
          this.info.totalDiscount = 0;
          this.info.voucherInfo = [];
          this.userVouchers = JSON.parse(JSON.stringify(userVouchers)); // 確認驗證通過再置換優惠券資訊
          // 將折扣金額謄寫至訂單資訊中
          this.info.stores.forEach(store => {
            if (store.preVoucher.discount > 0) {
              store.order.Order_ChangeAmount = store.preVoucher.discount;
              store.order.Order_ChangeShippingAmount = 0;
              if (store.preVoucher.Voucher_Type === 2) {
                store.order.Order_ChangeShippingAmount = store.preVoucher.discount;
              }
              store.voucher = JSON.parse(JSON.stringify(store.preVoucher));
              this.info.totalDiscount += store.preVoucher.discount;
              this.info.voucherInfo.push(store.voucher);
            }
          });

          // 平台優惠券的優惠金額均分給各商店(訂單)
          if (this.info.platform.preVoucher.discount > 0) {
            // 以消費金額優惠則將折扣均分至各訂單
            const average = this.info.platform.preVoucher.discount / this.info.stores.length;
            const isFloat = String(average).indexOf('.') > -1;
            const floor = Math.floor(average);
            // 取得平均後無條件捨去小數
            this.info.stores.forEach((store, index) => {
              // 回填各商店平台優惠券折扣金額
              const changeAmount = floor + ((isFloat && index === 0) ? 1 : 0); // 如果有小數則第一張訂單+1折扣，其餘無條件捨去
              store.order.Order_ChangeAmount += changeAmount;
              store.order.Order_PlatChangeAmount = changeAmount;
            });

            this.info.platform.voucher = JSON.parse(JSON.stringify(this.info.platform.preVoucher));
            this.info.totalDiscount += this.info.platform.preVoucher.discount;
            this.info.voucherInfo.push(this.info.platform.voucher);
          }
          this.recalculate();
          this.appService.backLayer();
        } else {
          this.modal.show('message', { initialState: { success: false, message: data.ErrorMsg, showType: 1 } });
        }
      });
    } else {
      //  可不選擇優惠券
      // this.modal.show('message', { initialState: { success: false, message: '請選擇至少一張優惠券!', showType: 1 } });
      this.appService.backLayer();
    }
  }

  /** 選擇發票/收據
   * @param type 0 發票 1 收據
   */
  toInvoice(type: number): void {
    this.info.preInvoice = JSON.parse(JSON.stringify(this.info.invoice));
    switch (type) {
      // 選擇發票
      case 0:
        this.appService.callLayer('.shopping-invoice');
        break;
      // 選擇收據
      case 1:
        this.appService.callLayer('.shopping-receipt');
        break;
    }
  }

  confirmInvoice(): void {
    switch (this.info.preInvoice.invoiceMode) {
      case 2: { // 公司發票(三聯式)
        if (this.info.preInvoice.invoiceTitle.trim() === '' || this.info.preInvoice.invoiceTaxID.trim() === '') {
          this.modal.show('message', { initialState: { success: false, message: '請輸入發票抬頭名稱與統一編號', showType: 1 } });
        } else {
          this.info.invoice = this.info.preInvoice;
          this.info.invoice.message = '三聯式發票 ' + this.info.invoice.invoiceTitle + '/' + this.info.invoice.invoiceTaxID;
          this.appService.backLayer();
        }
        break;
      }
      case 3: { // 捐贈發票
        if (this.info.preInvoice.loveCode.trim() === '') {
          this.modal.show('message', { initialState: { success: false, message: '請輸入愛心碼', showType: 1 } });
        } else {
          this.info.invoice = this.info.preInvoice;
          this.info.invoice.message = '發票捐贈 愛心碼:' + this.info.invoice.loveCode;
          this.appService.backLayer();
        }
        break;
      }
      case 4: { // 會員載具
        this.info.invoice = this.info.preInvoice;
        this.info.invoice.carrierType = 3;
        this.info.invoice.message = '會員載具';
        this.appService.backLayer();
        break;
      }
      case 5: { // 手機載具
        if (this.info.preInvoice.carrierCode.trim() === '') {
          this.modal.show('message', { initialState: { success: false, message: '請輸入正確的手機條碼', showType: 1 } });
        } else {
          this.info.invoice = this.info.preInvoice;
          this.info.invoice.carrierType = 1;
          this.info.invoice.message = '手機條碼載具 ' + this.info.invoice.carrierCode;
          this.appService.backLayer();
        }
        break;
      }
      case 6: { // 收據
        if (this.info.preInvoice.invoiceTitle.trim() === '' || this.info.preInvoice.invoiceTaxID.trim() === '') {
          this.modal.show('message', { initialState: { success: false, message: '請輸入發票抬頭名稱與統一編號', showType: 1 } });
        } else {
          this.info.invoice = this.info.preInvoice;
          this.info.invoice.message = '收據 ' + this.info.invoice.invoiceTitle + '/' + this.info.invoice.invoiceTaxID;
          this.appService.backLayer();
        }
        break;
      }
      case 7: { // 收據但不需抬頭與統編
        this.info.invoice = this.info.preInvoice;
        this.info.invoice.message = '收據（不需抬頭與統編）';
        this.appService.backLayer();
        break;
      }
      default: {
        this.modal.show('message', { initialState: { success: false, message: '請選擇您所需要的發票/收據樣式', showType: 1 } });
        break;
      }
    }
  }

  /**
   * 重新計算各商店優惠金額及平台優惠金額
   */
  recalculate(): void {
    this.discount = 0;
    this.info.stores.forEach(store => {
      this.discount += store.preVoucher.discount;
    });
    this.discount += this.info.platform.preVoucher.discount;
    this.info.payment = this.info.total - this.info.totalDiscount;
  }

  /**
   * 驗證優惠券內容是否符合條件
   * @param voucher 優惠券
   * @param amount 要計算折扣的金額
   * @param consumeAmount 優惠範圍的消費金額
   * @param quantity 優惠範圍的商品總數量
   * @returns 處理結果
   */
  validVoucher(voucher: OrderVoucher, amount: number, consumeAmount: number, quantity: number): any {
    let voucherLimit: AFP_VoucherLimit; // 依照尋找的限制條件
    switch (voucher.Voucher_CheckLimit) {
      case 1: { // 依照消費金額
        voucherLimit = voucher.List_VoucherLimit
          .find(x => (consumeAmount >= x.VoucherLimit_MinUnit || x.VoucherLimit_MinUnit === -1) &&
            (consumeAmount <= x.VoucherLimit_MaxUnit || x.VoucherLimit_MaxUnit === -1));
        break;
      }
      case 2: { // 依照消費件數
        voucherLimit = voucher.List_VoucherLimit
          .find(x => (quantity >= x.VoucherLimit_MinUnit || x.VoucherLimit_MinUnit === -1) &&
            (quantity <= x.VoucherLimit_MaxUnit || x.VoucherLimit_MaxUnit === -1));
        break;
      }
    }

    let discount: number;
    if (voucherLimit) {
      if (voucher.Voucher_Type < 11) {
        switch (voucher.Voucher_FeeType) {
          case 1: { // 依照比率
            discount = amount - Math.round(amount * (voucherLimit.VoucherLimit_Discount / 100)); break;
          }
          case 2: { // 依照固定金額
            discount = amount - voucherLimit.VoucherLimit_Discount; // 驗證折扣後會不會變成負向金額
            discount = (discount < 0) ? amount : voucherLimit.VoucherLimit_Discount;
            break;
          }
        }
      } else {
        //  贈品無折扣
        discount = 0;
      }
      voucher.limitID = voucherLimit.VoucherLimit_ID;
      voucher.discount = discount;

      return { success: true, message: '優惠券驗證成功!' };
    } else {
      return { success: false, message: '未達使用條件,不得使用此優惠券...' };
    }
  }

  onCheckoutSubmit(form: NgForm): void {
    const result = { success: true, message: '' };
    const orders: AFP_Order[] = [];
    this.info.stores.forEach(store => {
      store.order.Order_RecName = this.info.name;
      store.order.Order_RecTel = this.info.phone;
      store.order.Order_RecEmail = this.info.email;
      store.order.Order_Amount = store.total;
      orders.push(store.order);
    });

    // 收據金額 >= 銷售金額時，開收據
    // if (this.checkout.List_Cart[0].Cart_ProdReceiptPrice >= this.checkout.List_Cart[0].Cart_Amount) {
    //   sessionStorage.setItem('invoice', JSON.stringify(this.info.invoice));
    //   result.success = true;
    // } else {
    //   // 收據金額 < 銷售金額時，開發票
    //   if (this.info.invoice.invoiceMode > 0) {
    //     // 有選擇的發票樣式
    //     sessionStorage.setItem('invoice', JSON.stringify(this.info.invoice));
    //   } else {
    //     result.success = false;
    //     result.message = '尚未選擇發票樣式!';
    //   }
    // }

    if (this.info.invoice.invoiceMode > 0) {
      sessionStorage.setItem('invoice', JSON.stringify(this.info.invoice));
    } else {
      result.success = false;
      result.message = '尚未選擇發票樣式!';
    }

    if (result.success) {
      this.modal.confirm({ initialState: { message: '提醒您，系統將前往付款頁面，當您按下確定後，須完成付款才會成立訂單，若付款未完成，購物車資料將清空。' } }).subscribe(res => {
        if (res) {
          // orders.forEach(order => {
          //   order.Order_ChangeAmount = order.Order_ChangeAmount * -1;
          //   order.Order_ChangeShippingAmount = order.Order_ChangeShippingAmount * -1;
          // });
          this.appService.openBlock();
          const createOrder: Request_CreateTOrder = {
            User_Code: sessionStorage.getItem('userCode'),
            List_Cart: this.checkout.List_Cart,
            List_UserVoucher: this.userVouchers,
            List_Order: orders
          };
          this.appService.toApi('Checkout', '1608', createOrder).subscribe((coResult: Response_CreateTOrder) => {
            this.router.navigate(['/ShoppingPayment'], {
              state: { data: coResult }
            });
          });
        }
      });
    } else {
      this.modal.show('message', { initialState: { success: false, message: result.message, showType: 1 } });
    }
  }

  ngOnInit() {
    /** 避免輸入鍵盤擋到輸入框 */
    $('input').focus((e) => {
      const target = $('input').index(e.currentTarget);
      document.body.scrollTop = ($('input').eq(target)[0].scrollHeight - 50);
    });
  }

}

export interface Request_GetTCheckout extends Model_ShareData {
  List_Cart: AFP_Cart[];
}

export interface Response_GetTCheckout extends Model_ShareData {
  List_ECStore: AFP_ECStore[];
  List_Cart: AFP_Cart[];
}

export class OrderInfo {
  constructor() {
    this.stores = [];
    this.platform = new OrderPlatform();
    this.voucherInfo = [];
    this.preInvoice = new OrderInvoice();
    this.invoice = new OrderInvoice();
    this.total = 0;
    this.totalDiscount = 0;
    this.payment = 0;
  }
  name: string;
  phone: string;
  email: string;
  stores: OrderStore[];
  /** 平台折扣相關資訊 */
  platform: OrderPlatform;
  tickets: AFP_Product[];
  /** 總計商品金額 */
  total: number;
  /** 總計折扣金額 */
  totalDiscount: number;
  /** 實際付款金額 */
  payment: number;
  /** 優惠內容顯示資訊 */
  voucherInfo: OrderVoucher[];
  /** 是否有可顯示的優惠券 */
  visibleVouchers: boolean;
  /** 選擇中的發票資訊 */
  preInvoice: OrderInvoice;
  /** 已確認的發票資訊 */
  invoice: OrderInvoice;
}

export class Request_CreateOrder extends Model_ShareData {
  List_Order: AFP_Order[];
  List_UserVoucher: AFP_UserVoucher[];
  List_Cart: AFP_Cart[];
}

export class Response_CreateOrder extends Model_ShareData {
  OrderNo: string;
  UserVoucher_ID?: number;
}

export interface Request_CreateTOrder extends Model_ShareData {
  List_Order: AFP_Order[];
  List_UserVoucher: AFP_UserVoucher[];
  List_Cart: AFP_Cart[];
}

export interface Response_CreateTOrder extends Model_ShareData {
  OrderNo: string;
  UserVoucher_ID: number;
}
