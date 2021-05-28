import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { AFP_UserFavourite, Request_MemberMyCard, Response_MemberMyCard } from '@app/modules/member/_module-member';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-member-card-list',
  templateUrl: './member-card-list.component.html',
  styleUrls: ['./member-card-list.component.scss']
})
export class MemberCardListComponent implements OnInit {
  /** 卡片列表 */
  public cardList: AFP_UserFavourite[] = [];
  /** 修改卡片 ngForm request */
  public requestCard: AFP_UserFavourite = new AFP_UserFavourite();

  constructor(public appService: AppService, public modal: ModalService, private meta: Meta, private title: Title, public router: Router) {
    this.title.setTitle('我的卡片 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。' });
    this.meta.updateTag({ content: '我的卡片 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。', property: 'og:description' });
  }

  ngOnInit() {
    this.readCardList();
    this.appService.appShowMobileFooter(false);
  }

  /** 讀取卡片列表 */
  readCardList(): void {
    if (this.appService.loginState) {
      this.appService.openBlock();
      const request: Request_MemberMyCard = {
        User_Code: sessionStorage.getItem('userCode'),
        SelectMode: 4,
        AFP_UserFavourite: {
          UserFavourite_CountryCode: 886,
          UserFavourite_Type: 2,
          UserFavourite_IsDefault: 0,
          UserFavourite_State: 1,
          UserFavourite_SyncState: 0
        },
        SearchModel: {
          UserFavourite_ID: null
        }
      };
      this.appService.toApi('Member', '1507', request).subscribe((data: Response_MemberMyCard) => {
        this.cardList = data.List_UserFavourite;
      });
    } else {
      this.appService.loginPage();
    }
  }

  /** 路由轉頁 */
  routerNavigate() {
    this.router.navigate(['/MemberFunction/MemberCard'], { queryParams: { showBack: this.appService.showBack } });
  }
}
