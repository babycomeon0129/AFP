import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { AFP_UserFavourite, AFP_UserReport, AFP_ADImg,
         Request_MemberMyCard, Response_MemberMyCard } from '@app/modules/member/_module-member';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['../../member/member.scss', './member-card.scss']
})
export class MemberCardComponent implements OnInit, AfterViewInit {
  /** 卡片列表 */
  public cardList: AFP_UserFavourite[] = [];
  /** 一般卡片列表 */
  public cardGeneralList: AFP_UserReport[] = [];
  /** 廣告列表 */
  public cardADList: AFP_ADImg[] = [];
  /** 置底按鈕先隱藏，需載入完1秒後才顯示，避免換頁殘影重疊 */
  public fixedBtn: boolean;

  constructor(public appService: AppService, public modal: ModalService, private meta: Meta, private title: Title, public router: Router) {
    this.title.setTitle('我的卡片 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。' });
    this.meta.updateTag({ content: '我的卡片 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。', property: 'og:description' });
  }

  ngOnInit() {
    this.readCardList();
    this.appService.appShowMobileFooter(false);
    this.fixedBtn = true;
  }

  /** 讀取卡片列表 */
  readCardList(): void {
    if (this.appService.loginState) {
      const request: Request_MemberMyCard = {
        User_Code: sessionStorage.getItem('userCode'),
        SelectMode: 4,
        AFP_UserFavourite: {
          UserFavourite_CountryCode: 886,
          UserFavourite_Type: 2, // 我的卡片
          UserFavourite_TypeCode: 1,
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
        this.cardGeneralList = data.AFP_UserReport;
        this.cardADList = data.List_ADImg;
      });
    } else {
      this.appService.loginPage();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.fixedBtn = false;
    }, 1000);
  }
}
