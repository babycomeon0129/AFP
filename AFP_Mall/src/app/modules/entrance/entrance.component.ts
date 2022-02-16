
import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { layerAnimation } from '@app/animations';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { ModalService } from '@app/shared/modal/modal.service';
import {
  AFP_ADImg, AFP_ChannelProduct, AFP_ChannelVoucher, AFP_Function, AFP_Product, AFP_UserFavourite,
  Model_AreaJsonFile, Model_ShareData, Model_TravelJsonFile, Request_ECHome, Request_Home, Response_ECHome, Response_Home
} from '@app/_models';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxMasonryOptions } from 'ngx-masonry';
import { SwiperOptions } from 'swiper';


@Component({
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.scss', '../shopping/shopping/shopping.scss', '../travel/travel.scss'],
  animations: [layerAnimation]
})
export class EntranceComponent implements OnInit {

  /** JustKa連結 */
  public JustKaUrl: string;
  /** 隱私權提示 (0顯示，1關閉) */
  public cookieShow: string;
  /** 進場廣告swiper */
  public adIndexOption = {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    loopPreventsSlide: true,
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 30
      }
    },
    pagination: {
      el: '.swiper-pagination',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    }
  };

  /** 個人捷徑 swiper */
  public boxIcon: SwiperOptions = {
    slidesPerView: 5,
    breakpoints: {
      768: {
        slidesPerView: 7,
      },
      1024: {
        slidesPerView: 9
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    loop: false
  };

  /** 去哪玩連結 swiper（中間四格） */
  public boxGoWhere: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 15,
    freeMode: true,
    breakpoints: {
      768: {
        slidesPerView: 4,
      }
    },
  };

  /** 中間大廣告 swiper */
  public boxAD: SwiperOptions = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    slidesPerView: 1.3,
    spaceBetween: 10,
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 0
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 1,
        spaceBetween: 0
      },
      // when window width is >= 640px
      768: {
        slidesPerView: 1.3,
        spaceBetween: 20
      }
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
  };

  /** 特賣商品導覽tab swiper */
  public prodTabs: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 10,
    breakpoints: {
      768: {
        slidesPerView: 8,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 8,
        spaceBetween: 20,
      }
    }
  };

  /** 現領優惠券、主打店家、線上點餐推薦、本月旅遊主打 tab swiper */
  public boxTabs: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 10,
    breakpoints: {
      768: {
        slidesPerView: 5,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 8,
        spaceBetween: 20,
      }
    }
  };

  /** 現領優惠券, 特賣商品內容內容 swiper */
  public boxOffer: SwiperOptions = {
    slidesPerView: 2.5,
    spaceBetween: 10,
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      }
    },
    loop: false,
    observer: true,
    observeParents: true,
    preloadImages: true,
    updateOnImagesReady: true
  };

  /** 主打店家、本月旅遊主打內容 swiper */
  public boxTFeature: SwiperOptions = {
    slidesPerView: 1.7,
    spaceBetween: 10,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      }
    },
    loop: false,
    observer: true,
    observeParents: true,
    preloadImages: true,
    updateOnImagesReady: true
  };

  /** 分頁瀑布流效果 */
  public masonry: NgxMasonryOptions = {
    itemSelector: '.products-item',
    transitionDuration: '0s',
    gutter: 12
  };

  /** 首頁進場廣告 */
  public adIndex: AFP_ADImg[] = [];
  /** 首頁進場廣告開始時間確認 */
  public adIndexTime = false;
  /** 置頂廣告列表 */
  public adTop: AFP_ADImg[] = [];
  /** 中間四格廣告(去哪玩連結) */
  public adMid4: AFP_ADImg[] = [];
  /** 中間大廣告 */
  public adMid: AFP_ADImg[] = [];
  /** 主打店家 */
  public hitArea: Model_AreaJsonFile[] = [];
  /** 線上點餐推薦 */
  public deliveryArea: Model_AreaJsonFile[] = [];
  /** 本月旅遊主打 */
  public hitTravel: Model_TravelJsonFile[] = [];
  /** 熱門優惠券 */
  public nowVoucher: AFP_ChannelVoucher[] = [];
  /** 近期熱門商品 */
  public hotProducts: AFP_Product[];
  /** 瀑布流控制項目 */
  private waterFallOption: waterFallOption = {
    currentPage: 1,
    totalPage: 0,
    isLoad: false
  };
  /** 目前頁數熱門商品瀑布流頁數 */
  // public currentPage = 1;
  // /** 目前頁數熱門商品瀑布流總頁數 */
  // public totalPage: number;

  /** 使用者服務 */
  public ftTop: AFP_Function[] = [];
  /** 使用者服務 - 所有服務清單 */
  public serviceList: AFP_NewFunction[] = [];
  /** 使用者服務 - 首頁 icon 顯示數量 */
  public Icon_Quantity: number;
  /** 使用者服務 - 啟用 icon 總數 */
  public Total_Icon: number;

  /** 特賣商品 */
  public popProducts: AFP_ChannelProduct[] = [];
  /** 使用者擁有點數 */
  public userPoint: number;
  /** 使用者擁有優惠券數量 */
  public userVoucherCount: number;
  /** 關閉下載APP動畫控制 */
  public animationMoveUpOut = false;
  /** 當前所選本月旅遊主打頁籤索引 */
  public activeTravelIndex = 0;
  /** 同頁滑動切換 0: 原頁 1: 使用者服務 */
  public layerTrig = 0;
  /** 判斷 justKa客服modal 顯示與否 */
  public show = false;
  /** 關閉 justKa 對話框 */
  public closeMsg = false;

  constructor(public appService: AppService, public bsModalRef: BsModalRef, public modal: ModalService,
    public router: Router, private meta: Meta, private title: Title,
    public route: ActivatedRoute, private renderer2: Renderer2, private oauthService: OauthService) {
    this.title.setTitle('Mobii!｜綠色城市優惠平台');
    this.meta.updateTag({ name: 'description', content: '使用 Mobii! APP，讓你的移動總是驚喜。乘車、購物、美食、景點、旅行資訊全都包，使用就享點數回饋，每日登入再領 M Points，會員再享獨家彩蛋大禮包。先下載 Mobii APP 看看裡面有什麼好玩的吧？' });
    this.meta.updateTag({ content: 'Mobii!｜綠色城市優惠平台', property: 'og:title' });
    this.meta.updateTag({ content: '使用 Mobii! APP，讓你的移動總是驚喜。乘車、購物、美食、景點、旅行資訊全都包，使用就享點數回饋，每日登入再領 M Points，會員再享獨家彩蛋大禮包。先下載 Mobii APP 看看裡面有什麼好玩的吧？', property: 'og:description' });
  }

  ngOnInit() {
    /** 下方隱私權顯示與否(0顯示，1不顯示) */
    this.cookieShow = (this.oauthService.cookiesGet('show').cookieVal === '') ? '0' : '1';
    // 從route resolver取得首頁資料
    // this.route.data.subscribe((data: { homeData: Response_Home }) => {
    //   // 接資料
    // });
    this.readUp();
    this.getHomeservice();
    this.readDown();
    this.readhotProducts(1);
    // 若有登入則顯示我的收藏（MOB-3038首頁改版，因我的旅遊暫時隱藏，故此處也暫隱藏）
    // if (this.appService.loginState) {
    //   this.appService.showFavorites();
    // }
  }

  /** 下方隱私權顯示與否(0顯示，1不顯示) */
  cookieShowClick() {
    this.cookieShow = '1';
    this.oauthService.cookiesSet({
      show: '1',
      page: location.href
    });
  }
  /** 讀取首頁上方資料（皆為廣告及會員資料，使用者服務除外） */
  readUp(): void {
    const request: Request_Home = {
      User_Code: this.oauthService.cookiesGet('userCode').sessionVal
    };
    this.appService.openBlock();
    this.appService.toApi('Home', '1021', request).subscribe((data: Response_Home) => {
      // 推播小紅點
      this.appService.alertStatus = data.AlertStatus;
      // JustKa連結
      this.JustKaUrl = data.JustKaUrl;
      // 會員資訊
      this.userPoint = data.TotalPoint;
      if (data.UserName !== '') {
        this.oauthService.cookiesSet({
          userName: data.UserName,
          page: location.href
        });
        this.appService.userName = data.UserName;
      }
      this.userVoucherCount = data.VoucherCount;
      // 廣告
      this.adTop = data.ADImg_Top;
      this.adMid4 = data.ADImg_Activity;
      this.adMid = data.ADImg_Theme;
      this.adIndex = data.ADImg_Approach;
      // 進場廣告只有一張廣告圖時不輪播
      if (this.adIndex.length === 1) {
        this.adIndexOption.loop = false;
      }
      this.adIndexChenck();
    });
  }

  /** 讀取首頁下方資料（中間大廣告以下各區塊） */
  readDown(): void {
    const request: Request_Home = {
      User_Code: this.oauthService.cookiesGet('userCode').sessionVal
    };
    // 不使用loading spinner 讓進入首頁可先快速瀏覽上方
    this.appService.toApi('Home', '1022', request).subscribe((data: Response_Home) => {
      // hitArea、hitTravel、popProducts、deliveryArea 因MOB-3038首頁改版，暫先隱藏，故不加上SearchModel請求資料
      this.hitArea = data.List_AreaData;
      this.hitTravel = data.List_TravelData;
      this.popProducts = data.List_ProductData;
      this.deliveryArea = data.List_DeliveryData;
      this.nowVoucher = data.List_Voucher;
    });
  }

  /** 讀取資料
   * @param action 執行動作：1 進入此頁，2 讀取分頁（近期熱門商品瀑布流）
   */
  readhotProducts(action: number): void {
    const request: Request_ECHome = {
      // SelectMode 1:  讀取商城所有資料 2:只有熱門商品資料，用於熱門商品瀑布流
      SelectMode: 2,
      Cart_Count: 0,
      Model_BasePage: {
        Model_Page: this.waterFallOption.currentPage
      },
      SearchModel: {
        IndexChannel_Code: 31000001,
        Cart_Code: null
      }
    };

    this.appService.toApi('EC', '1201', request).subscribe((data: Response_ECHome) => {
      switch (action) {
        case 1:
          this.hotProducts = data.List_HotProduct;
          this.waterFallOption.totalPage = data.Model_BaseResponse.Model_TotalPage;
          break;
        case 2:
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
  prodWaterfall(event: Event): void {
    // 是否到底部
    const IS_BOTTOM = document.documentElement.scrollHeight - document.documentElement.scrollTop <= document.documentElement.clientHeight;
    if(IS_BOTTOM) {
      if (!this.waterFallOption.isLoad) {
        this.waterFallOption.currentPage++;
        if (this.waterFallOption.currentPage <= this.waterFallOption.totalPage) {
          this.waterFallOption.isLoad = true;
          this.appService.openBlock();
          this.readhotProducts(2);
        }
      }
    }
    // if ((Math.floor(window.scrollY + window.innerHeight) >= document.documentElement.offsetHeight - 1)
    //   && this.currentPage < this.totalPage) {
    //   this.appService.openBlock();
    //   this.currentPage++;
    //   this.readhotProducts(2);
    // }
  }


  /** 判斷首頁進場廣告開啟 */
  adIndexChenck(): void {
    const adTime = this.oauthService.cookiesGet('adTime').cookieVal || null;
    const adTimeString = adTime;
    const nowTime = new Date().getFullYear().toString() + new Date().getMonth().toString() + new Date().getDate().toString();
    if (adTimeString !== nowTime) {
      this.oauthService.cookiesSet({
        adTime: nowTime,
        page: location.href
      });
      this.adIndexTime = true;
      // 出現首頁廣告版面才禁止背景滑動
      if (this.adIndex.length > 0 && this.appService.adIndexOpen) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      this.adIndexTime = false;
      document.body.removeAttribute('style');
    }
  }

  /** 首頁進場廣告關閉 */
  adIndexClose(): void {
    document.body.removeAttribute('style');
    this.appService.adIndexOpen = false;
  }

  /** 搜尋Bar，搜尋完畢後前往「找優惠」
   * @param searchText 搜尋文字
   */
  searchOffers(searchText: string): void {
    this.router.navigate(['/Voucher/Offers'], { queryParams: { search: searchText } });
  }


  /** 首頁使用者服務 */
  getHomeservice(): void {
    this.appService.openBlock();
    const request: Request_AFPUserService = {
      // SelectMode 1 : 首頁 10 : 使用者服務
      SelectMode: 1
    };

    this.appService.toApi('Home', '1110', request).subscribe((data: Response_AFPUserService) => {
      this.ftTop = data.List_NewFunction[0].Model_Function;
      this.serviceList = data.List_NewFunction.filter((item, index) => index > 0);
      this.Icon_Quantity = data.Icon_Quantity;
      this.Total_Icon = data.Total_Icon;


      //  網頁不顯示app呼叫
      if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        this.ftTop.every((value, index) => {
          if (value.Function_URLTarget === '_app') {
            this.ftTop.splice(index, 1);
            return false;
          }
          return true;
        });
      }
    });
  }

  /** 取得「現領優惠券」、「特賣商品」頁籤資訊（點擊時）
   * @param mode SelectMode: 1 特賣商品 2 現領優惠券 3 主打店家 4 外送店家 5 旅遊主打
   * @param index 索引
   * @param menuCode 目錄編碼
   * @param channelCode 頻道編號
   */
  readSheet(mode: number, index: number, menuCode: number, channelCode?: number): void {
    // if mode === 5, get the height of the current pane and set it to the wrap (to avoid jumping caused by height difference)
    if (mode === 5) {
      const travelPane = document.getElementsByClassName('hitTravel tab-pane');
      this.renderer2.setStyle(document.getElementById('tabContentWrap'), 'minHeight',
        travelPane[this.activeTravelIndex].scrollHeight + 'px');
    }
    // update the index
    this.activeTravelIndex = index;

    const request: Request_OtherInfo = {
      User_Code: this.oauthService.cookiesGet('userCode').sessionVal,
      SelectMode: mode,
      SearchModel: {
        UserDefineCode: menuCode,
        IndexChannel_Code: channelCode
      }
    };

    this.appService.toApi('Home', '1012', request).subscribe((data: Response_Home) => {
      switch (mode) {
        case 1:
          this.popProducts[index].ProductData = data.List_ProductData[0].ProductData;
          break;
        case 2:
          this.nowVoucher[index].VoucherData = data.List_Voucher[0].VoucherData;
          break;
        case 3:
          this.hitArea[index].ECStoreData = data.List_AreaData[0].ECStoreData;
          break;
        case 4:
          this.deliveryArea[index].ECStoreData = data.List_DeliveryData[0].ECStoreData;
          break;
        case 5:
          this.hitTravel[index].TravelData = data.List_TravelData[0].TravelData;
          break;
      }
    });
  }


  /** 開啟服務連結 */
  FunctionLink(Link: AFP_Function, editFunction: boolean): void {
    if (!editFunction) {
      if (Link.Function_IsActive === 1) {
        if (Link.Function_URLTarget === '_app') {
          this.modal.confirm({ initialState: { message: '請問是否要開啟Mobii App?' } }).subscribe(res => {
            if (res) {
              location.href = Link.Function_URL;
              setTimeout(() => { this.router.navigate(['/ForApp/AppDownload']); }, 25);
            }
          });
        } else {
          if (this.appService.isApp === 1) {
            this.router.navigate([Link.Function_URL], { queryParams: { isApp: this.appService.isApp } });
          } else {
            // this.router.navigate([Link.Function_URL]);
            window.open(Link.Function_URL, Link.Function_URLTarget);
          }
        }
      }
    }
  }

  /** (中間四格)廣告route */
  adRoute(url: string, urlTarget: string): void {
    if (url.indexOf('http') !== -1) {
      // 外部連結 || 指定到內部某頁的某分頁
      window.open(url, urlTarget);
    } else {
      // 內部連結
      this.router.navigate([url]);
    }
  }

  /** 立即下載APP */
  toDownloadAPP(): void {
    if (this.appService.isApp === 1) {
      location.href = 'mobii://';
    }
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        // 未成功開啟APP則前往AppDownload被引導至平台下載
        this.router.navigate(['/ForApp/AppDownload']);
      }
    }, 25);
  }

  /** 關閉下載APP */
  toCloseDownloadAPP(): void {
    setTimeout(() => {
      this.appService.showAPPHint = false;
    }, 500);
    this.animationMoveUpOut = true;
  }

  /** justKa點擊事件（justKa modal 顯示與否） */
  toggle(url: string): void {
    if (!this.appService.loginState) {
      this.appService.logoutModal();
    } else {
      this.show = !this.show;
      if (this.show) {
        this.modal.show('justka',
          {
            initialState:
            {
              justkaUrl: url + '&J_idToken=' + this.oauthService.cookiesGet('idToken').cookieVal
            }
          },
          this.bsModalRef);
      } else {
        this.modal.closeModal1();
        document.querySelector('body').classList.remove('modal-open');
      }
    }
  }

}

