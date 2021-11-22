import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { Request_MemberFavourite, Response_MemberFavourite, TravelJsonFile_Travel, AreaJsonFile_ECStore, AFP_ECStore, AFP_Product } from '@app/_models';
import { ModalService } from '@app/shared/modal/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-member-favorite',
  templateUrl: './member-favorite.component.html',
  styleUrls: ['../../member/member.scss', './member-favorite.scss']
})
export class MemberFavoriteComponent implements OnInit {
  /** 編輯模式  false: 編輯  true: 完成 */
  public editMode = false;
  /** 選擇TAG  53: 探索周邊 51:按讚好物 52: 收藏商店 54: 旅遊行程 */
  public selectedType = 53;
  /** 探索周邊列表 */
  public listArea: AreaJsonFile_ECStore[] = [];
  /** 按讚好物 */
  public listProduct: AFP_Product[] = [];
  /** 收藏商店 */
  public listEcstore: AFP_ECStore[] = [];
  /** 旅遊行程 */
  public listTravel: TravelJsonFile_Travel[] = [];

  constructor(public appService: AppService, private oauthService: OauthService,
              public modal: ModalService, private route: ActivatedRoute, private router: Router,
              private meta: Meta, private title: Title) {
    this.title.setTitle('我的收藏 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 我的收藏。這裡會顯示 Mobii! 用戶按讚收藏的檔案，包括周邊、商品、店家以及旅遊行程。請先登入註冊以開啟功能。' });
    this.meta.updateTag({ content: '我的收藏 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 我的收藏。這裡會顯示 Mobii! 用戶按讚收藏的檔案，包括周邊、商品、店家以及旅遊行程。請先登入註冊以開啟功能。', property: 'og:description' });
  }

  ngOnInit() {
    // 撈探索周邊
    this.onFavList(53);
  }

  /** 讀取某類型收藏列表
   * @param favType 51 商品, 52 商家, 53 周邊, 54 行程
   */
  onFavList(favType: number): void {
    this.selectedType = favType;
    this.editMode = false;
    this.appService.openBlock();
    const request: Request_MemberFavourite = {
      SelectMode: 11,
      AFP_UserFavourite: {
        UserFavourite_ID: 0,
        UserFavourite_CountryCode: 886,
        UserFavourite_Type: favType,
        UserFavourite_UserInfoCode: 0,
        UserFavourite_IsDefault: 0
      }
    };

    this.appService.toApi('Member', '1511', request).subscribe((data: Response_MemberFavourite) => {
      switch (favType) {
        case 51:
          this.listProduct = data.List_Product;
          break;
        case 52:
          this.listEcstore = data.List_ECStore;
          break;
        case 53:
          this.listArea = data.List_Area;
          break;
        case 54:
          this.listTravel = data.List_Travel;
          break;
      }
    });
  }

  /** 刪除收藏
   * @param showList 列表
   * @param favType 51 商品, 52 商家, 53 周邊, 54 行程
   * @param favCode 商品/商家/周邊/行程編碼
   */
  onDelFav(showList, favType: number, favCode: number): void {
    this.modal.confirm({ initialState: { message: '確認要刪除這個收藏嗎?' } }).subscribe(res => {
      const request: Request_MemberFavourite = {
        SelectMode: 2,
        AFP_UserFavourite: {
          UserFavourite_ID: 0,
          UserFavourite_CountryCode: 886,
          UserFavourite_Type: favType,
          UserFavourite_UserInfoCode: 0,
          UserFavourite_TypeCode: favCode,
          UserFavourite_IsDefault: 0
        },
      };

      if (res) {
        this.appService.toApi('Member', '1511', request).subscribe((data: Response_MemberFavourite) => {
          // update favorites in session
          this.oauthService.cookiesSet({
            userFavorites: JSON.stringify(data.List_UserFavourite),
            page: location.href
          });
          // get new favorites and push to array
          this.appService.showFavorites();
          // remove the data (also disappear from DOM)
          showList.every((item, index) => {
            let delState = false;
            switch (favType) {
              case 51:
                if (item.Product_Code === favCode) {
                  delState = true;
                }
                break;
              case 52:
              case 53:
                if (item.ECStore_Code === favCode) {
                  delState = true;
                }
                break;
              case 54:
                if (item.Travel_Code === favCode) {
                  delState = true;
                }
                break;
            }

            if (delState) {
              showList.splice(index, 1);
              return false; // 迴圈中止
            }
            return true;
          });

        });
      }
    });
  }

  /** 前往行程詳細
   * @param isOnline 是否上架
   * @param item 行程
   */
  goToTour(isOnline: boolean, item: TravelJsonFile_Travel): boolean {
    if (item.Travel_URL === '/' || !isOnline) {
      return false;
    } else {
      window.open(item.Travel_URL, item.Travel_URLTarget);
    }
  }

  /** 前往詳細頁（APP特殊處理: 避免在APP中開啟收藏列表後馬上雙點擊項目造成在詳細頁顯示web的footer）
   * @param isOnline 是否上架
   * @param page 頁面名稱
   * @param code1 編碼1
   * @param code2 編碼2
   */
  goToDetail(isOnline: boolean, page: string, code1?: number, code2?: number): void {
    let routeChanged = false;
    if (isOnline) {
      if (!routeChanged) {
        // 若route還未改變才前往
        if (code2 === undefined) {
          this.router.navigate([page, code1], { queryParams: { showBack: this.appService.showBack } });
        } else {
          this.router.navigate([page, code1, code2], { queryParams: { showBack: this.appService.showBack } });
        }
      }
    }
    routeChanged = true;
  }

}
