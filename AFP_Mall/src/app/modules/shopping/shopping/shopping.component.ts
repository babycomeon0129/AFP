import { Component, HostListener, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { AFP_ADImg, AFP_ChannelProduct, AFP_ChannelVoucher, AFP_Function, AFP_Product, Request_ECHome, Response_ECHome, waterFallOption } from '@app/_models';
import { NgxMasonryOptions } from 'ngx-masonry';
import { SwiperOptions } from 'swiper';

@Component({
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.scss']
})
export class ShoppingComponent implements OnInit {
  /** 瀑布流控制項目 */
  private waterFallOption: waterFallOption = {
    currentPage: 1,
    totalPage: 0,
    isLoad: false
  };
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
    slidesPerColumnFill: 'row',
    slidesPerGroup: 5,
    loop: true
  };

  /** 活動廣告(中間) swiper */
  public shoppingAd: SwiperOptions = {
    scrollbar: {
      el: '.shopping-banner .swiper-scrollbar',
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
    transitionDuration: '0s',
    gutter: 12
  };

  constructor(public appService: AppService, private oauthService: OauthService, public router: Router,
    public modal: ModalService, private meta: Meta, private title: Title) {
    this.title.setTitle('線上商城 - Mobii!');
    this.meta.updateTag({ name: 'description', content: '來 Mobii! 線上商城購物，產品多元多樣，美食、3C、母嬰、生活百貨、美妝⋯⋯琳瑯滿目，還有限時限量折扣優惠等你來搶。Mobii! 賣的就是跟別人要不一樣！' });
    this.meta.updateTag({ content: '線上商城 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '來 Mobii! 線上商城購物，產品多元多樣，美食、3C、母嬰、生活百貨、美妝⋯⋯琳瑯滿目，還有限時限量折扣優惠等你來搶。Mobii! 賣的就是跟別人要不一樣！', property: 'og:description' });

    this.cartCode = Number(this.oauthService.cookiesGet('cart_code').cookieVal);
    this.cartCount = Number(this.oauthService.cookiesGet('cart_count_Mobii').cookieVal);
  }

  ngOnInit() {
    this.appService.openBlock();
    this.readData(1);
  }

  /** 讀取資料
   * @param action 執行動作：1 進入此頁，2 在此頁登入．3 讀取分頁（近期熱門商品瀑布流）
   */
  readData(action: number) {
    const request: Request_ECHome = {
      // SelectMode 1:  讀取商城所有資料 2:只有熱門商品資料，用於熱門商品瀑布流
      SelectMode: action !== 3 ? 1 : 2,
      Cart_Count: this.cartCount,
      Model_BasePage: {
        Model_Page: this.waterFallOption.currentPage
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
          this.waterFallOption.totalPage = data.Model_BaseResponse.Model_TotalPage;
          this.voucherList = data.List_VoucherData;
          break;
        case 2:
          this.voucherList = data.List_VoucherData;
          break;
        case 3:
          for (const hotProduct of data.List_HotProduct) {
            this.hotProducts.push(hotProduct);
          }
          this.waterFallOption.isLoad = false;
          break;
      }
    });
  }

  /** 近期熱門商品瀑布流 */
  @HostListener('window: scroll', ['$event'])
  prodWaterfall(event: Event) {
    // 是否到底部
    const IS_BOTTOM = document.documentElement.scrollHeight - document.documentElement.scrollTop <= document.documentElement.clientHeight;
    if (IS_BOTTOM) {
      if (!this.waterFallOption.isLoad) {
        this.waterFallOption.currentPage++;
        if (this.waterFallOption.currentPage <= this.waterFallOption.totalPage) {
          this.waterFallOption.isLoad = true;
          this.appService.openBlock();
          this.readData(3);
        }
      }
    }
    // if ((Math.floor(window.scrollY + window.innerHeight) >= document.documentElement.offsetHeight -1 ) && this.currentPage < this.totalPage) {
    //   this.appService.openBlock();
    //   this.currentPage += 1;
    //   this.readData(3);
    // }
  }

}
