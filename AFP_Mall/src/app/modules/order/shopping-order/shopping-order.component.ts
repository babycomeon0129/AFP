import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { Request_GetCheckout, Response_GetCheckout, Request_GetUserVoucher, Response_GetUserVoucher,
        Request_CheckUserVoucher, Response_CheckUserVoucher, Request_MemberAddress, AFP_Cart, AFP_ECStore,
        AFP_UserFavourite, AFP_UserVoucher, AFP_VoucherLimit, AFP_Order, Model_ShareData,
        OrderVoucher, OrderInvoice, OrderStore, OrderPlatform } from '@app/_models';
import { NgForm } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation} from '@app/animations';

@Component({
  selector: 'app-shopping-order',
  templateUrl: './shopping-order.component.html',
  styleUrls: ['./shopping-order.scss', '../shopping-payment/shopping-payment.scss'],
  animations: [layerAnimation]
})
export class ShoppingOrderComponent implements OnInit {
  /** 結帳頁資訊整合 */
  public info: OrderInfo = new OrderInfo();
  /** 目前鎖定的商店(選擇寄送方式時使用) */
  public holdStore: OrderStore = new OrderStore();
  /** 暫存的訂單資訊 */
  public tempOrder: AFP_Order = new AFP_Order();
  /** 寄送方式暫存選項 */
  public choiceNum = 0;
  /** 折扣金額 */
  public discount = 0;
  /** 儲存結帳相關資訊 */
  public checkout: Response_GetCheckout = { List_UserReport: [] };
  /** 儲存優惠券相關資訊 */
  public voucher: Response_GetUserVoucher;
  /** 無法結帳的優惠券 */
  // public banVoucher: AFP_Voucher[] = [];
  /** 消費者地址列表 */
  public addressList: AFP_UserFavourite[] = [];
  /** 自取店家列表 */
  public storePickSelf: AFP_ECStore[] = [];
  /** 優惠券整理資訊 */
  public userVouchers: AFP_UserVoucher[] = [];
  /** 新增地址用 */
  public requestAddress: AFP_UserFavourite = new AFP_UserFavourite();
  /** 是否正在設定預設地址 (控制進入頁面正在設置時不呼叫layerTrig) */
  private settingAddress = true;
  /** 同頁滑動切換 0: 原頁 1: 行政區選單 2: 縣市選單 3:愛心碼選單 4:新增地址 5: 選擇優惠券 6:寄送方式 7: 發票選取 */
  public layerTrig = 0;

