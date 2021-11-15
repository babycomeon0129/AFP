import { environment } from '@env/environment';
import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import {
  Request_ECProductDetail, Response_ECProductDetail, AFP_Product, AFP_ECStore, AFP_Attribute, Request_ECCart,
  Response_ECCart, AFP_Voucher, AFP_ProductImg, CartStoreList
} from '@app/_models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ModalService } from '@app/shared/modal/modal.service';
import { SwiperOptions } from 'swiper';
import { Meta, Title } from '@angular/platform-browser';
import smoothscroll from 'smoothscroll-polyfill';
import { layerAnimationUp } from '@app/animations';

smoothscroll.polyfill(); // kick off the polyfill!

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['../shopping/shopping.scss', './product-detail.scss'],
  animations: [layerAnimationUp]
})
export class ProductDetailComponent implements OnInit {
  /** 購物車編碼 */
  public cartCode: number;
  /** 購物車商品數 */
  public cartCount: number;
  /** 商品目錄編碼 */
  public productDirCode: number;
  /** 商品編碼 */
  public productCode: number;
  /** 置頂商品圖列表 */
  public productImgList: AFP_ProductImg[] = [];
  /** 商品資訊 */
  public productInfo: AFP_Product;
  /** 店家資訊 */
  public vendorInfo: AFP_ECStore;
  /** 規格 */
  public attrList: AFP_Attribute[] = [];
  /** 此商家的優惠券（1筆） */
  public voucherData: AFP_Voucher;
  /** 規格值編號（多筆以逗號區隔） */
  public cartAttrValueCode = '';
  /** 規格值名稱（多筆以逗號區隔） */
  public cartAttrValueName = '';
  /** 所選商品數量（預設1） */
  public prodAmount = 1;
  /** 購買按鈕文字  */
  public buybtnTxt = '加入購物車';
  /** 分享至社群時顯示的文字 */
  public textForShare: string;
  /** APP分享使用的url */
  public APPShareUrl: string;
  /** 判斷商品是否可購買 */
  public productIsBuy  = true;
  /** 上方商品圖片輪播 swiper */
  public productImgs: SwiperOptions = {
    pagination: {
      el: '.shopping-productsimgbox .swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.shopping-productsimgbox .swiper-button-next',
      prevEl: '.shopping-productsimgbox .swiper-button-prev',
    }
  };
  // 關於商品3個標籤
  @ViewChild('tag01', { static: false }) tag01: ElementRef;
  @ViewChild('tag02', { static: false }) tag02: ElementRef;
  @ViewChild('tag03', { static: false }) tag03: ElementRef;
  /** 目前所在區塊 0 不在詳細內容 1 關於商品 2 訂購須知 3運送須知 */
  currentSec = 0;
  /** 同頁滑動切換 0:本頁 1:選擇商品規格 */
  public layerTrigUp = 0;

  constructor(public appService: AppService, private oauthService: OauthService,
              private router: Router, private route: ActivatedRoute, public modal: ModalService,
              private cookieService: CookieService, private meta: Meta, private title: Title) {
    this.productCode = parseInt(this.route.snapshot.params.Product_Code, 10);
    this.productDirCode = parseInt(this.route.snapshot.params.ProductDir_Code, 10);
    this.cartCode = Number(this.oauthService.cookiesGet('cart_code').c);
  }

