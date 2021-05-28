import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { NgForm } from '@angular/forms';
import { ModalService } from '@app/shared/modal/modal.service';
import { AFP_UserFavourite, Request_MemberMyCard, Response_MemberMyCard } from '@app/modules/member/_module-member';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-card-certificate',
  templateUrl: './member-card-certificate.component.html',
  styleUrls: ['../../member/member.scss', './member-card-certificate.component.scss']
})
export class MemberCardCertificateComponent implements OnInit {
  /** 新增/修改卡片 ngForm request */
  public requestCard: AFP_UserFavourite = new AFP_UserFavourite();
  /** 表單綁定 */
  inputModel: any = {};

  constructor(public appService: AppService, public modal: ModalService, private router: Router, private meta: Meta, private title: Title) {
    this.title.setTitle('我的卡片 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。' });
    this.meta.updateTag({ content: '我的卡片 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。', property: 'og:description' });
  }

  ngOnInit() {
  }

  /** 新增卡片 */
  onAddCardSubmit(form: NgForm): void {
    this.requestCard.UserFavourite_CountryCode = 886;
    this.requestCard.UserFavourite_Type = 2; // 我的卡片
    this.requestCard.UserFavourite_TypeCode = 1;
    this.requestCard.UserFavourite_IsDefault = 0;
    this.requestCard.UserFavourite_State = 1;
    this.requestCard.UserFavourite_SyncState = 0;

    this.appService.openBlock();  // 開啟灰屏
    const request: Request_MemberMyCard = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 1,  // 新增
      AFP_UserFavourite: this.requestCard,
      SearchModel: {
        UserFavourite_ID: (this.requestCard.UserFavourite_ID > 0) ? this.requestCard.UserFavourite_ID : null
      }
    };

    this.appService.toApi('Member', '1507', request).subscribe((data: Response_MemberMyCard) => {
      this.router.navigate(['/MemberFunction/MemberCardList'], { queryParams: { showBack: this.appService.showBack } });
      form.resetForm();
    });
  }
}
