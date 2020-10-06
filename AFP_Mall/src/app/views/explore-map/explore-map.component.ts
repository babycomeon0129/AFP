import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Response_AreaMap, AFP_ECStore, Request_AreaMap } from '../../_models';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'ngx-useful-swiper';

@Component({
  // selector: 'app-explore-map',
  templateUrl: './explore-map.component.html',
  styleUrls: ['../../../dist/style/explore.min.css']
})
export class ExploreMapComponent implements OnInit, AfterViewInit {
  @ViewChild('usefulSwiper', {static: false}) usefulSwiper: SwiperComponent;
  /** 緯度 */
  lat: number;
  /** 經度 */
  lng: number;
  /** 視圖倍率 */
  zoomValue = 15;
  /** 使用者所在地 icon */
  userUrl = '../../../img/callcar/map/user.svg';
  /** 景點 icon */
  iconUrl = '../../../img/callcar/map/location.svg';
  /** 目前所顯示資訊小窗編碼 */
  openedWindow = 0; // alternative: array of numbers
  /** 範圍內景點列表 */
  AreaList: AFP_ECStore[] = [];
  /** 目前所選景點 */
  AreaItem: AFP_ECStore;
  /** 取得景點列表 request */
  request: Request_AreaMap = {
    User_Code: sessionStorage.getItem('userCode'),
    SearchModel: {
      AreaMap_Distance: 5000
    }
  };
  /** 下方資訊卡 swiper */
  public infoCard: SwiperOptions = {
    // paginationClickable: true, // TODO: not exist
    slidesPerView: 1.1,
    spaceBetween: 10,
    on: {
      slideChange: () => {
        // get active AreaItem, get its code, and navigate on map
        this.AreaItem = this.AreaList[this.usefulSwiper.swiper.activeIndex];
        this.openedWindow = this.AreaItem.ECStore_Code;
      }
    }
  };
  /** 篩選清單開啟狀態 */
  public categoryOpenStatus = false;

  constructor(public appService: AppService) {
  }

  ngOnInit() {
    this.lat = 25.034306;
    this.lng = 121.564603;

    this.GetLocation();
  }

  /** 取得使用者定位及範圍內資料 */
  GetLocation(): void {
    // 先取得資料(原始順序)
    this.appService.openBlock();
    this.appService.toApi('Area', '1402', this.request, this.lat, this.lng).subscribe((data: Response_AreaMap) => {
      this.AreaList = data.List_Area;
      this.AreaItem = this.AreaList[0];
    });
    // 若有開啟定位則重新排序(近 > 遠)
    if (navigator.geolocation !== undefined) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position);
        /* 22.6117234 120.2979388 */
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.appService.openBlock();
        this.appService.toApi('Area', '1402', this.request, this.lat, this.lng).subscribe((data: Response_AreaMap) => {
          // 近 > 遠
          this.appService.openBlock();
          this.AreaList = data.List_Area.sort((a, b) => {
            return a.ECStore_Distance - b.ECStore_Distance;
          });
          this.appService.blockUI.stop();
          this.AreaItem = this.AreaList[0];
          // this.openedWindow = this.AreaList[0].ECStore_Code;
        });
      });
    } else {
      alert('該瀏覽器不支援定位功能');
    }
  }

  /** 選取景點
   * @param index 景點索引 (AreaList 近 > 遠排序)
   */
  selectSpot(index: number): void {
    this.usefulSwiper.swiper.slideTo(index);
  }

  /** 目錄篩選清單開關 */
  toggleCategoryFilter() {
    this.categoryOpenStatus = !this.categoryOpenStatus;
  }

  ngAfterViewInit() {
    $('#map').css({ height: 'calc(100vh - ' + ($('.explore-top-box').outerHeight() + $('.card-item').outerHeight()) + 'px)' });

    // // 開啟篩選清單 (使用Angular寫法不然目錄篩選後篩選清單會維持開啟)
    // $('.filter-item1').on('click', function() {
    //   $(this).toggleClass('active').siblings().removeClass('active');
    //   const filter = $(this).data('filter');
    //   $('#' + filter).toggleClass('is-open');
    //   $('#' + filter).siblings().removeClass('is-open');
    //   $('.mask-container').removeClass('d-block');
    //   if ($('#' + filter).hasClass('is-open')) {
    //       $('.mask-container').addClass('d-block');
    //   }
    // });
  }
}
