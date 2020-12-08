import { Component, OnInit, AfterViewInit, DoCheck, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { Response_ECHome, AFP_ADImg, AFP_Function, AFP_ChannelProduct, AFP_Product, AFP_ChannelVoucher,
        Request_ECHome } from '../../../_models';
import { SwiperOptions } from 'swiper';
import { NgxMasonryOptions } from 'ngx-masonry';
import { CookieService } from 'ngx-cookie-service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  templateUrl: './shopping.component.html',
  styleUrls: ['../../../../dist/style/shopping-index.min.css']
})
export class ShoppingComponent implements OnInit, AfterViewInit, DoCheck {
  public userName: string;
  /** 目前頁數 */
  public currentPage = 1;
  /** 總頁數 */
  public totalPage: number;
  /** 置頂廣告 */
  public adImgTop: AFP_ADImg[];
  /** 活動廣告（中間） */
  public adImgActivity: AFP_ADImg[];
  /** 優惠券列表 */
  public voucherList: AFP_ChannelVoucher[] = [];
  /** 頻道及商品 */
  public channelProducts: AFP_ChannelProduct[];
  /** 近期熱門商品 */
  public hotProducts: AFP_Product[];
  /** 使用者服務 */
  public functions: AFP_Function[];
  /** 購物車編碼 */
  public cartCode: number;
  /** 購物車商品數 */
  public cartCount: number;
  /** 變化追蹤(登入狀態) */
  private serviceDiffer: KeyValueDiffer<string, any>;

  /** 置頂廣告 swiper */
  public shoppingAdTop: SwiperOptions = {
    slidesPerView: 1,
    autoplay: {
        delay: 3000,
    }
  };

  /** 目錄 swiper */
  public shoppingIcon: SwiperOptions = {
    spaceBetween: 0,
    slidesPerView: 5,
    slidesPerColumn: 2,
    slidesPerColumnFill : 'row',
    slidesPerGroup: 5,
    loop: true
  };

  /** 活動廣告(中間) swiper */
  public shoppingAd: SwiperOptions = {
    scrollbar: {
      el: '.shopping-ad .swiper-scrollbar',
      hide: true,
    }
  };

  /** 目錄及商品swiper (熱銷商品、火熱上架) */
  public shoppingProd: SwiperOptions = {
    slidesPerView: 2.5,
    spaceBetween: 10,
    breakpoints: {
      480: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
    loop: false
  };

  /** 分頁瀑布流效果 */
  public masonry: NgxMasonryOptions = {
    itemSelector: '.products-item',
    gutter: 12
  };

  constructor(public appService: AppService, public modal: ModalService, private cookieService: CookieService,
              private differs: KeyValueDiffers, private meta: Meta, private title: Title) {
    this.serviceDiffer = this.differs.find({}).create();
    // tslint:disable: max-line-length
    this.title.setTitle('線上商城 - Mobii!');
    this.meta.updateTag({name : 'description', content: '來 Mobii! 線上商城購物，產品多元多樣，美食、3C、母嬰、生活百貨、美妝⋯⋯琳瑯滿目，還有限時限量折扣優惠等你來搶。Mobii! 賣的就是跟別人要不一樣！'});
    this.meta.updateTag({content: '線上商城 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '來 Mobii! 線上商城購物，產品多元多樣，美食、3C、母嬰、生活百貨、美妝⋯⋯琳瑯滿目，還有限時限量折扣優惠等你來搶。Mobii! 賣的就是跟別人要不一樣！', property: 'og:description'});

    this.cartCode = Number(this.cookieService.get('cart_code'));
    this.cartCount = Number(this.cookieService.get('cart_count_Mobii'));
  }

  ngOnInit() {
    this.appService.openBlock();
    this.readData(1);
    // 若有登入則顯示名字
    if (this.appService.loginState) {
      this.userName = sessionStorage.getItem('userName');
    }
  }

  /** 讀取資料
   * @param action 執行動作：1 進入此頁，2 在此頁登入．3 讀取分頁（近期熱門商品瀑布流）
   */
  readData(action: number) {
    const request: Request_ECHome = {
      User_Code: sessionStorage.getItem('userCode'),
      Cart_Count: this.cartCount,
      Model_BasePage: {
        Model_Page: this.currentPage
      },
      SearchModel: {
        IndexVoucher_Code: 1111114, // 此區塊專用頻道，只會有一個目錄，目錄下只有２張優惠券
        IndexChannel_Code: 31000001,
        Cart_Code: this.cartCode
      }
    };

    this.appService.toApi('EC', '1201', request).subscribe((data: Response_ECHome) => {
      switch (action) {
        case 1:
          this.adImgTop = data.ADImg_Top;
          this.adImgActivity = data.ADImg_Activity;
          this.channelProducts = data.List_ProductData;
          this.hotProducts = data.List_HotProduct;
          this.functions = data.List_Function;
          this.totalPage = data.Model_BaseResponse.Model_TotalPage;
          this.voucherList = data.List_VoucherData;
          break;
        case 2:
          this.voucherList = data.List_VoucherData;
          break;
        case 3:
          for (const hotProduct of data.List_HotProduct) {
            this.hotProducts.push(hotProduct);
          }
          break;
      }
    });
  }

  ngDoCheck(): void {
    const change = this.serviceDiffer.diff(this.appService);
    if (change) {
      change.forEachChangedItem(item => {
        if (item.key === 'loginState' && item.currentValue === true) {
          this.userName = sessionStorage.getItem('userName');

          // 更新優惠券顯示資料
          this.appService.openBlock();
          this.readData(2);

        }
      });
    }
  }

  ngAfterViewInit() {
    // 讀取分頁資料(瀑布流)
    $(window).on('scroll', () => {
      if ($(window).scrollTop() + $(window).height() === $(document).height() && this.currentPage < this.totalPage) {
        this.currentPage += 1;
        this.readData(3);
      }
    });
  }

}
