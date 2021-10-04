import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '@app/app.service';
import { Request_AreaIndex, Response_AreaIndex, AreaJsonFile_ECStore, AFP_UserDefine } from '@app/_models';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'ngx-useful-swiper';
import { AgmMap } from '@agm/core';
import { ModalService } from '@app/shared/modal/modal.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  // selector: 'app-explore-map',
  templateUrl: './explore-map.component.html',
  styleUrls: ['./explore-map.scss']
})
export class ExploreMapComponent implements OnInit {
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
  public areaMenuCode: number;
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

  constructor(public appService: AppService, private modal: ModalService, private bsModalRef: BsModalRef, private route: ActivatedRoute) {
    // 先抓網址傳參是否有目錄編碼，如果沒有則預設為0
    this.areaMenuCode = this.route.snapshot.queryParams.areaMenuCode === undefined ? 0 : Number(this.route.snapshot.queryParams.areaMenuCode);
  }

  ngOnInit() {
    // 判斷瀏覽器是否支援geolocation API
    if (navigator.geolocation !== undefined) {
      // 請求取用使用者現在的位置
      navigator.geolocation.getCurrentPosition(success => {
        this.lat = success.coords.latitude;
        this.lng = success.coords.longitude;
        this.readAreaData(this.areaMenuCode);
      }, err => {
        // 如果用戶不允取分享位置，取預設位置(台北101)
        this.lat = 25.034306;
        this.lng = 121.564603;
        this.readAreaData(this.areaMenuCode);
      });
    } else {

      this.modal.show('message', { class: 'modal-dialog-centered',
        initialState: { success: true, message: '該瀏覽器不支援定位功能', showType: 1 } });
      this.lat = 25.034306;
      this.lng = 121.564603;
      this.readAreaData(this.areaMenuCode);
    }
  }

  /** 取得使用者定位範圍內資料 (排序由近至遠並放入對應容器)
   * @param dirCode 目錄編碼
   */
  readAreaData(dirCode: number): void {
    this.appService.openBlock();
    this.areaMenuCode = dirCode;
    const request: Request_AreaIndex = {
      User_Code: sessionStorage.getItem('userCode'),
      SearchModel: {
        IndexArea_Code: 400001,
        AreaMenu_Code: this.areaMenuCode,
        IndexArea_Distance: 5000
      }
    };
    this.appService.toApi('Area', '1401', request, this.lat, this.lng).subscribe((data: Response_AreaIndex) => {
      this.appService.openBlock(); // 在畫面資料ready前顯示loader避免過早使用swiper卡住
      // 近 > 遠
      this.AreaList = data.List_AreaData[0].ECStoreData.sort((a, b) => {
        return a.ECStore_Distance - b.ECStore_Distance;
      });
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
      this.appService.blockUI.stop();
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
  onMapReady(map?: { setOptions: (arg0: { mapTypeControl: boolean; styles: { featureType: string; stylers: { visibility: string; }[]; }[]; }) => void; }): void {
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

}