/** 使用者服務 ResponseModel */
class Response_AFPUserService extends Model_ShareData {
  /** 使用者服務 - 舊版 */
  Model_Function: AFP_Function[];
  /** 使用者收藏 - 舊版 */
  Model_UserFunction?: AFP_Function[];
  /** 使用者服務 - 新版
   *
   * 0: 系統服務
   * 1: 我的服務
   * 2+: 後台建置
   */
  List_NewFunction?: AFP_NewFunction[];
  /** 使用者服務 - 首頁 icon 顯示數量 */
  Icon_Quantity?: number;
  /** 使用者服務 - 啟用 icon 總數 */
  Total_Icon?: number;
}

/** 使用者服務 RequestModel */
class Request_AFPUserService extends Model_ShareData {
}

/** 使用者服務管理-新版 */
class AFP_NewFunction {
  /** 類別名稱 */
  CategaryName: string;
  /** 使用者服務 - 新版
   *
   * 0: 系統服務
   * 1: 我的服務
   * 2+: 後台建置
   */
  CategaryCode: number;
  /** 使用者服務 */
  Model_Function: AFP_Function[];
}

/** 使用者服務 RequestModel */
class Request_AFPUpdateUserService extends Model_ShareData {
  /** 使用者收藏 - 舊版 */
  Model_UserFavourite: AFP_UserFavourite[];
  /** 使用者收藏 - 新版 */
  Model_UserFunction: number[];
}

/** 使用者服務 ResponseModel */
class Response_AFPUpdateUserService extends Model_ShareData {

}

/** 抓取首頁其他資訊 */
interface Request_OtherInfo extends Model_ShareData {
  /** 搜尋Model */
  SearchModel: Search_OtherInfo;
}

/** 抓取首頁其他資訊的搜尋Model */
interface Search_OtherInfo {
  /** 目錄編碼 */
  UserDefineCode: number;
  /** 商品頻道編號 */
  IndexChannel_Code?: number;
}

/** 瀑布流option */
interface waterFallOption {
  /** 目前頁數 */
  currentPage: number;
  /** 總頁數 */
  totalPage: number;
  /** 瀑布流是否正在call api */
  isLoad: boolean;
}
