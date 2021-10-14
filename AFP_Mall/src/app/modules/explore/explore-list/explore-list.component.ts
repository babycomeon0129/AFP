import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { Response_AreaIndex, AFP_UserDefine, Request_AreaIndex, AreaJsonFile_ECStore } from '@app/_models';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ModalService } from '@app/shared/modal/modal.service';

@Component({
  selector: 'app-explore-list',
  templateUrl: './explore-list.component.html',
  styleUrls: ['./explore-list.scss']
})
export class ExploreListComponent implements OnInit {
  /** 緯度 */
  public lat: number;
  /** 經度 */
  public lng: number;
  /** 景點資料（目錄包景點） */
  public exAreadata: AreaJsonFile_ECStore[] = [];
  /** 目錄資料 */
  public exUserdefine: AFP_UserDefine[] = [];
  /** 目錄編碼 */
  public areaMenuCode = 0;
  /** 目錄名稱 */
  public areaMenuName: string;
  /** 篩選清單開啟狀態 */
  public categoryOpenStatus = false;
  /** 如果readData() 跑完資料才顯示 */
  public dataOk = false;

  constructor(public appService: AppService, private route: ActivatedRoute, private meta: Meta, private title: Title,
              private modal: ModalService) {
    // 若有從外部帶一指定目錄編碼
    if (this.route.snapshot.params.AreaMenu_Code !== undefined) {
      this.areaMenuCode = Number(this.route.snapshot.params.AreaMenu_Code);
    }

  }

  ngOnInit() {
    // load data when route param changes(前往其他目錄)
    this.route.params.subscribe(routeParams => {
      if (this.areaMenuCode !== 0 && this.areaMenuCode !== Number(routeParams.AreaMenu_Code)) {
        this.areaMenuCode = Number(routeParams.AreaMenu_Code);
        // this.readData();
        this.categoryOpenStatus = false;
      }
      // 判斷瀏覽器是否支援geolocation API
      if (navigator.geolocation !== undefined) {
        // 請求取用使用者現在的位置
        navigator.geolocation.getCurrentPosition(success => {
          this.lat = success.coords.latitude;
          this.lng = success.coords.longitude;
          this.readData();
        }, err => {
          // 如果用戶不允取分享位置，取預設位置(台北101)
          this.lat = 25.034306;
          this.lng = 121.564603;
          this.readData();
        });
      } else {
        this.modal.show('message', { class: 'modal-dialog-centered',
          initialState: { success: true, message: '該瀏覽器不支援定位功能', showType: 1 } });
        this.lat = 25.034306;
        this.lng = 121.564603;
        this.readData();
      }
    });
  }

  /** 讀取列表資料 */
  readData(): void {
    // this.appService.openBlock();
    const request: Request_AreaIndex = {
      SearchModel: {
        IndexArea_Code: 400001,
        AreaMenu_Code: this.areaMenuCode,
        IndexArea_Distance: 5000
      }
    };
    this.appService.toApi('Area', '1401', request, this.lat, this.lng).subscribe((data: Response_AreaIndex) => {
      this.dataOk = true;
      // 景點資料依距離升冪(近到遠)排列
      this.exAreadata = data.List_AreaData[0].ECStoreData.sort((a, b) => {
        return a.ECStore_Distance - b.ECStore_Distance;
      });
      this.exUserdefine = data.List_UserDefine;
      // 若areaMenuCode不存在（前端預設值為0），讓第一個目錄顯示為目前所選
      if (this.areaMenuCode === 0) {
        this.areaMenuCode = data.List_UserDefine[0].UserDefine_Code;
      }
      for (const dir of this.exUserdefine) {
        if (dir.UserDefine_Code === this.areaMenuCode) {
          this.areaMenuName = dir.UserDefine_Name;
        }
      }

      this.title.setTitle(this.areaMenuName + '｜探索周邊 - Mobii!');
      this.meta.updateTag({ name: 'description', content: '' });
      this.meta.updateTag({ content: this.areaMenuName + '｜探索周邊 - Mobii!', property: 'og:title' });
      this.meta.updateTag({ content: '', property: 'og:description' });
    });
  }

  /** 目錄篩選清單開關 */
  toggleCategoryFilter(): void {
    this.categoryOpenStatus = !this.categoryOpenStatus;
  }

  /** 執行目錄篩選
   * @param menuCode 目錄編碼
   */
  onFilterByCategory(menuCode: number): void {
    this.areaMenuCode = menuCode;
    this.readData();
    this.toggleCategoryFilter();
  }

}
