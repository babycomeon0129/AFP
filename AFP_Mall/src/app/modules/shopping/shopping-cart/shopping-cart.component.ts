import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Request_ECCart, Response_ECCart, AFP_Cart, CartStoreList, ProductInfo } from '@app/_models';
import { CookieService } from 'ngx-cookie-service';
import { ModalService } from '@app/shared/modal/modal.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.scss']
})
export class ShoppingCartComponent implements OnInit {
  /** 購物車編碼 */
  public cartCode: number;
  /** 購物車內商品數 */
  public cartCount: number;
  /** 整理過後購物車資料(呈現) */
  public cartList: CartStoreList[] = [];
  /** 小計 */
  public subtotal = 0;
  /** 全部編輯模式 */
  public editAllMode = false;
  /** 有被勾選的商家（編號陣列） */
  public selectedStoresList: number[] = [];
  /** 有被勾選的商品（編號陣列） */
  public selectedProductsList: number[] = [];
  /** 有更改數量的商品 */
  public productsToUpdate: AFP_Cart[] = [];
  /** 空購物車圖示顯示 */
  public nocartShow = false;

  constructor(public appService: AppService, private oauthService: OauthService,
              public modal: ModalService, private cookieService: CookieService, private router: Router,
              private route: ActivatedRoute, private meta: Meta, private title: Title) {
    this.title.setTitle('購物車｜線上商城 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! 線上商城購物車。你是不是…還有商品在購物車裡忘了結帳？趕快結帳把購物車清空，賺取 Mobii! M Points 回饋點數吧！我 OK，你先買！' });
    this.meta.updateTag({ content: '購物車｜線上商城 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! 線上商城購物車。你是不是…還有商品在購物車裡忘了結帳？趕快結帳把購物車清空，賺取 Mobii! M Points 回饋點數吧！我 OK，你先買！', property: 'og:description' });
  }

  ngOnInit() {
    this.cartCode = Number(this.cookieService.get('cart_code'));
    this.cartCount = Number(this.cookieService.get('cart_count_Mobii')) || 0;
    this.showCartData();
  }

  /** 讀取、整理、顯示購物車資料 */
  showCartData(): void {
    this.appService.openBlock();
    const request: Request_ECCart = {
      SelectMode: 4, // 查詢
      SearchModel: {
        Cart_Code: this.cartCode // 購物車Code
      }
    };
    this.appService.toApi('EC', '1204', request).subscribe((data: Response_ECCart) => {
      // 若在此頁登入：登入前若購物車有商品，則先清空購物車。
      // 將購物車更新為登入後的資料後，再將登入前有勾選的商家和商品勾選起來，再將登入前有更改數量的商品數量更新（都只變更前端資料）。
      if (this.cartList.length > 0) {
        this.cartList = [];
      } else {
        this.nocartShow = true;
      }
      // 進入購物車頁時，如商品改變價格，則跳出提醒用戶商品價格改變
      if(data.List_PriceChange !== null ) {
        this.modal.show('message', { initialState: { success: false, message: `提醒您，${data.List_PriceChange}價格變更了！`, showType: 1, checkBtnMsg: `我知道了` } });
      }
      // loop後端傳來的每樣商品資訊
      for (const store of data.List_Cart) {
        const storeInfo: CartStoreList = {
          StoreCode: store.Cart_ECStoreCode,
          StoreName: store.Cart_ECStoreName,
          CheckedStatus: false,
          EditMode: false,
          ProductList: []
        };
        const storeProduct: ProductInfo = {
          CartId: store.Cart_ID,
          DirCode: store.Cart_UserDefineCode,
          DirName: store.Cart_UserDefineName,
          ProductCode: store.Cart_ProductCode,
          ProductName: store.Show_ProductName,
          ProductAttrValues: store.Cart_AttributeValueName,
          ProductQty: store.Cart_Quantity,
          ProductPrice: store.Cart_Amount,
          ProductImg: store.Show_ProductImg,
          CheckedStatus: false,
          Cart_ProductState: store.Cart_ProductState
        };

        // 若cartList中無此商店編碼，則push該商店資訊
        if (this.cartList.filter(e => e.StoreCode === store.Cart_ECStoreCode).length < 1) {
          this.cartList.push(storeInfo);
          // （在此頁登入）勾選登入前若有已勾選的商家
          if (this.selectedStoresList.includes(store.Cart_ECStoreCode)) {
            storeInfo.CheckedStatus = true;
          }
        }
        // 找到cartList中此商品所屬的商店並push進商品
        this.cartList.filter((item) => {
          if (item.StoreCode === store.Cart_ECStoreCode) {
            item.ProductList.push(storeProduct);
          }
          // （在此頁登入）勾選登入前若有已勾選的商品
          if (this.selectedProductsList.includes(storeProduct.ProductCode)) {
            storeProduct.CheckedStatus = true;
          }
          // （在此頁登入）更新登入前有改變數量的商品
          if (this.productsToUpdate.length > 0) {
            this.productsToUpdate.filter(p => {
              if (p.Cart_ID === storeProduct.CartId) {
                storeProduct.ProductQty = p.Cart_Quantity;
              }
            });
          }
        });
      }
      this.cartCount = data.Cart_Count;
      this.cookieService.set('cart_count_Mobii', this.cartCount.toString(), 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    });
  }

  /** 單選商家：勾選一商家時，其他已被勾選的商家及商品都取消勾選(要改為多選時刪掉這段即可)
   * @param store 該商家
   */
  singleStore(store: CartStoreList): void {
    if (!store.CheckedStatus) {
      this.cartList.forEach(s => {
        s.CheckedStatus = false;
        s.ProductList.forEach(p => {
          p.CheckedStatus = false;
        });
      });
      this.selectedStoresList = [];
      this.selectedProductsList = [];
    }
  }

  /** 勾選商家
   * @param store 該商家
   */
  onToggleStore(store: CartStoreList): void {
    // 單選商家
    this.singleStore(store);

    // toggle CheckedStatus
    store.CheckedStatus = !store.CheckedStatus;

    // 若勾選此商家，其下商品也都勾選起來、放入陣列
    if (store.CheckedStatus) {
      store.ProductList.forEach(product => {
        // 如果商品是資料有效狀態，才能放入selectedProductsList內
        if (product.Cart_ProductState) {
          product.CheckedStatus = true;
          this.selectedProductsList.push(product.ProductCode);
        }
      });
      this.selectedStoresList.push(store.StoreCode);
    } else {
      store.ProductList.forEach(product => {
        product.CheckedStatus = false;
        this.selectedProductsList.splice(this.selectedProductsList.indexOf(product.ProductCode), 1);
      });
      this.selectedStoresList.splice(this.selectedStoresList.indexOf(store.StoreCode), 1);
    }

    this.calcSubtotal();
  }

  /** 勾選商品
   * @param store 所屬商家
   * @param product 該商品
   */
  onToggleProduct(store: CartStoreList, product: ProductInfo): void {
    // 單選商家
    this.singleStore(store);
    // 先判斷商品資料是否上架
    if (product.Cart_ProductState) {
      product.CheckedStatus = !product.CheckedStatus;
      if (product.CheckedStatus) {
        // product
        this.selectedProductsList.push(product.ProductCode);
        // store
        if (!this.selectedStoresList.includes(store.StoreCode)) {
          this.selectedStoresList.push(store.StoreCode);
          store.CheckedStatus = true;
        }
      } else {
        this.selectedProductsList.splice(this.selectedProductsList.indexOf(product.ProductCode), 1);
      }

      // 若取消勾選此商品後，所屬店家已無任何勾選商品，則也取消勾選該店家
      if (store.ProductList.every(prod => !prod.CheckedStatus)) {
        store.CheckedStatus = false;
        this.selectedStoresList.splice(this.selectedStoresList.indexOf(store.StoreCode), 1);
      }

      this.calcSubtotal();
    }
  }

  /** 改變商品數量(改變顯示、放入陣列，按下一步前往結帳時才更新DB)
   * @param actionCode 0(-), 1(+)
   * @param product 該商品
   */
  onChangeAmount(actionCode: number, product: ProductInfo): void {
    // 改變顯示
    if (actionCode === 0) {
      if (product.ProductQty > 1) {
        product.ProductQty--;
      }
    } else {
      if (product.ProductQty < 98) {
        product.ProductQty++;
      }
    }
    // 放入/更新陣列
    const p: AFP_Cart = {
      Cart_ID: product.CartId,
      Cart_Quantity: product.ProductQty
    };

    if (this.productsToUpdate.length > 0) {
      if (this.productsToUpdate.every(item => item.Cart_ID !== product.CartId)) {
        this.productsToUpdate.push(p);
      } else {
        for (const item of this.productsToUpdate) {
          if (item.Cart_ID === product.CartId) {
            item.Cart_Quantity = product.ProductQty;
            break;
          }
        }
      }
    } else {
      this.productsToUpdate.push(p);
    }

    this.calcSubtotal();
  }

  /** 商家編輯模式控制
   * @param store 該商家
   */
  toggleEditMode(store: CartStoreList): void {
    store.EditMode = !store.EditMode;
    if (!store.EditMode) {
      if (this.cartList.every(s => !s.EditMode)) {
        this.editAllMode = false;
      }
    }
  }
  /** 全部編輯模式控制 */
  toggleEditAllMode(): void {
    if (!this.editAllMode) {
      this.cartList.forEach(s => s.EditMode = true);
    } else {
      this.cartList.forEach(s => s.EditMode = false);
    }
    this.editAllMode = !this.editAllMode;
  }

  /** 刪除商品
   * @param store 所屬商家
   * @param product 該商品
   */
  onRemoveProduct(store: CartStoreList, product: ProductInfo): void {
    const request: Request_ECCart = {
      SelectMode: 2,
      Cart_Count: this.cartCount,
      SearchModel: {
        Cart_Code: this.cartCode
      },
      AFP_Cart: {
        Cart_ID: product.CartId
      }
    };

    this.appService.toApi('EC', '1204', request).subscribe((data: Response_ECCart) => {
      // make its CheckStatus false (*matters when claculating subtotal, but after "splice" it's not necessary)
      product.CheckedStatus = false;
      // remove it from array
      this.selectedProductsList.splice(this.selectedProductsList.indexOf(product.ProductCode), 1);
      // remove it from data/DOM
      store.ProductList.filter((item, index) => {
        if (item.CartId === product.CartId) {
          store.ProductList.splice(index, 1);
          return false;
        }
      });
      // 若刪除此商品後，所屬店家已無任何商品，則也取消勾選該店家、從陣列移除、從DOM移除
      if (store.ProductList.length === 0) {
        store.CheckedStatus = false;
        // remove it from array
        this.selectedStoresList.splice(this.selectedStoresList.indexOf(store.StoreCode), 1);
        // remove it from data/DOM
        this.cartList.filter((item, index) => {
          if (item.StoreCode === store.StoreCode) {
            this.cartList.splice(index, 1);
            return false;
          }
        });
      }
      // 更新購物車商品數
      this.cartCount = data.Cart_Count;
      this.cookieService.set('cart_count_Mobii', data.Cart_Count.toString(), 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');

      this.calcSubtotal();
    });
  }

  /** 計算小計 (「有勾選的」商品單價*數量; 勾選商家、勾選商品、改變數量、刪除商品時會有更動) */
  calcSubtotal(): void {
    this.subtotal = 0;
    this.cartList.forEach(s => {
      s.ProductList.forEach(p => {
        if (p.CheckedStatus) {
          this.subtotal += p.ProductPrice * p.ProductQty;
        }
      });
    });
  }

  /** 前往結帳 */
  onGoToCheckout(): void {
    // 防呆: 若沒有已選商品則跳出modal
    if (this.selectedProductsList.length === 0 || this.selectedStoresList.length === 0) {
      this.modal.show('message', { initialState: { success: false, message: '還沒有選擇要結帳的商家及商品喔!', showType: 1 } });
    } else {
      // 若未登入，則跳出登入視窗
      if (!this.appService.loginState) {
        this.oauthService.loginPage(this.appService.isApp, '/Order/ShoppingOrder');
      } else {
        // 已登入
        // (若有更動過的商品)更改商品數
        if (this.productsToUpdate.length > 0) {
          const request: Request_ECCart = {
            SelectMode: 5, // 多筆更新
            Cart_Count: this.cartCount,
            SearchModel: {
              Cart_Code: this.cartCode
            },
            AFP_Cart: {
              Cart_Code: this.cartCode
            },
            List_Cart: this.productsToUpdate
          };

          this.appService.toApi('EC', '1204', request).subscribe((data: Response_ECCart) => {
            // 若失敗後端會回(可能是沒登入)
            // 數量更新成功後前往結帳
            this.router.navigate(['/Order/ShoppingOrder'], {
              state: {
                data: { checkoutList: this.cartList }
              }
            });
          });
        } else {
          // 直接前往結帳
          this.router.navigate(['/Order/ShoppingOrder'], {
            state: {
              data: { checkoutList: this.cartList }
            }
          });
        }
      }
    }
  }


}
