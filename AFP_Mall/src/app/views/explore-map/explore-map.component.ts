import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Request_AreaIndex, Response_AreaIndex, AreaJsonFile_ECStore, AFP_UserDefine } from '../../_models';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'ngx-useful-swiper';
import { AgmMap } from '@agm/core';

@Component({
  // selector: 'app-explore-map',
  templateUrl: './explore-map.component.html',
  styleUrls: ['../../../dist/style/explore.min.css']
})
export class ExploreMapComponent implements OnInit, AfterViewInit {
  @ViewChild('usefulSwiper', {static: false}) usefulSwiper: SwiperComponent;
  @ViewChild('AgmMap', {static: false}) agmMap: AgmMap;
  /** 緯度 */
  public lat: number;
  /** 經度 */
  public lng: number;
  /** 視圖倍率 */
  public zoomValue = 15;
  /** 使用者所在地 icon */
  public userUrl = '../../../img/callcar/map/user.svg';
  /** 景點 icon */
  public iconUrl = '../../../img/callcar/map/location.svg';
  /** 目前所顯示資訊小窗編碼 */
  public openedWindow = 0; // alternative: array of numbers
  /** 範圍內景點列表 */
  public AreaList: AreaJsonFile_ECStore[] = [];
  /** 目前所選景點 */
  public AreaItem: AreaJsonFile_ECStore;
  /** 篩選清單開啟狀態 */
  public dirFilterOpen = false;
  /** 目錄編碼 */
  public areaMenuCode = 0;
  /** 目錄編碼 */
  public areaMenuName: string;
  /** 篩選目錄列表 */
  public menuList: AFP_UserDefine[] = [];
  /** 下方資訊卡 swiper */
  public infoCard: SwiperOptions = {
    slidesPerView: 1.1,
    spaceBetween: 10,
    centeredSlides: true,
    on: {
      slideChange: () => {
        // get active AreaItem, get its code, and navigate on map
        this.AreaItem = this.AreaList[this.usefulSwiper.swiper.activeIndex];
        this.openedWindow = this.AreaItem.ECStore_Code;
      }
    }
  };

  constructor(public appService: AppService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.lat = 25.034306;
    this.lng = 121.564603;
    this.readAreaData(this.areaMenuCode);

    if (navigator.geolocation !== undefined) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position);
        /* 22.6117234 120.2979388 */
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.readAreaData(this.areaMenuCode);
      });
    } else {
      alert('該瀏覽器不支援定位功能');
    }
  }

  /** 取得使用者定位範圍內資料 (排序由近至遠並放入對應容器)
   * @param dirCode 目錄編碼
   */
  readAreaData(dirCode: number) {
    this.areaMenuCode = dirCode;
    const request: Request_AreaIndex = {
      User_Code: sessionStorage.getItem('userCode'),
      SearchModel: {
        IndexArea_Code: 400001,
        AreaMenu_Code: this.areaMenuCode,
        IndexArea_Distance: 5000
      }
    };

    this.appService.openBlock();
    this.appService.toApi('Area', '1401', request, this.lat, this.lng).subscribe((data: Response_AreaIndex) => {
      this.appService.openBlock();
      // 近 > 遠
      this.AreaList = data.List_AreaData[0].ECStoreData.sort((a, b) => {
        return a.ECStore_Distance - b.ECStore_Distance;
      });
      this.appService.blockUI.stop();
      // 更新目前所選景點、景點列表、目錄列表
      if (this.AreaItem === undefined) {
        this.AreaItem = this.AreaList[0];
      } else {
        this.usefulSwiper.swiper.slideTo(0);
      }
      if (this.menuList.length <= 0) {
        this.menuList = data.List_UserDefine;
      }
      // 若目錄編碼為0則更新為目錄列表第一個（全部）
      if (this.areaMenuCode === 0) {
        this.areaMenuCode = this.menuList[0].UserDefine_Code;
      }
      // 更新目錄名稱
      for (const area of this.menuList) {
        if (area.UserDefine_Code === this.areaMenuCode) {
          this.areaMenuName = area.UserDefine_Name;
        }
      }
      this.dirFilterOpen = false; // 關閉篩選清單
    });
  }

  /** 選取景點
   * @param index 景點索引 (AreaList 近 > 遠排序)
   */
  selectSpot(index: number): void {
    this.usefulSwiper.swiper.slideTo(index);
  }

  /** 目錄篩選清單開關 */
  toggleCategoryFilter() {
    this.dirFilterOpen = !this.dirFilterOpen;
  }

  /** Google Map 地標不顯示 icon */
  onMapReady(map?) {
    if (map) {
      map.setOptions({
        mapTypeControl: false,
        styles : [
           {
             featureType: 'poi',
             stylers: [
              { visibility: 'off' }
             ]
           }
        ]
      });
    }
  }

  ngAfterViewInit() {
    // $('#map').css({ height: 'calc(100vh - ' + ($('.explore-top-box').outerHeight() + $('.card-item').outerHeight()) + 'px)' });

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
