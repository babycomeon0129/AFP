import { BsModalRef } from 'ngx-bootstrap';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { AppService } from '@app/app.service';
import { ModalService } from '@app/shared/modal/modal.service';
import {
  Response_Home, AFP_ADImg, Model_AreaJsonFile, AFP_Function, Model_TravelJsonFile,
  Model_ShareData, AFP_UserFavourite, Request_Home, AFP_ChannelProduct,
  AFP_ChannelVoucher} from '@app/_models';
import { SwiperOptions } from 'swiper';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@env/environment';
import { Meta, Title } from '@angular/platform-browser';
import { SortablejsOptions } from 'ngx-sortablejs';
import { layerAnimation } from '@app/animations';

declare var $: any;

@Component({
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.scss', '../travel/travel.scss'],
  animations: [layerAnimation]
})
export class EntranceComponent implements OnInit {

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

  /** 現領優惠券、主打店家、本月外送主打、本月旅遊主打 tab swiper */
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
  /** 我的服務編輯狀態 */
  public editFunction = false;
  /** 我的服務-所有服務清單 */
  public serviceList: AFP_NewFunction[] = [];
  /** 我的服務-數量提醒最少4個 */
  public noticeFour = false;
  /** 我的服務-數量提醒最多9個 */
  public noticeNine = false;
  /** 特賣商品 */
  public popProducts: AFP_ChannelProduct[] = [];
  /** 使用者擁有點數 */
  public userPoint: number;
  /** 使用者擁有優惠券數量 */
  public userVoucherCount: number;
  /** 我的服務: 判斷是否被拖曳 */
  public isMove = false;
  /** 我的服務:拖曳功能options */
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
  /** 關閉下載APP動畫控制 */
  public animationMoveUpOut = false;
  /** 當前所選本月旅遊主打頁籤索引 */
  public activeTravelIndex = 0;
  /** 同頁滑動切換 0: 原頁 1: 我的服務 */
  public layerTrig = 0;
  /** 判斷 justKa客服modal 顯示與否 */
  public show = false;
  /** 關閉 justKa 對話框 */
  public closeMsg = false;

  constructor(public appService: AppService, public bsModalRef: BsModalRef, public modal: ModalService, private router: Router, private meta: Meta, private title: Title, private cookieService: CookieService,
    public route: ActivatedRoute, private renderer2: Renderer2) {
    this.title.setTitle('Mobii!｜綠色城市優惠平台');
    this.meta.updateTag({ name: 'description', content: '使用 Mobii! APP，讓你的移動總是驚喜。乘車、購物、美食、景點、旅行資訊全都包，使用就享點數回饋，每日登入再領 M Points，會員再享獨家彩蛋大禮包。先下載 Mobii APP 看看裡面有什麼好玩的吧？' });
    this.meta.updateTag({ content: 'Mobii!｜綠色城市優惠平台', property: 'og:title' });
    this.meta.updateTag({ content: '使用 Mobii! APP，讓你的移動總是驚喜。乘車、購物、美食、景點、旅行資訊全都包，使用就享點數回饋，每日登入再領 M Points，會員再享獨家彩蛋大禮包。先下載 Mobii APP 看看裡面有什麼好玩的吧？', property: 'og:description' });
  }

  ngOnInit() {
    // 從route resolver取得首頁資料
    // this.route.data.subscribe((data: { homeData: Response_Home }) => {
    //   // 接資料
    // });
    this.readUp();
    this.getHomeservice();
    this.readDown();
    // 若有登入則顯示名字、M Points及優惠券資訊（手機版）、我的收藏
    if (this.appService.loginState) {
      this.appService.showFavorites();
    }
  }

