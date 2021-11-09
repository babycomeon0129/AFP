import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Request_ECCart, Response_ECCart } from '@app/_models';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-app-go-payment',
  templateUrl: './app-go-payment.component.html'
})
export class AppGoPaymentComponent implements OnInit {

  public cartList = []; // 整理過後購物車資料(呈現)
  private checkoutType = '1';  //  支付頁面 1 : 一般 2: 電子票卷

  constructor(public appService: AppService, private router: Router, private activatedRoute: ActivatedRoute,
              private meta: Meta, private title: Title) {
    this.title.setTitle('AppGoPayment - Mobii!');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ content: 'AppGoPayment - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '', property: 'og:description' });

    this.appService.isApp = 1;
    const request: Request_ECCart = {
      SelectMode: 6, // 查詢
      SearchModel: {
        Cart_Code: 0, // 購物車Code
        ListCartID: ''
      }
    };

    // App訪問
    this.activatedRoute.queryParams.subscribe(params => {
      //  購物車ID APP用
      if (typeof params.cartID !== 'undefined') {
        request.SearchModel.ListCartID = params.cartID;
      }
      //  結帳目標
      if (typeof params.checkoutType !== 'undefined') {
        this.checkoutType = params.checkoutType;
      }
    });

    if (request.SearchModel.ListCartID.length > 0) {
      this.appService.toApi('EC', '1204', request).subscribe((data: Response_ECCart) => {
        for (const storeInfo of data.List_Cart) {
          const cartStoreList: CartStoreList = {
            StoreCode: storeInfo.Cart_ECStoreCode,
            StoreName: storeInfo.Cart_ECStoreName,
            CheckedStatus: true,
            EditMode: false,
            ProductList: []
          };
          const productList: ProductInfo = {
            CartId: storeInfo.Cart_ID,
            DirCode: storeInfo.Cart_UserDefineCode,
            DirName: storeInfo.Cart_UserDefineName,
            ProductCode: storeInfo.Cart_ProductCode,
            ProductName: storeInfo.Show_ProductName,
            ProductAttrValues: storeInfo.Cart_AttributeValueName,
            ProductQty: storeInfo.Cart_Quantity,
            ProductPrice: storeInfo.Cart_Amount,
            ProductImg: storeInfo.Show_ProductImg,
            CheckedStatus: true
          };
          if (this.cartList.filter(e => e.StoreCode === storeInfo.Cart_ECStoreCode).length < 1) {
            this.cartList.push(cartStoreList);
          }
          this.cartList.filter((item) => {
            if (item.StoreCode === storeInfo.Cart_ECStoreCode) {
              item.ProductList.push(productList);
            }
          });
        }

        if (this.cartList.length > 0) {
          let checkoutUrl = '';
          // 前往結帳
          switch (this.checkoutType) {
            case '1':
              checkoutUrl = '/Order/ShoppingOrder';
              break;
            case '2':
              checkoutUrl = '/Order/ETicketOrder';
              break;
            default:
              checkoutUrl = '/Order/ShoppingOrder';
              break;
          }

          this.router.navigate([checkoutUrl], {
            state: {
              data: { checkoutList: this.cartList }
            }
          });
        } else {
          alert('查無商品');
        }
      });
    } else {
      alert('參數錯誤');
    }
  }

  ngOnInit() {
  }

}

export interface ProductInfo {
  CartId: number;
  DirCode: number;
  DirName: string;
  ProductCode: number;
  ProductName: string;
  ProductAttrValues: string;
  ProductQty: number;
  ProductPrice: number;
  ProductImg: string;
  CheckedStatus: boolean;
}

export class CartStoreList {
  StoreCode: number;
  StoreName: string;
  CheckedStatus: boolean;
  ProductList: ProductInfo[];
  EditMode: boolean;
}