  ngOnInit() {
    // 讀取商品詳細
    const request: Request_ECProductDetail = {
      User_Code: this.oauthService.cookiesGet('userCode').s,
      Cart_Count: 0,
      SearchModel: {
        Product_Code: this.productCode,
        UserDefine_Code: this.productDirCode,
        Cart_Code: this.cartCode
      }
    };
    this.appService.openBlock();
    this.appService.toApi('EC', '1203', request).subscribe((data: Response_ECProductDetail) => {
      this.productImgList = data.List_ProductImg;
      this.productInfo = data.AFP_Product;
      this.vendorInfo = data.AFP_ECStore;
      this.vendorInfo.ECStore_Justka = data.JustKaUrl;
      this.voucherData = data.AFP_VoucherData;
      this.attrList = data.List_Attribute;
      this.productDirCode = data.AFP_Product.Product_UserDefineCode; // 以回傳資料取代
      this.productIsBuy = this.productInfo.Product_IsBuy;
      if (this.productIsBuy) {
        switch (this.productInfo.Product_Type) {
          case 2:
            this.buybtnTxt = '前往購買';
            break;
          case 21:
            this.buybtnTxt = '直接購買';
            break;
          default:
            this.buybtnTxt = '加入購物車';
            break;
        }
      } else {
        this.buybtnTxt = '銷售一空';
      }

      // 更新購物車數量
      this.cartCount = data.Cart_Count;
      this.oauthService.cookiesSet({
        cart_count_Mobii: JSON.stringify(data.Cart_Count),
        page: location.href
      });

      // 預設選擇所有規格的第一個規格值
      for (const attr of this.attrList) {
        attr.List_AttributeValue.filter((item, index) => {
          if (index === 0) {
            this.cartAttrValueCode += item.AttributeValue_AttributeCode.toString() + ',';
            this.cartAttrValueName += item.AttributeValue_ShowName.toString() + ',';
            return false;
          }
        });
      }
      this.cartAttrValueCode = this.cartAttrValueCode.substring(0, this.cartAttrValueCode.length - 1);
      this.cartAttrValueName = this.cartAttrValueName.substring(0, this.cartAttrValueName.length - 1);

      this.title.setTitle(this.productInfo.Product_ExtName + '｜產品資訊 - Mobii!');
      this.meta.updateTag({ name: 'description', content: this.productInfo.Product_Depiction.replace(/<[^>]*>/g, '') });
      this.meta.updateTag({ content: this.productInfo.Product_ExtName + '｜產品資訊 - Mobii!', property: 'og:title' });
      this.meta.updateTag({ content: this.productInfo.Product_Depiction.replace(/<[^>]*>/g, ''), property: 'og:description' });
      this.textForShare = `嘿！我有好物要跟你分享喔！趕快進來看看吧！這是「${this.productInfo.Product_ExtName}」，快來跟我一起買東西吧！`;
      this.APPShareUrl = data.AppShareUrl;
    });
    // 若有登入則顯示我的收藏
    if (this.appService.loginState) {
      this.appService.showFavorites();
    }
    // APP從會員中心→我的收藏→商品詳細→購物車要顯示返回鍵（目前為購物車處理）
    this.appService.showBack = this.route.snapshot.queryParams.showBack === 'true';
  }

  /** 滑動至指定區域 */
  scrollTo(sectionId: number): void {
    this.currentSec = sectionId;
    // iOS不支援ScrollToOptions，document沒有smooth，因此使用套件
    const targetSec = (document.querySelector('#tag0' + sectionId) as HTMLElement);
    window.scroll({ top: targetSec.offsetTop - 50, left: 0, behavior: 'smooth' });
  }

  /** 滑動時對應區塊標籤 */
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const topSec1 = this.tag01.nativeElement.offsetTop;
    const topSec2 = this.tag02.nativeElement.offsetTop;
    const topSec3 = this.tag03.nativeElement.offsetTop;
    // 在畫面開始繪製後再判斷
    if (document.body.offsetHeight > 0) {
      if (window.pageYOffset + 100 > topSec3 || (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        this.currentSec = 3;
      } else if (window.pageYOffset + 100 > topSec2) {
        this.currentSec = 2;
      } else if (window.pageYOffset + 100 > topSec1) {
        this.currentSec = 1;
      } else {
        this.currentSec = 0;
      }
    }
  }

  /** 改變商品數（min = 1, max = 99）
   * @param action 0=減, 1=加
   */
  onSelectAmount(action: number) {
    if (action === 1) {
      if (this.prodAmount < 98) {
        this.prodAmount++;
      }
    } else {
      if (this.prodAmount > 1) {
        this.prodAmount--;
      }
    }
  }

  /** 阻擋輸入數量的行為 */
  preventInput(e: KeyboardEvent) {
    e.preventDefault();
  }

  /** 確認所選規格值 */
  onConfirmAttrValue() {
    const attrValueCodeList = [];
    const attrValueNameList = [];

    // 規格值編碼 & 名稱 array
    document.querySelectorAll('input[type=radio]:checked').forEach(radio => {
      attrValueCodeList.push(radio.id);
      attrValueNameList.push((radio as HTMLInputElement).value);
    });

    this.cartAttrValueCode = attrValueCodeList.toString();
    this.cartAttrValueName = attrValueNameList.toString();
  }