  constructor(public appService: AppService, public modal: ModalService, private router: Router, private meta: Meta, private title: Title) {
    this.title.setTitle('確定訂單｜線上商城 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! 線上商城購物車 - 確認訂單。 如果你有在 Mobii! 平台購物，這裡就會看到你的訂單訊息。請登入註冊 Mobii! 帳號以看到完整內容。' });
    this.meta.updateTag({ content: '確定訂單｜線上商城 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! 線上商城購物車 - 確認訂單。 如果你有在 Mobii! 平台購物，這裡就會看到你的訂單訊息。請登入註冊 Mobii! 帳號以看到完整內容。',
                          property: 'og:description' });
  }

  ngOnInit() {
    if (history.state.data !== undefined) {
      const afpCart: AFP_Cart[] = [];
      // 以購物車 ID 取得相關結帳資訊
      history.state.data.checkoutList.forEach((cart: { ProductList: any[]; }) => {
        const checkout = cart.ProductList.filter(x => x.CheckedStatus);
        if (checkout.length > 0) {
          checkout.forEach(product => {
            afpCart.push({ Cart_ID: product.CartId });
          });
        }
      });
      this.appService.openBlock();
      const getCheckout: Request_GetCheckout = {
        SelectMode: 4, // 查詢
        User_Code: sessionStorage.getItem('userCode'),
        List_Cart: afpCart
      };
      this.appService.toApi('Checkout', '1605', getCheckout).subscribe((data: Response_GetCheckout) => {
        this.checkout = data;
        // 帶入會員資訊 (姓名、手機、email)
        this.info.name = this.checkout.UserInfo_Name;
        this.info.phone = this.checkout.UserProfile_Mobile;
        this.info.email = this.checkout.UserProfile_Email;
        const getVoucher: Request_GetUserVoucher = {
          SelectMode: 4, // 查詢
          User_Code: sessionStorage.getItem('userCode'),
          List_Cart: this.checkout.List_Cart
        };
        this.appService.toApi('Checkout', '1606', getVoucher).subscribe((voucher: Response_GetUserVoucher) => {
          this.voucher = voucher;
          this.addressList = data.List_UserFavourite;
          // 檢查使用者有無預設地址
          const defaultAddress = this.addressList.find((x) => x.UserFavourite_IsDefault === 1);
          const addressIndex = this.addressList.findIndex((x) => x.UserFavourite_IsDefault === 1);

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
            newStore.products = data.List_Cart.filter(x => x.Cart_ECStoreCode === store.ECStore_Code);
            newStore.products.forEach(product => {
              newStore.total += product.Cart_Quantity * product.Cart_Amount;
            });

            // 若使用者已有預設地址且該商店只提供宅配則將寄送方式設為寄送至該預設地址
            if (defaultAddress !== undefined && this.checkout.Pick_ECStore.length === 0) {
              if (this.checkout.Pick_ECStore.find(s => s.ECStore_Code === store.ECStore_Code) === undefined) {
                // 該商店只提供宅配(無自取)
                this.clickDeliveryWay(newStore);
                this.choiceAddress(defaultAddress, addressIndex);
                this.confirmDeliveryWay();
              }
            }

            // 以總店查詢商店可使用的優惠券
            newStore.vouchers = voucher.List_Voucher
              .filter(x => x.Voucher_ECStoreCode === store.ECStore_Code
                && x.Voucher_UsedLimitType === 11 && x.VoucherRange_Prod !== null);
            if (newStore.vouchers.length > 0) { this.info.visibleVouchers = true; }
            // 無法結帳的優惠券
            // this.banVoucher = voucher.List_Voucher.filter(x => x.VoucherRange_Prod === null);
            // 總計訂單金額
            this.info.total += newStore.total;
          });

          this.settingAddress = false;
          // this.addressList = data.List_UserFavourite;

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
          { message: '請由購物車選擇要結帳的商品!', showCancel: false },
        backdrop: 'static',
        keyboard: false
      }).subscribe(option => {
        this.router.navigate(['/Shopping/ShoppingCart'], {queryParams: { referrer: 'illegal' }});
      });
    }
  }

  /** 避免手機輸入鍵盤擋到輸入框 */
  @HostListener('window: focusin', ['$event'])
  awayFromKeyboard(event: FocusEvent) {
    document.body.scrollTop = (event.composedPath()[0] as HTMLElement).scrollHeight - 50;
  }

  /** 開啟選擇優惠券頁面 */
  toChoiceVoucher(): void {
    // 還原優惠券選項
    this.info.stores.forEach(store => {
      store.preVoucher = JSON.parse(JSON.stringify(store.voucher));
    });
    this.info.platform.preVoucher = JSON.parse(JSON.stringify(this.info.platform.voucher));
    this.discount = this.info.totalDiscount;
    this.layerTrig = 5;
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
    this.info.voucherInfo = [];
    this.userVouchers = [];
    this.recalculate();
    this.info.platform.preVoucher = new OrderVoucher();
    this.info.platform.topFreightStore = new OrderStore();
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
        this.recalculate('discount');
      } else {
        e.target.checked = false;
        this.modal.show('message', { initialState: { success: false, message: result.message, showType: 1 } });
      }
    }
  }

  /** 選擇平台優惠券 */
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
            this.info.platform.topFreightStore = topFreightStore;
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
      this.recalculate('discount');
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
            switch (this.info.platform.preVoucher.Voucher_Type) {
              case 1: { // 以消費金額優惠則將折扣均分至各訂單
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
                break;
              }
              case 2: { // 以最高運費店家再折扣
                this.info.platform.topFreightStore.order.Order_ChangeAmount += this.info.platform.preVoucher.discount;
                this.info.platform.topFreightStore.order.Order_ChangeShippingAmount += this.info.platform.preVoucher.discount;
                break;
              }
            }
            this.info.platform.voucher = JSON.parse(JSON.stringify(this.info.platform.preVoucher));
            this.info.totalDiscount += this.info.platform.preVoucher.discount;
            this.info.voucherInfo.push(this.info.platform.voucher);
          }
          this.recalculate();
          this.layerTrig = 0;
        } else {
          this.modal.show('message', { initialState: { success: false, message: data.ErrorMsg, showType: 1 } });
        }
      });
    } else {
      //  可不選擇優惠券
      // this.modal.show('message', { initialState: { success: false, message: '請選擇至少一張優惠券!', showType: 1 } });
      this.layerTrig = 0;
    }
  }

  /**
   * 點擊開啟寄送方式
   * @param store 店家(訂單)
   */
  clickDeliveryWay(store: OrderStore): void {
    this.holdStore = store;
    this.tempOrder = JSON.parse(JSON.stringify(store.order));
    this.choiceNum = store.dwSelected;
    this.storePickSelf = this.checkout.Pick_ECStore.filter(x => x.ECStore_CompanyCode === store.ECStore_CompanyCode);
    // 若已有選擇寄送方式則再次開啟時不再將寄方式設為預設地址
    if (this.holdStore.dwSelected === undefined) {
      this.addressList.forEach((address, index) => {
        if (address.UserFavourite_IsDefault === 1) {
          let pairSuccess = false;
          this.checkout.List_ECLogistics.forEach(logistics => {
            const pair = logistics.List_ECLogisticsPart.find(x => x.ECLogisticsPart_Country === 886 &&
              x.ECLogisticsPart_City === address.UserFavourite_Number1);
            if (pair !== undefined) { // 匹配到物流資訊時擷取運費
              pairSuccess = true;
              this.tempOrder.Order_ECLogisticsID = logistics.ECLogistics_ID;
              this.tempOrder.Order_ShippingAmount = logistics.ECLogistics_Amount;
              return false; // 跳出物流資訊 forEach
            }
          });
          if (pairSuccess) {
            this.choiceNum = index;
            this.tempOrder.Order_DeliveryWays = 1;
            this.tempOrder.Order_RecCountry = 886;
            this.tempOrder.Order_RecCity = address.UserFavourite_Number1;
            this.tempOrder.Order_RecCityArea = address.UserFavourite_Number2;
            this.tempOrder.Order_RecAddress = address.UserFavourite_Text3;
            return false; // 跳出地址 forEach
          }
        }
      });
    }
    if (!this.settingAddress) {
      this.layerTrig = 6;
    }
  }

  /**
   * 選擇寄送地址，並驗證是否有匹配的物流資訊，計算運費
   * @param address 所選地址
   * @param num 項目編號
   * @returns 回傳結果(未匹配物流資訊時回傳失敗)
   */
  choiceAddress(address: AFP_UserFavourite, num: number) {
    this.choiceNum = num;
    // 是否匹配物流成功
    let pairSuccess = false;
    this.checkout.List_ECLogistics.forEach(logistics => {
      const pair = logistics.List_ECLogisticsPart.find(x => x.ECLogisticsPart_Country === 886 &&
        x.ECLogisticsPart_City === address.UserFavourite_Number1);
      if (pair !== undefined) { // 匹配到物流資訊時擷取運費
        pairSuccess = true;
        this.tempOrder.Order_ECLogisticsID = logistics.ECLogistics_ID;
        this.tempOrder.Order_ShippingAmount = logistics.ECLogistics_Amount;
        return false; // 跳出 forEach
      }
    });
    if (pairSuccess) {
      this.tempOrder.Order_DeliveryWays = 1;
      this.tempOrder.Order_RecCountry = 886;
      this.tempOrder.Order_RecCity = address.UserFavourite_Number1;
      this.tempOrder.Order_RecCityArea = address.UserFavourite_Number2;
      this.tempOrder.Order_RecAddress = address.UserFavourite_Text3;
    } else {
      this.modal.show('message', { initialState: { success: false, message: '尚未有物流可以配送選擇地址,請選擇其他地址!', showType: 1 } });
      return false;
    }
  }

  /**
   * 選擇來店自取，歸 0 運費
   * @param store 所選自取店家
   * @param num 項目編號
   */
  choicePickSelf(store: AFP_ECStore, num: number) {
    this.tempOrder.Order_ECLogisticsID = store.ECStore_Code;
    this.tempOrder.Order_DeliveryWays = 2;
    this.tempOrder.Order_RecCountry = 886;
    this.tempOrder.Order_RecCity = store.ECStore_PickCity;
    this.tempOrder.Order_RecCityArea = store.ECStore_PickCityArea;
    this.tempOrder.Order_RecAddress = store.ECStore_PickAddress;
    this.tempOrder.Order_ShippingAmount = 0;
    this.choiceNum = num;
  }

  confirmDeliveryWay() {
    if (this.holdStore.order.Order_ShippingAmount !== this.tempOrder.Order_ShippingAmount && this.userVouchers.length > 0) {
      this.info.totalDiscount = 0;
      this.userVouchers = [];
      this.info.stores.forEach(store => {
        store.voucher = new OrderVoucher();
        store.preVoucher = new OrderVoucher();
        store.order.Order_ChangeAmount = 0;
        store.order.Order_PlatChangeAmount = 0;
      });
      this.info.voucherInfo = [];
      this.info.platform.voucher = new OrderVoucher();
      this.info.platform.preVoucher = new OrderVoucher();
      this.info.platform.topFreightStore = new OrderStore();

      this.modal.show('message', { initialState: { success: false, message: '因運費變動,請重新選擇優惠券', showType: 1 } });
    }
    this.holdStore.order.Order_ECLogisticsID = this.tempOrder.Order_ECLogisticsID;
    this.holdStore.order.Order_DeliveryWays = this.tempOrder.Order_DeliveryWays;
    this.holdStore.order.Order_RecCountry = this.tempOrder.Order_RecCountry;
    this.holdStore.order.Order_RecCity = this.tempOrder.Order_RecCity;
    this.holdStore.order.Order_RecCityArea = this.tempOrder.Order_RecCityArea;
    this.holdStore.order.Order_RecAddress = this.tempOrder.Order_RecAddress;
    this.holdStore.order.Order_ShippingAmount = this.tempOrder.Order_ShippingAmount;
    this.holdStore.dwSelected = this.choiceNum;
    this.recalculate('freight');
    if (!this.settingAddress) {
      this.layerTrig = 0;
    }
  }

  toInvoice(): void {
    this.info.preInvoice = JSON.parse(JSON.stringify(this.info.invoice));
    this.layerTrig = 7;
  }

  confirmInvoice(): void {
    switch (this.info.preInvoice.invoiceMode) {
      case 2: { // 公司發票(三聯式)
        if (this.info.preInvoice.invoiceTitle.trim() === '' || this.info.preInvoice.invoiceTaxID.trim() === '') {
          this.modal.show('message', { initialState: { success: false, message: '請輸入發票抬頭名稱與統一編號', showType: 1 } });
        } else {
          const regexp1 = /^[0-9]{8}$/g;
          const regexp1Ok = regexp1.exec(this.info.preInvoice.invoiceTaxID.trim());
          if ( regexp1Ok === null ) {
            this.modal.show('message', { initialState: { success: false, message: '統一編號格式錯誤，請輸入正確的統一編號', showType: 1 } });
          } else {
            this.info.invoice = this.info.preInvoice;
            this.info.invoice.message = '三聯式發票 ' + this.info.invoice.invoiceTitle + '/' + this.info.invoice.invoiceTaxID;
            this.layerTrig = 0;
          }
        }
        break;
      }
      case 3: { // 捐贈發票
        if (this.info.preInvoice.loveCode.trim() === '') {
          this.modal.show('message', { initialState: { success: false, message: '請輸入愛心碼', showType: 1 } });
        } else {
          this.info.invoice = this.info.preInvoice;
          this.info.invoice.message = '發票捐贈 愛心碼:' + this.info.invoice.loveCode;
          this.layerTrig = 0;
        }
        break;
      }
      case 4: { // 會員載具
        this.info.invoice = this.info.preInvoice;
        this.info.invoice.carrierType = 3;
        this.info.invoice.message = '會員載具';
        this.layerTrig = 0;
        break;
      }
      case 5: { // 手機載具
        if (this.info.preInvoice.carrierCode.trim() === '') {
          this.modal.show('message', { initialState: { success: false, message: '請輸入正確的手機條碼', showType: 1 } });
        } else {
          const regexp = /^\/{1}[0-9A-Z]{7}$/g;
          const regexpOk = regexp.exec(this.info.preInvoice.carrierCode.trim());
          if ( regexpOk === null ) {
            this.modal.show('message', { initialState: { success: false, message: '手機條碼格式錯誤，請輸入正確的手機條碼', showType: 1 } });
          } else {
            this.info.invoice = this.info.preInvoice;
            this.info.invoice.carrierType = 1;
            this.info.invoice.message = '手機條碼載具 ' + this.info.invoice.carrierCode;
            this.layerTrig = 0;
          }
        }
        break;
      }
      default: {
        this.modal.show('message', { initialState: { success: false, message: '請選擇您所需要的發票樣式', showType: 1 } });
        break;
      }
    }
  }

  /**
   * 重新計算各商店優惠金額及平台優惠金額
   */
  recalculate(type?: string): void {
    switch (type) {
      case 'discount': { // 重計折扣
        this.discount = 0;
        this.info.stores.forEach(store => {
          this.discount += store.preVoucher.discount;
        });
        this.discount += this.info.platform.preVoucher.discount;
        break;
      }
      case 'freight': { // 重計運費
        this.info.totalFreight = 0;
        this.info.stores.forEach(store => {
          this.info.totalFreight += store.order.Order_ShippingAmount;
        });
        break;
      }
    }
    this.info.payment = (this.info.total + this.info.totalFreight) - this.info.totalDiscount;
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

  /** 新增地址 */
  onAddressSubmit(form: NgForm): void {
    this.requestAddress.UserFavourite_ID = 0;
    this.requestAddress.UserFavourite_CountryCode = 886;
    this.requestAddress.UserFavourite_Type = 1;
    this.requestAddress.UserFavourite_UserInfoCode = 0;
    this.requestAddress.UserFavourite_TypeCode = 0;
    this.requestAddress.UserFavourite_State = 1;
    this.requestAddress.UserFavourite_SyncState = 0;
    if (!this.requestAddress.UserFavourite_IsDefault) {
      this.requestAddress.UserFavourite_IsDefault = 0;
    }

    const request: Request_MemberAddress = {
      SelectMode: 1,
      User_Code: sessionStorage.getItem('userCode'),
      AFP_UserFavourite: this.requestAddress
    };

    this.appService.toApi('Member', '1503', request).subscribe(() => {
      const newAddress = JSON.parse(JSON.stringify(this.requestAddress));
      // 將資料放入「地址列表」中
      this.addressList.push(newAddress);
      // 將此新地址設為此次訂購寄送方式
      this.clickDeliveryWay(this.holdStore);
      this.choiceAddress(newAddress, this.addressList.length - 1);
      this.confirmDeliveryWay();
      // 回到上一頁(「地址列表」)
      this.layerTrig = 0;
      // 將「新增地址」的input清空
      form.resetForm();
      this.requestAddress = new AFP_UserFavourite();
    });
  }

  onCheckoutSubmit(form: NgForm): void {
    const result = { success: true, message: '' };
    const orders: AFP_Order[] = [];
    this.info.stores.forEach(store => {
      if (store.order.Order_DeliveryWays > 0) {
        store.order.Order_RecName = this.info.name;
        store.order.Order_RecTel = this.info.phone;
        store.order.Order_RecEmail = this.info.email;
        store.order.Order_Amount = store.total + store.order.Order_ShippingAmount;
        orders.push(store.order);
      } else {
        result.success = false;
        result.message = '店家 ' + store.ECStore_ShowName + ' 尚未選擇寄送方式!';
        return result.success;
      }
    });

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
          const createOrder: Request_CreateOrder = {
            User_Code: sessionStorage.getItem('userCode'),
            List_Cart: this.checkout.List_Cart,
            List_UserVoucher: this.userVouchers,
            List_Order: orders
          };
          this.appService.toApi('EC', '1601', createOrder).subscribe((coResult: Response_CreateOrder) => {
            this.router.navigate(['/Order/ShoppingPayment'], {
              state: { data: coResult }
            });
          });
        }
      });
    } else {
      this.modal.show('message', { initialState: { success: false, message: result.message, showType: 1 } });
    }
  }

}

