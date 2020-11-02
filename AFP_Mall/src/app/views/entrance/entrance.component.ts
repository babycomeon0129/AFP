import { Component, OnInit, AfterViewInit, ViewChild, DoCheck, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ModalService } from '../../service/modal.service';
import {
  Response_Home, AFP_ADImg, Model_AreaJsonFile, AFP_Function, Model_TravelJsonFile,
  Model_ShareData, Model_MemberProfile, AFP_UserFavourite, Request_Home, AFP_ChannelProduct, AFP_ChannelVoucher,
  Request_OtherInfo } from '../../_models';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'ngx-useful-swiper';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { SortablejsOptions } from 'ngx-sortablejs';
import { isNgTemplate } from '@angular/compiler';

declare var $: any;

@Component({
  templateUrl: './entrance.component.html',
  styleUrls: ['../../../dist/style/home.min.css', '../../../dist/style/travel-index.min.css']
})
export class EntranceComponent implements OnInit, AfterViewInit, DoCheck {
  public userProfile: Model_MemberProfile = new Model_MemberProfile();
  @ViewChild('kvSwiper', { static: false }) kvSwiper: SwiperComponent;

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
    freeMode: true
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

  /** 本月旅遊主打、本月周邊主打 tab swiper */
  public boxTabs: SwiperOptions = {
    slidesPerView: 5,
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

  /** 本月旅遊主打內容 swiper */
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

  /** 特賣商品內容 swiper */
  public onsaleProd: SwiperOptions = {
    observer: true,
    observeParents: true,
    slidesPerView: 3,
    spaceBetween: 10,
    loop: false,
    // updateOnWindowResize: false,
    preloadImages: true,
    updateOnImagesReady: true
  };

  /** 置頂廣告列表 */
  public adTop: AFP_ADImg[] = [];
  /** 中間四格廣告(去哪玩連結) */
  public adMid4: AFP_ADImg[] = [];
  /** 中間大廣告 */
  public adMid: AFP_ADImg[] = [];
  /** 主打店家 */
  public hitArea: Model_AreaJsonFile[] = [];
  /** 本月外送主打 */
  public deliveryArea: Model_AreaJsonFile[] = [];
  /** 本月旅遊主打 */
  public hitTravel: Model_TravelJsonFile[] = [];
  /** 現領優惠券 */
  public nowVoucher: AFP_ChannelVoucher[] = [];
  /** 使用者服務-桌面版 */
  public ft: AFP_Function[] = [];
  /** 使用者服務-手機版上排 */
  public ftTop: AFP_Function[] = [];
  /** 使用者服務-手機版下排(原始) */
  public ftBottom_org: AFP_Function[] = [];
  /** 使用者服務-手機版下排 */
  public ftBottom: AFP_Function[] = [];
  /** 我的服務 */
  public ftUserBottom: AFP_Function[] = [];
  /** 我的服務編輯狀態 */
  public editFunction = false;
  /** 更多-我的服務清單 */
  public serviceList: AFP_NewFunction[] = [];
  /** 我的服務-數量提醒最少4個 */
  public noticeFour = false;
  /** 我的服務-數量提醒最多9個 */
  public noticeNine = false;
  /** 使用者暱稱 */
  public userName: string;
  /** 特賣商品 */
  public popProducts: AFP_ChannelProduct[] = [];
  /** 使用者擁有點數 */
  public userPoint: number;
  /** 使用者擁有優惠券數量 */
  public userVoucherCount: number;
  /** 我的服務: 判斷是否被拖曳 */
  public isMove = false;
  /** 我的服務:拖曳功能options */
  // tslint:disable-next-line: deprecation
  public options: SortablejsOptions = {
    disabled: true,
    handle: '#myService',
    draggable: '.mysvc',
    group: '.mysvc',
    onStart: (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
    },
    onMove: (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.isMove = true;
    },
    onEnd: (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      const code: number = parseInt(evt.item.dataset.code, 10);
      const cat: number = parseInt(typeof evt.item.dataset.cat, 10);
      const act: boolean = evt.item.dataset.cat === '1' ? true : false;
      this.serviceClick(code, cat, act);
      this.isMove = false;
    }
  };



  /** 變化追蹤（登入狀態） */
  private serviceDiffer: KeyValueDiffer<string, any>;

  constructor(public appService: AppService, public modal: ModalService, private router: Router, private differs: KeyValueDiffers,
              private meta: Meta, private title: Title) {
    this.serviceDiffer = this.differs.find({}).create();
    // tslint:disable: max-line-length
    this.title.setTitle('Mobii!｜城市生活服務平台');
    this.meta.updateTag({ name: 'description', content: '使用 Mobii! APP，讓你的移動總是驚喜。乘車、購物、美食、景點、旅行資訊全都包，使用就享點數回饋，每日登入再領 M Points，會員再享獨家彩蛋大禮包。先下載 Mobii APP 看看裡面有什麼好玩的吧？' });
    this.meta.updateTag({ content: 'Mobii!｜城市生活服務平台', property: 'og:title' });
    this.meta.updateTag({ content: '使用 Mobii! APP，讓你的移動總是驚喜。乘車、購物、美食、景點、旅行資訊全都包，使用就享點數回饋，每日登入再領 M Points，會員再享獨家彩蛋大禮包。先下載 Mobii APP 看看裡面有什麼好玩的吧？', property: 'og:description' });
  }

  ngOnInit() {
    this.readHome(1);

    // 若有登入則顯示名字、M Points及優惠券資訊（手機版）、我的收藏
    if (this.appService.loginState) {
      this.userName = sessionStorage.getItem('userName');
      this.appService.showFavorites();
    }
  }

  /** 讀取首頁資料
   * @param mode 讀取時機 1: 進入此頁 2: 在此頁登入時
   */
  readHome(mode: number) {
    const request: Request_Home = {
      User_Code: sessionStorage.getItem('userCode'),
      SearchModel: {
        IndexArea_Code: 100001,
        IndexTravel_Code: 21001,
        UserInfo_Code: null,
        IndexChannel_Code: 10000001,
        IndexDelivery_Code: 300001
      }
    };
    this.appService.openBlock();
    this.appService.toApi('Home', '1011', request).subscribe((data: Response_Home) => {
      switch (mode) {
        case 1:
          this.adTop = data.ADImg_Top;
          this.adMid4 = data.ADImg_Activity;
          this.adMid = data.ADImg_Theme;
          this.hitArea = data.List_AreaData;
          this.hitTravel = data.List_TravelData;
          this.popProducts = data.List_ProductData;
          this.userPoint = data.TotalPoint;
          this.userVoucherCount = data.VoucherCount;
          this.deliveryArea = data.List_DeliveryData;
          this.nowVoucher = data.List_Voucher;
          break;
        case 2:
          this.userName = sessionStorage.getItem('userName');
          this.userPoint = data.TotalPoint;
          this.userVoucherCount = data.VoucherCount;
          break;
      }
      this.getHomeservice();
    });
  }

  /** 我的服務編輯模式開啟 */
  editOpen(): void {
    this.editFunction = true;
    this.options = {disabled: false};
  }

   /** 我的服務編輯模式關閉 */
   editClose(): void {
    this.editFunction = false;
    this.options = {disabled: true};
    this.ftBottom = this.ftBottom_org.concat();
   }

  /** 首頁我的服務 */
  getHomeservice(): void {
    const request: Request_AFPUserService = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 1
    };

    this.appService.toApi('Home', '1110', request).subscribe((data: Response_AFPUserService) => {
      this.ftTop = data.List_NewFunction[0].Model_Function;
      this.ftBottom_org = data.List_NewFunction[1].Model_Function;
      this.ftBottom = this.ftBottom_org.concat();
      this.ft = this.ftTop.concat(this.ftBottom);
      this.serviceList = data.List_NewFunction.filter((item, index) => index > 1);
      // 根據我的服務清單，修改下面更多服務的class狀態
      const select = this.ftBottom.map(item => item.Function_Code);
      this.serviceList.forEach(item => {
        item.Model_Function.forEach(icon => {
          if (select.findIndex(i => icon.Function_Code === i) === -1) {
            icon.isAdd = true;
          }
        });
      });

      //  網頁不顯示app呼叫
      if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        this.ft.every((value, index) => {
          if (value.Function_URLTarget === '_app') {
            this.ft.splice(index, 1);
            return false;
          }
          return true;
        });
      }
    });
  }

  /** 更多服務按鈕增減
   * @param code function code
   * @param cat  分類編碼
   * @param action icon是否有效(如果純上架但無效，action = 0)
   */
  serviceClick(code: number, cat: number, action: boolean) {
    if (this.editFunction && action) {
      this.noticeNine = this.ftBottom.length === 9 ? true : false;
      this.noticeFour = this.ftBottom.length === 4 ? true : false;
      // 判斷被點擊的ICON是否已經在我的服務內
      const result = this.ftBottom.findIndex(item => item.Function_Code === code);
      if (result > -1) {
        // 已經在我的服務內，就將這個ICON移出我的服務
        if (this.ftBottom.length > 4 && !this.isMove) {
          this.ftBottom.splice(result, 1);
          // 根據我的服務清單，修改下面更多服務的class狀態
          this.serviceList.filter(item => item.CategaryCode === cat)[0].Model_Function.forEach( icon => {
            if ( icon.Function_Code === code) {
              icon.isAdd = true;
            }
          });
          this.noticeNine = false;
        }
      } else {
        // 不在我的服務內，就在我的服務增加這個ICON
        if (this.ftBottom.length < 9) {
          const add = this.serviceList.filter(item => item.CategaryCode === cat)
            .map(item => item.Model_Function)[0]
            .filter(item => item.Function_Code === code)[0];
          this.ftBottom.push(add);
          // 根據我的服務清單，修改下面更多服務的class狀態
          this.serviceList.filter(item => item.CategaryCode === cat)[0].Model_Function.forEach( icon => {
            if ( icon.Function_Code === code) {
              icon.isAdd = false;
            }
          });
          this.noticeFour = false;
        }
      }
    }
  }

  /** 更新我的服務 */
  updateUserService(): void {
    this.editFunction = false;

    const arr = document.querySelectorAll('.mysvc');
    // 將我的服務的function code 陣列result傳給後端
   // const result = this.ftBottom.map( item => item.Function_Code);
    const result = [];
    arr.forEach((code: HTMLElement) => result.push(parseInt(code.dataset.code, 10)));
    const request: Request_AFPUpdateUserService = {
      User_Code: sessionStorage.getItem('userCode'),
      Model_UserFavourite: null,
      Model_UserFunction: result
    };
    const oring = this.ftBottom_org.map((item: AFP_Function) => item.Function_Code);
    // 如果我的服務沒有修改，不送後端
    if (oring.join('') !== result.join('')) {
      this.appService.toApi('Home', '1108', request).subscribe((data: Response_AFPUpdateUserService) => {
        if ( data !== null ) {
          this.ftBottom_org = this.ftUserBottom;
        }
      });

    }
  }

  /** 取得「現領優惠券」、「特賣商品」頁籤資訊（點擊時）
   * @param mode SelectMode: 1 商品 2 優惠券
   * @param index 索引
   * @param menuCode 目錄編碼
   * @param prodChannelCode 商品頻道編號
   */
  getMoreData(mode: number, index: number, menuCode: number, prodChannelCode?: number) {
    const request: Request_OtherInfo = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: mode,
      SearchModel: {
        UserDefineCode: menuCode,
        IndexChannel_Code: prodChannelCode
      }
    };

    // 若該目錄下資料length為0才去call API
    switch (mode) {
      case 1:
        if (this.popProducts[index].ProductData.length === 0) {
          this.appService.toApi('Home', '1012', request).subscribe((data: Response_Home) => {
            this.popProducts[index].ProductData = data.List_ProductData[0].ProductData;
          });
        }
        break;
      case 2:
        if (this.nowVoucher[index].VoucherData.length === 0) {
          this.appService.toApi('Home', '1012', request).subscribe((data: Response_Home) => {
            this.nowVoucher[index].VoucherData = data.List_Voucher[0].VoucherData;
          });
        }
        break;
    }
  }


  /** 開啟服務連結 */
  FunctionLink(Link: AFP_Function, editFunction: boolean): void {
    if (!editFunction) {
      //  this.appService.backLayer();
      if (Link.Function_IsActive === 1) {
        if (Link.Function_URLTarget === '_app') {
          this.modal.confirm({ initialState: { message: '請問是否要開啟Mobii App?' } }).subscribe(res => {
            if (res) {
              window.location.href = Link.Function_URL;
              setTimeout(() => { this.router.navigate(['/AppDownload']); }, 25);
            }
          });
        } else if (Link.Function_URL.indexOf('http') !== -1) {
          window.open(Link.Function_URL, Link.Function_URLTarget);
        } else {
          if (this.appService.isApp !== null) {
            this.router.navigate([Link.Function_URL], { queryParams: { isApp: this.appService.isApp } });
          } else {
            this.router.navigate([Link.Function_URL]);
            this.appService.tLayer = []; // 清空tLayer避免前往頁面也有callLayer時會失效
          }
        }
      }
    }
  }

  /** (中間四格)廣告route */
  adRoute(url: string, urlTarget: string) {
    if (url.indexOf('http') !== -1) {
      // 外部連結 || 指定到內部某頁的某分頁
      window.open(url, urlTarget);
    } else {
      // 內部連結
      this.router.navigate([url]);
    }
  }

  /** 立即下載APP
   * TODO: 用universal link
   */
  toDownloadAPP() {
    window.location.href = 'mobii://';
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        // 未成功開啟APP則前往AppDownload被引導至平台下載
        this.router.navigate(['/AppDownload']);
      }
    }, 25);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      $('.imgLiquidFill').imgLiquid();
    }, 600);
  }

  ngDoCheck(): void {
    const change = this.serviceDiffer.diff(this.appService);
    if (change) {
      change.forEachChangedItem(item => {
        if (item.key === 'loginState' && item.currentValue === true) {
          // 在此頁登入則更新使用者暱稱、點數、優惠券、我的服務
          this.readHome(2);
        }
      });
    }
  }
}

/* tslint:disable */
class Response_AFPUserService extends Model_ShareData {
  Model_Function: AFP_Function[];
  Model_UserFunction?: AFP_Function[];
  List_NewFunction?: AFP_NewFunction[];
}

class Request_AFPUserService extends Model_ShareData {
  Model_UserFavourite?: AFP_UserFavourite[];
}

class AFP_NewFunction {
  CategaryName: string;
  CategaryCode: number;
  Model_Function: AFP_Function[];
}

class Request_AFPUpdateUserService extends Model_ShareData {
  Model_UserFavourite: AFP_UserFavourite[];
  Model_UserFunction: number[];
}

class Response_AFPUpdateUserService extends Model_ShareData {

}