  /** 加入購物車 */
  onAddToCart() {
    if (this.productIsBuy) {
      if (this.productInfo.Product_Type === 21 && !this.appService.loginState) { // 電子票券: 先確認已登入
        this.appService.logoutModal();
      } else if (this.productInfo.Product_Type === 2) { // 外部商品直接外連到外部頁面
        window.open(this.productInfo.Product_URL);
      } else {  // 一般商品 & 電子票券(已登入) 走以下流程
        const request: Request_ECCart = {
          SelectMode: 1,
          Cart_Count: this.cartCount,
          SearchModel: {
            Cart_Code: this.cartCode
          },
          AFP_Cart: {
            Cart_ID: null,
            Cart_Code: this.cartCode,
            Cart_UserInfoCode: null,
            Cart_ECStoreCode: this.productInfo.Product_ECStoreCode,
            Cart_ECStoreName: this.vendorInfo.ECStore_ShowName,
            Cart_ProductCode: this.productInfo.Product_Code,
            Cart_AttributeValueCode: this.cartAttrValueCode,
            Cart_AttributeValueName: this.cartAttrValueName,
            Cart_UserDefineCode: this.productDirCode,
            Cart_UserDefineName: null,
            Cart_Quantity: this.prodAmount,
            Cart_Amount: null // 交易單價(後端回填)
          }
        };

        this.appService.toApi('EC', '1204', request).subscribe((data: Response_ECCart) => {
          // 先判斷1204是否回傳可購買(防進入商品頁期間，商品已被下架)
          if (data.Product_IsBuy) {
            switch (this.productInfo.Product_Type) {
              case 21: // 電子票券: 直接將購物車資訊帶到確認訂單頁
                const EcartList: CartStoreList[] = [];
                const storeInfo: CartStoreList = {
                  StoreCode: data.AFP_Cart.Cart_ECStoreCode,
                  StoreName: data.AFP_Cart.Cart_ECStoreName,
                  CheckedStatus: true,
                  EditMode: true,
                  ProductList: [
                    {
                      CartId: data.AFP_Cart.Cart_ID,
                      DirCode: data.AFP_Cart.Cart_UserDefineCode,
                      DirName: null,
                      ProductCode: data.AFP_Cart.Cart_ProductCode,
                      ProductName: null,
                      ProductAttrValues: data.AFP_Cart.Cart_AttributeValueName,
                      ProductQty: 1,
                      ProductPrice: null,
                      ProductImg: null,
                      CheckedStatus: true,
                      Cart_ProductState: null
                    }
                  ]
                };
                EcartList.push(storeInfo);
                this.router.navigate(['/Order/ETicketOrder'], {
                  state: {
                    data: { checkoutList: EcartList }
                  }
                });
                break;
              default: // 一般商品
                // 若沒有購物車碼，則取得後端產生的並設在cookie裡
                if (this.cartCode === 0) {
                  this.oauthService.cookiesSet({
                    cart_code: data.AFP_Cart.Cart_Code.toString(),
                    page: location.href
                  });
                  this.cartCode = Number(this.oauthService.cookiesGet('cart_code').c);
                }
                // 把購物車商品數設到 cookie
                this.oauthService.cookiesSet({
                  cart_count_Mobii: JSON.stringify(data.Cart_Count),
                  page: location.href
                });
                this.cartCount = data.Cart_Count;
                this.modal.show('message', { initialState: { success: true, message: '加入購物車成功!', showType: 1 } });
                break;
            }
          } else {
            this.buybtnTxt = '銷售一空';
            this.productIsBuy = data.Product_IsBuy;
            this.modal.show('message', { initialState: { success: true, message: `${this.productInfo.Product_ExtName}已下架，無法購買`, showType: 1, checkBtnMsg: `我知道了` } });
          }
        });
      }
    }
  }

  /** 前往賣場
   * @param fragment 1: 商家介紹(用routerLink即可), 2: 優惠券 3: 線上商城
   */
  onGoToStore(fragment: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { navNo: fragment, showBack: this.appService.showBack }
    };
    this.router.navigate(['/Explore/ExploreDetail', this.productInfo.Product_ECStoreCode], navigationExtras);
  }

}