export class OrderInfo {
  constructor() {
    this.stores = [];
    this.platform = new OrderPlatform();
    this.voucherInfo = [];
    this.preInvoice = new OrderInvoice();
    this.invoice = new OrderInvoice();
    this.total = 0;
    this.totalFreight = 0;
    this.totalDiscount = 0;
    this.payment = 0;
  }

  /** 須結帳店家(訂單) */
  stores: OrderStore[];
  /** 平台折扣相關資訊 */
  platform: OrderPlatform;
  /** 總計商品金額 */
  total: number;
  /** 總計運費金額 */
  totalFreight: number;
  /** 總計折扣金額 */
  totalDiscount: number;
  /** 實際付款金額 */
  payment: number;
  /** 優惠內容顯示資訊 */
  voucherInfo: OrderVoucher[];
  visibleVouchers: boolean;
  name: string;
  phone: string;
  email: string;
  /** 選擇中的發票資訊 */
  preInvoice: OrderInvoice;
  /** 已確認的發票資訊 */
  invoice: OrderInvoice;
}

export class Request_CreateOrder extends Model_ShareData {
  /** 訂單資訊 */
  List_Order: AFP_Order[];
  /** 使用者優惠卷資訊 */
  List_UserVoucher: AFP_UserVoucher[];
  /** 購物車資訊 */
  List_Cart: AFP_Cart[];
}

export class Response_CreateOrder extends Model_ShareData {
  OrderNo: string;
  UserVoucher_ID?: number;
}
