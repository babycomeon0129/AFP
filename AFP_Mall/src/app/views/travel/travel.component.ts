import { Component, DoCheck, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ModalService } from '../../service/modal.service';
import { Response_TravelHome, AFP_ADImg, AFP_Function, Model_TravelJsonFile, Request_TravelHome } from '../../_models';
import { SwiperOptions } from 'swiper';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['../../../dist/style/travel-index.min.css']
})
export class TravelComponent implements DoCheck {
  /** 使用者名稱 */
  public userName: string;
  /** 置頂廣告列表 */
  public ad20001: AFP_ADImg[] = [];
  /** 中間icon（使用者服務） */
  public ft: AFP_Function[] = [];
  /** 熱門活動列表 */
  public ad20002: AFP_ADImg[] = [];
  /** 主題旅遊列表 */
  public ad20003: AFP_ADImg[] = [];
  /** 本月主打列表 */
  public travel: Model_TravelJsonFile[] = [];
  private serviceDiffer: KeyValueDiffer<string, any>;

  /** 置頂廣告 swiper */
  public boxKV: SwiperOptions = {
    effect: 'fade',
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: true
  };

  /** 中間icon（使用者服務）swiper */
  public boxIcon: SwiperOptions = {
    spaceBetween: 0,
    slidesPerView: 5,
    slidesPerColumn: 2,
    slidesPerColumnFill : 'row',
    slidesPerGroup: 5,
    loop: false
    // paginationClickable: true,
  };

  /** 本月主打導覽 tab swiper */
  public boxTabs: SwiperOptions = {
    slidesPerView: 5,
    spaceBetween: 10,
    breakpoints: {
      320: {
        slidesPerView: 4,
        spaceBetween: 10
      },
      480: {
        slidesPerView: 5,
        spaceBetween: 15
      },
      640: {
        slidesPerView: 5,
        spaceBetween: 20
      }
    }
  };

  /** 熱門活動 swiper */
  public boxTFeatureHot: SwiperOptions = {
    // paginationClickable: true,
    freeMode: true,
    slidesPerView: 4,
    spaceBetween: 10,
    breakpoints: {
      1024: {
        slidesPerView: 6,
      },
    },
    loop: true
  };

  /** 主題旅遊、本月主打內容 swiper */
  public boxTFeature: SwiperOptions = {
    slidesPerView: 1.7,
    spaceBetween: 10,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    },
    loop: false
  };

  constructor(public appService: AppService, public modal: ModalService, private differs: KeyValueDiffers,
              private meta: Meta, private title: Title) {
    this.serviceDiffer = this.differs.find({}).create();
    // tslint:disable: max-line-length
    this.title.setTitle('去旅行 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 去旅行。這裡你可以探索各種旅遊行程，包括台灣、離島、海外、主題旅遊，也可以直接訂房跟訂機票，還有景點門票，甚至包括機場機接送。Mobii! 去旅行與喜鴻假期合作，未來我們將會推出獨一無二的 Mobii! 會員專屬路線行程！'});
    this.meta.updateTag({content: '去旅行 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 去旅行。這裡你可以探索各種旅遊行程，包括台灣、離島、海外、主題旅遊，也可以直接訂房跟訂機票，還有景點門票，甚至包括機場機接送。Mobii! 去旅行與喜鴻假期合作，未來我們將會推出獨一無二的 Mobii! 會員專屬路線行程！', property: 'og:description'});

    const request: Request_TravelHome = {
      User_Code: sessionStorage.getItem('userCode'),
      SearchModel: {
        IndexTravel_Code: 21001
      }
    };

    this.appService.toApi('Travel', '1301', request).subscribe((data: Response_TravelHome) => {
      this.ad20001 = data.ADImg_Top;
      this.ad20002 = data.ADImg_Activity;
      this.ad20003 = data.ADImg_Theme;

      data.List_Function.forEach((value) => {
        this.ft.push(value);
      });
      this.travel = data.List_TravelData;
    });

    // 若有登入則顯示我的收藏
    if (this.appService.loginState === true) {
      this.userName = sessionStorage.getItem('userName');
      this.appService.showFavorites();
    }

  }

  ngDoCheck(): void {
    const change = this.serviceDiffer.diff(this.appService);
    if (change) {
      change.forEachChangedItem(item => {
        if (item.key === 'loginState' && item.currentValue === true) {
          // 在此頁登入則更新使用者名稱
          this.userName = sessionStorage.getItem('userName');
        }
      });
    }
  }

}
