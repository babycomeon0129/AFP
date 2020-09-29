import { Component, AfterViewInit, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Response_AreaIndex, AFP_UserDefine, Request_AreaIndex, AreaJsonFile_ECStore } from '../../_models';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-explore-list',
  templateUrl: './explore-list.component.html',
  styleUrls: ['../../../dist/style/explore.min.css']
})
export class ExploreListComponent implements OnInit, AfterViewInit {
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
  public hideGoBack = null; // APP 特例處理（APP訪問則隱藏返回鍵）

  constructor(public appService: AppService, private route: ActivatedRoute, private meta: Meta, private title: Title) {
    // 若有從外部帶一指定目錄編碼
    if (this.route.snapshot.params.AreaMenu_Code !== undefined) {
      this.areaMenuCode = Number(this.route.snapshot.params.AreaMenu_Code);
    }

    this.readData();
  }

  ngOnInit(): void {
    // App訪問
    this.route.queryParams.subscribe(params => {
      this.hideGoBack = params.isApp;
    });
    // load data when route param changes(前往其他目錄)
    this.route.params.subscribe(routeParams => {
      if (this.areaMenuCode !== 0 && this.areaMenuCode !== Number(routeParams.AreaMenu_Code)) {
        this.areaMenuCode = Number(routeParams.AreaMenu_Code);
        this.readData();
        this.categoryOpenStatus = false;
      }
    });
  }

  /** 讀取列表資料 */
  readData() {
    this.appService.openBlock();
    const request: Request_AreaIndex = {
      User_Code: sessionStorage.getItem('userCode'),
      SearchModel: {
        IndexArea_Code: 400001,
        AreaMenu_Code: this.areaMenuCode,
        IndexArea_Distance: 5000
      }
    };
    this.appService.toApi('Area', '1401', request).subscribe((data: Response_AreaIndex) => {
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

      // tslint:disable: max-line-length
      this.title.setTitle(this.areaMenuName + '｜探索周邊 - Mobii!');
      this.meta.updateTag({ name: 'description', content: '' });
      this.meta.updateTag({ content: this.areaMenuName + '｜探索周邊 - Mobii!', property: 'og:title' });
      this.meta.updateTag({ content: '', property: 'og:description' });
    });
  }

  /** 目錄篩選清單開關 */
  toggleCategoryFilter() {
    this.categoryOpenStatus = !this.categoryOpenStatus;
  }

  /** 執行目錄篩選
   * @param menuCode 目錄編碼
   */
  onFilterByCategory(menuCode: number) {
    this.areaMenuCode = menuCode;
    this.readData();
    this.toggleCategoryFilter();
  }

  ngAfterViewInit(): void {

    // 讓head跟列表總高=100vh
    const topBox = $('.explore-top-box');
    const mainBox = $('.explore-container');
    $(window).on('resize', () => {
      mainBox.css({ height: 'calc(100vh - ' + topBox.height() + 'px)' });
    }).trigger('resize');

    // 篩選清單層級樣式
    $('.nav-container .levelOne > li').on('click', function() {
      $('.nav-container .levelOne > li').removeClass('active');
      $(this).addClass('active');
    });
    $('.nav-container .levelTwo > li').on('click', function() {
      $('.nav-container .levelTwo > li').removeClass('active');
      $(this).addClass('active');
    });

  }
}
