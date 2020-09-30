import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Response_AreaMap, AFP_ECStore, Request_AreaMap } from '../../_models';
import { SwiperOptions } from 'swiper';

@Component({
  // selector: 'app-explore-map',
  templateUrl: './explore-map.component.html',
  styleUrls: ['../../../dist/style/explore.min.css', '../../../dist/style/car_setting.min.css']
})
export class ExploreMapComponent implements OnInit, AfterViewInit {
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
    // paginationClickable: true, // TODO:
    slidesPerView: 1.1,
    spaceBetween: 10
  };

  constructor(private appService: AppService) {
  }

  ngOnInit() {
    this.lat = 25.034306;
    this.lng = 121.564603;

    this.GetLocation();
  }

  /** 取得使用者定位 */
  GetLocation(): void {

    this.appService.toApi('Area', '1402', this.request, this.lat, this.lng).subscribe((data: Response_AreaMap) => {
      this.AreaList = data.List_Area;
      this.AreaItem = this.AreaList[0];
    });

    if (navigator.geolocation !== undefined) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position);
        /* 22.6117234 120.2979388 */
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        this.appService.toApi('Area', '1402', this.request, this.lat, this.lng).subscribe((data: Response_AreaMap) => {
          this.AreaList = data.List_Area;
          this.AreaItem = this.AreaList[0];
          // this.openedWindow = this.AreaList[0].ECStore_Code;
        });
      });
    } else {
      alert('該瀏覽器不支援定位功能');
    }
  }

  /** 點選景點 */
  selectPoint(StoreCode: number): void {
    this.AreaList.forEach(obj => {
      if (obj.ECStore_Code === StoreCode) {
        this.AreaItem = obj;
        this.openedWindow = StoreCode;
      }
    });
  }

  // isInfoWindowOpen(id) {
  //   return this.openedWindow === id; // alternative: check if id is in array
  // }

  ngAfterViewInit() {
    $('#map').css({ height: 'calc(100vh - ' + ($('.explore-top-box').outerHeight() + $('.card-item').outerHeight()) + 'px)' });
  }
}
