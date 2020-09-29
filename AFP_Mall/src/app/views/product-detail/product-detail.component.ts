import { environment } from 'src/environments/environment';
import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { AppService } from 'src/app/app.service';
import {
  Request_ECProductDetail, Response_ECProductDetail, AFP_Product, AFP_ECStore, AFP_Attribute, Request_ECCart,
  Response_ECCart, AFP_Voucher, AFP_ProductImg, CartStoreList } from '../../_models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ModalService } from 'src/app/service/modal.service';
import { SwiperOptions } from 'swiper';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['../../../dist/style/shopping-index.min.css']
})
export class ProductDetailComponent implements OnInit, AfterViewInit, AfterViewChecked {
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
  /** 分享至社群時顯示的文字 */
  public textForShare: string;
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

  constructor(public appService: AppService, private router: Router, private route: ActivatedRoute, public modal: ModalService,
              private cookieService: CookieService, private meta: Meta, private title: Title) {
    this.productCode = parseInt(this.route.snapshot.params.Product_Code, 10);
    this.productDirCode = parseInt(this.route.snapshot.params.ProductDir_Code, 10);
    this.cartCode = Number(this.cookieService.get('cart_code'));
  }

  ngOnInit() {
    // 讀取商品詳細
    const request: Request_ECProductDetail = {
      User_Code: sessionStorage.getItem('userCode'),
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

      // 更新購物車數量
      this.cartCount = data.Cart_Count;
      this.cookieService.set('cart_count_Mobii', data.Cart_Count.toString(), 90, '/', environment.cookieDomain, environment.cookieSecure);

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
      this.meta.updateTag({name : 'description', content: this.productInfo.Product_Depiction.replace(/<[^>]*>/g, '')});
      this.meta.updateTag({content: this.productInfo.Product_ExtName + '｜產品資訊 - Mobii!', property: 'og:title'});
      this.meta.updateTag({content: this.productInfo.Product_Depiction.replace(/<[^>]*>/g, ''), property: 'og:description'});
      this.textForShare = `嘿！我有好物要跟你分享喔！趕快進來看看吧！這是「${this.productInfo.Product_ExtName}」，快來跟我一起買東西吧！
      ${location.href}`;
    });
    // 若有登入則顯示我的收藏
    if (this.appService.loginState === true) {
      this.appService.showFavorites();
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

    // 規格值編碼array
    $('input[type=radio]:checked').each(function() {
      attrValueCodeList.push($(this).attr('id'));
    });
    // 規格值名稱array
    $('input[type=radio]:checked').each(function() {
      attrValueNameList.push($(this).val());
    });
    this.cartAttrValueCode = attrValueCodeList.toString();
    this.cartAttrValueName = attrValueNameList.toString();
  }

  /** 加入購物車 */
  onAddToCart() {
    const request: Request_ECCart = {
      User_Code: sessionStorage.getItem('userCode'),
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
      // 一般商品
      if (this.productInfo.Product_Type !== 21) {
        // 若沒有購物車碼，則取得後端產生的並設在cookie裡
        if (this.cartCode === 0) {
          this.cookieService.set('cart_code', data.AFP_Cart.Cart_Code.toString(), 90, '/', environment.cookieDomain,
          environment.cookieSecure);
          this.cartCode = Number(this.cookieService.get('cart_code'));
        }
        // 把購物車商品數設到 cookie
        this.cookieService.set('cart_count_Mobii', data.Cart_Count.toString(), 90, '/', environment.cookieDomain, environment.cookieSecure);
        this.cartCount = data.Cart_Count;
        this.modal.show('message', { initialState: { success: true, message: '加入購物車成功!', showType: 1 } });
      } else {
      // 電子票券: 直接將購物車資訊帶到確認訂單頁（需先確認已登入）
        if (!this.appService.loginState) {
          this.modal.openModal('login');
        } else {
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
                CheckedStatus: true
              }
            ]
          };
          EcartList.push(storeInfo);
          this.router.navigate(['/ETicketOrder'], {
            state: {
              data: { checkoutList: EcartList }
            }
          });
        }
      }
    });
  }

  /** 前往賣場
   * @param fragment 1: 商家介紹(用routerLink即可), 2: 優惠券 3: 線上商城
   */
  onGoToStore(fragment: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { navNo: fragment }
    };
    this.router.navigate(['/ExploreDetail/' + this.productInfo.Product_ECStoreCode], navigationExtras);
  }

  /** 滑動至指定區塊
   * @param section 指定區塊id
   */
  ScrollTo(section) {
    $('.tag-topbox').addClass('fixed-top container');
    $('.nav-tabs-box').addClass('tag-top');
    $('html,body').animate({ scrollTop: $('#' + section).offset().top - 50 }, 1000);
    $('.tablist-link').removeClass('active show');
    $('#tab-' + section).addClass('active show');
  }

  ngAfterViewInit() {
    // 關於商品標頭置頂 || 加入購物車置尾
    $(document).on('scroll', () => {
      if ($(window).scrollTop() < 700) {
        $('.tag-topbox').removeClass('fixed-top container');
        $('.nav-tabs-box').removeClass('tag-top');
        $('.onbuy').removeClass('fixed-bottom container shopping-cartfooter py-3 px-3');
      } else {
        $('.tag-topbox').addClass('fixed-top container');
        $('.nav-tabs-box').addClass('tag-top');
        $('.onbuy').addClass('fixed-bottom container shopping-cartfooter py-3 px-3');
      }
    });

    // scroll focus tablist-link
    const sectionIds = {};
    $('.tab-pane').each(function() {
      const $this = $(this);
      sectionIds[$this.attr('id')] = $this.offset().top;
    });

    let scrollt = 0;
    $(window).scroll(function(event) {
      if (scrollt === 0) {
        scrollt = 1;
        $('.tab-pane').each(function() {
          const $this = $(this);
          if (sectionIds[$this.attr('id')] !== $this.offset().top) {
            sectionIds[$this.attr('id')] = $this.offset().top - ($this.height() / 2);
          }
        });

        const scrolled = $(this).scrollTop();
        for (const key in sectionIds) {
          if (scrolled + 100 > sectionIds[key]) {
            $('#tab-' + key).addClass('active show');
            if (scrollt > 0) {
              $('.tablist-link').removeClass('active show');
              $('#tab-' + key).addClass('active show');
            }
          }
        }
        scrollt = 0;
      }
    });
  }

  ngAfterViewChecked() {
    // 商品詳細、運送須知、訂購須知內的圖片responsive
    $('figure').find('img').addClass('img-fluid');
  }

}