  /** 讀取首頁上方資料（皆為廣告及會員資料，我的服務除外） */
  readUp() {
    const request: Request_Home = {
      User_Code: sessionStorage.getItem('userCode')
    };
    this.appService.openBlock();
    this.appService.toApi('Home', '1021', request).subscribe((data: Response_Home) => {
      // 會員資訊
      // this.appService.userName = sessionStorage.getItem('userName');
      this.userPoint = data.TotalPoint;
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
  readDown() {
    const request: Request_Home = {
      User_Code: sessionStorage.getItem('userCode'),
      SearchModel: {
        IndexArea_Code: 100001,
        IndexTravel_Code: 21001,
        IndexChannel_Code: 10000001,
        IndexDelivery_Code: 300001
      }
    };
    // 不使用loading spinner 讓進入首頁可先快速瀏覽上方
    this.appService.toApi('Home', '1022', request).subscribe((data: Response_Home) => {
      this.hitArea = data.List_AreaData;
      this.hitTravel = data.List_TravelData;
      this.popProducts = data.List_ProductData;
      this.deliveryArea = data.List_DeliveryData;
      this.nowVoucher = data.List_Voucher;
    });
  }

  /** 判斷首頁進場廣告開啟 */
  adIndexChenck(): void {
    const adTime = this.cookieService.get('adTime') || null;
    // adTime轉字串adTimeString
    const adTimeString = JSON.parse(adTime);
    const nowTime = new Date().getFullYear().toString() + new Date().getMonth().toString() + new Date().getDate().toString();
    if (adTimeString !== nowTime) {
      this.cookieService.set('adTime', JSON.stringify(nowTime), 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
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

  /** 我的服務編輯模式開啟 */
  editOpen(): void {
    this.editFunction = true;
    this.options = { disabled: false };
  }

  /** 我的服務編輯模式關閉 */
  editClose(): void {
    this.editFunction = false;
    this.options = { disabled: true };
    this.ftBottom = this.ftBottom_org.concat();
  }

  /** 首頁我的服務 */
  getHomeservice(): void {
    this.appService.openBlock();
    const request: Request_AFPUserService = {
      User_Code: sessionStorage.getItem('userCode'),
      // SelectMode 1 : 首頁 10 : 我的服務
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
  serviceClick(code: number, cat: number, action: boolean): void {
    if (this.editFunction && action) {
      this.noticeNine = this.ftBottom.length === 9;
      this.noticeFour = this.ftBottom.length === 4;
      // 判斷被點擊的ICON是否已經在我的服務內
      const result = this.ftBottom.findIndex(item => item.Function_Code === code);
      if (result > -1) {
        // 已經在我的服務內，就將這個ICON移出我的服務
        if (this.ftBottom.length > 4 && !this.isMove) {
          this.ftBottom.splice(result, 1);
          // 根據我的服務清單，修改下面更多服務的class狀態
          this.serviceList.filter(item => item.CategaryCode === cat)[0].Model_Function.forEach(icon => {
            if (icon.Function_Code === code) {
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
          this.serviceList.filter(item => item.CategaryCode === cat)[0].Model_Function.forEach(icon => {
            if (icon.Function_Code === code) {
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
    // 將我的服務的function code 陣列result傳給後端
    const result = this.ftBottom.map((item: AFP_Function) => item.Function_Code);
    const request: Request_AFPUpdateUserService = {
      User_Code: sessionStorage.getItem('userCode'),
      Model_UserFavourite: null,
      Model_UserFunction: result
    };
    const oring = this.ftBottom_org.map((item: AFP_Function) => item.Function_Code);
    // 如果我的服務沒有修改，不送後端
    if (oring.join('') !== result.join('')) {
      this.appService.toApi('Home', '1108', request).subscribe((data: Response_AFPUpdateUserService) => {
        if (data !== null) {
          this.ftBottom_org = this.ftBottom.concat();
        }
      });

    }
  }


  /** 取得swiper-nav output Param（點擊時）
   * @param mode SelectMode: 1 特賣商品 2 現領優惠券 3 主打店家 4 外送店家 5 旅遊主打
   * @param idx 索引
   * @param code 目錄編碼
   * @param id 頻道編號
   */
  readSheetPanes(param: tabParam) {
    const mode = param.Mode;
    const idx = param.Idx;
    const code = param.Code;
    const id = param.Id;
    this.readSheet(mode, idx, code, id);
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
      this.renderer2.setStyle(document.getElementById('tabContentWrap'), 'minHeight', travelPane[this.activeTravelIndex].scrollHeight + 'px');
    }
    // update the index
    this.activeTravelIndex = index;

    const request: Request_OtherInfo = {
      User_Code: sessionStorage.getItem('userCode'),
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
              window.location.href = Link.Function_URL;
              setTimeout(() => { this.router.navigate(['/ForApp/AppDownload']); }, 25);
            }
          });
        } else {
          if (this.appService.isApp !== null) {
            this.router.navigate([Link.Function_URL], { queryParams: { isApp: this.appService.isApp } });
          } else {
            // this.router.navigate([Link.Function_URL]);
            window.open(Link.Function_URL, Link.Function_URLTarget);
            this.appService.tLayer = []; // 清空tLayer避免前往頁面也有callLayer時會失效
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
    window.location.href = 'mobii://';
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        // 未成功開啟APP則前往AppDownload被引導至平台下載
        this.router.navigate(['/ForApp/AppDownload']);
      }
    }, 25);
  }

  /** 關閉下載APP */
  toCloaseDownloadAPP(): void {
    setTimeout(() => {
      this.appService.showAPPHint = false;
    }, 500);
    this.animationMoveUpOut = true;
  }

  /** justKa點擊事件（justKa modal 顯示與否）*/
  toggle() {
    this.show = !this.show;
    if (this.show) {
      this.modal.show('justka',
        {
          initialState:
          {
            justkaUrl:
              'https://biz.justka.ai/webapp/home?q=a2d422f6-b4bc-4e1d-9ca0-7b4db3258f35&a=d3f53a60-db70-11e9-8a34-2a2ae2dbcce4'
          }
        },
        this.bsModalRef);
    } else {
      this.modal.closeModal1();
      document.querySelector('body').classList.remove('modal-open');
    }
  }

}

/** 使用者服務 ResponseModel */
class Response_AFPUserService extends Model_ShareData {
  /** 使用者服務 - 舊版 */
  Model_Function: AFP_Function[];
  /** 使用者收藏 - 舊版 */
  Model_UserFunction?: AFP_Function[];
  /**使用者服務 - 新版
   *
   * 0: 系統服務
   * 1: 我的服務
   * 2+: 後台建置
   */
  List_NewFunction?: AFP_NewFunction[];
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
   * 2+: 後台建置 */
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

/** 取得swiper-nav output Param（點擊時） */
interface tabParam {
  /** SelectMode  1: 特賣商品 2: 現領優惠券 3: 主打店家 4: 外送店家 5: 旅遊主打 */
  Mode: number;
  /** 索引 */
  Idx: number;
  /** 目錄編碼 */
  Code: number;
  /** 頻道編號 */
  Id: number;
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
