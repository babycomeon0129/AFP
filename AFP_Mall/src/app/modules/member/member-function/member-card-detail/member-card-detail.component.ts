import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalService } from '@app/shared/modal/modal.service';
import { AFP_UserFavourite, Request_MemberMyCard, Response_MemberMyCard } from '@app/modules/member/_module-member';
import { NgForm } from '@angular/forms';
import { AppService } from '@app/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-member-card-detail',
  templateUrl: './member-card-detail.component.html',
  styleUrls: ['../../member/member.scss', './member-card-detail.component.scss']
})
export class MemberCardDetailComponent implements OnInit {
  /** 修改卡片 ngForm request */
  public requestCard: AFP_UserFavourite = new AFP_UserFavourite();
  /** 卡片群組列表篩選連結不為空 */
  public cardGroupList = [];
  /** 卡片群組名稱 */
  public cardGroupName: string;
  /** 卡片群組縮圖預設 */
  public cardGroupThumbnailDef = '../../img/member/myCardThumbnailDef.png';
  /** 卡片群組底圖預設 */
  public cardGroupImgDef = '../../img/member/myCardDef.png';
  /** 卡片群組底圖 */
  public cardGroupImg: string;
  /** 卡片群組連結顯示隱藏 */
  public cardGroupLink: boolean;
  /** 卡片ID */
  public userFavouriteID: string;
  /** 卡片類型 */
  public userFavouriteTypeCode: string;
  /** 卡片類型名稱 */
  public userFavouriteTypeName: string;

  constructor(public appService: AppService, public modal: ModalService, public bsModalRef: BsModalRef,
              private meta: Meta, private title: Title, private route: ActivatedRoute, private router: Router) {
    this.title.setTitle('我的卡片 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。' });
    this.meta.updateTag({ content: '我的卡片 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。', property: 'og:description' });
  }

  ngOnInit() {
    /** 取得route.queryParams卡片ID,卡片類型 */
    this.userFavouriteID = this.route.snapshot.paramMap.get('UserFavourite_ID');
    this.userFavouriteTypeCode = this.route.snapshot.paramMap.get('UserFavourite_TypeCode');
    if (typeof this.userFavouriteID !== 'undefined') {
      this.onReadCardDetail();
    }
    this.cardGroupLink = false;
    switch (this.userFavouriteTypeCode) {
      case '1':
        this.userFavouriteTypeName = '一卡通';
        break;
      case '11':
        this.userFavouriteTypeName = '悠遊卡';
        break;
      case '12':
        this.userFavouriteTypeName = '虛擬卡';
        break;
      default:
        break;
    }
  }

  /** 讀取卡片詳細 */
  onReadCardDetail() {
    if (this.appService.loginState) {
      const request: Request_MemberMyCard = {
        SelectMode: 5,
        AFP_UserFavourite: {
          UserFavourite_CountryCode: 886,
          UserFavourite_Type: 2,
          UserFavourite_IsDefault: 0,
          UserFavourite_State: 1,
          UserFavourite_SyncState: 0
        },
        SearchModel: {
          UserFavourite_ID: parseInt(this.userFavouriteID, 10)
        }
      };
      this.appService.toApi('Member', '1507', request).subscribe((data: Response_MemberMyCard) => {
        if (this.requestCard === null) {
          this.router.navigate(['/MemberFunction/MemberCard'],
            {queryParams: {showBack: true, itemCode: this.userFavouriteTypeCode, layerParam: 2}});
        }
        this.requestCard = data.AFP_UserFavourite;
        if (this.requestCard.CardGroup_List !== null) {
          this.cardGroupName = this.requestCard.CardGroup_List[0].CardGroup_Name;
          this.cardGroupImg = this.requestCard.CardGroup_List[0].CardGroup_Img;
        } else {
          data.AFP_UserReport.forEach(item => {
            if (item.UserReport_ItemCode === parseInt(this.userFavouriteTypeCode, 10)) {
              if (item.UserReport_ParamJ !== null) {
                this.cardGroupImg = item.UserReport_ParamJ;
              } else {
                parseInt(this.userFavouriteTypeCode, 10) === 1 ?
                this.cardGroupImg = '../../img/member/my_ipass_bg.png' :
                this.cardGroupImg = '../../img/member/my_easycard_bg.png' ;
              }
            }
          });
        }
        if (this.requestCard.CardGroup_List !== null) {
          this.cardGroupList = this.requestCard.CardGroup_List.filter(item => (item.CardGroup_Link !== null && item.CardGroup_State === 0));
        }
      });
    }
  }

  /** 修改卡片 */
  onUpdateCardSubmit(form: NgForm): void {
    this.requestCard.UserFavourite_CountryCode = 886;
    this.requestCard.UserFavourite_Type = 2;
    this.requestCard.UserFavourite_TypeCode = this.requestCard.UserFavourite_TypeCode,
    this.requestCard.UserFavourite_IsDefault = 0;
    this.requestCard.UserFavourite_State = 1;
    this.requestCard.UserFavourite_SyncState = 0;
    this.requestCard.UserFavourite_Text1 = form.value.UcardName;

    const request: Request_MemberMyCard = {
      SelectMode: 3, // 修改
      AFP_UserFavourite: this.requestCard,
      SearchModel: {
        UserFavourite_ID: parseInt(this.userFavouriteID, 10)
      }
    };
    this.appService.toApi('Member', '1507', request).subscribe((data: Response_MemberMyCard) => {
      this.modal.show('message', { initialState: { success: true, message: '修改完成', showType: 1 } });
    });
    this.bsModalRef.hide();
  }

  /** 刪除卡片 */
  btnDel(): void {
    this.modal.confirm({ initialState: { message: '是否確定解除此會員卡?' } }).subscribe(res => {
      if (res) {
        const request: Request_MemberMyCard = {
          SelectMode: 2,
          AFP_UserFavourite: {
            UserFavourite_ID: parseInt(this.userFavouriteID, 10),
            UserFavourite_CountryCode: 886,
            UserFavourite_TypeCode: this.requestCard.UserFavourite_TypeCode,
            UserFavourite_Type: 2,
            UserFavourite_IsDefault: 0,
            UserFavourite_State: 1,
            UserFavourite_SyncState: 0
          },
          SearchModel: {
            UserFavourite_ID: parseInt(this.userFavouriteID, 10)
          }
        };
        this.appService.toApi('Member', '1507', request).subscribe((data: Response_MemberMyCard) => {
          setTimeout(() => {
            this.modal.show('message', { initialState: { success: true, message: '卡片已刪除', showType: 1 } });
          }, 2000);
          this.router.navigate(['/MemberFunction/MemberCard'],
            {queryParams: {showBack: true, itemCode: this.userFavouriteTypeCode, layerParam: 2}});
          this.requestCard = new AFP_UserFavourite();
        });
      }
      this.bsModalRef.hide();
    });
  }

}
