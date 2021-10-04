import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AFP_UserFavourite, AFP_UserReport, AFP_ADImg,
         Request_MemberMyCard, Response_MemberMyCard } from '@app/modules/member/_module-member';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation } from '@app/animations';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';
@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['../../member/member.scss', './member-card.scss'],
  animations: [layerAnimation]
})
export class MemberCardComponent implements OnInit {
  /** 卡片列表 */
  public cardList: AFP_UserFavourite[] = [];
  /** 卡片列表長度(null:loading, 0:no-data, >0:有資料) */
  public cardListLen: number;
  /** 卡片類型資料集 */
  public cardGeneralList: AFP_UserReport[] = [];
  /** 廣告列表 */
  public cardADList: AFP_ADImg[] = [];
  /** 同頁滑動切換 */
  public layerTrig = 0;
  /** 新增/修改卡片 ngForm request */
  public requestCard: AFP_UserFavourite = new AFP_UserFavourite();
  /** 卡片類型資料集 */
  public UserReportList: AFP_UserReport[] = [];
  /** 卡片類型queryParams  1：一卡通, 11：悠遊卡 */
  public cardItemCode = 1;
  /** 卡片標頭 */
  public cardTitle: string;
  /** 可綁定卡片限制 1:一卡 2:多卡 */
  public cardLimit: number;
  /** 最大可綁定卡片數量 */
  public cardLimitMax: number;
  /** 卡片號碼最小長度 11：一卡通, 10：悠遊卡 */
  public cardNumberMinlength = 11;
  /** 卡片號碼提示背景 */
  public cardNumberWarningBg: boolean;
  /** 同意與否 */
  public isChecked: boolean;
  /** 表單綁定 */
  inputModel = {
    cardNumber: '',
    cardName: '',
    nationalID: ''
  };
  /** 卡片群組縮圖預設 */
  public cardGroupThumbnailDef = '../../img/member/myCardThumbnailDef.png';
  /** 卡片類型縮圖預設 一卡通 */
  public cardThumbnailDef1 = '../../img/member/my_ipass_icon.png';
  /** 卡片類型縮圖預設 悠遊卡 */
  public cardThumbnailDef11 = '../../img/member/my_easycard_icon.png';
  /** 卡號位置圖1 */
  public cardTypeImg1: string;
  /** 卡號位置圖2 */
  public cardTypeImg2: string;

  constructor(public appService: AppService, private oauthService: OauthService, public modal: ModalService, private router: Router,
              private route: ActivatedRoute, private meta: Meta, private title: Title, private callApp: AppJSInterfaceService) {
    this.title.setTitle('我的卡片 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。' });
    this.meta.updateTag({ content: '我的卡片 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。', property: 'og:description' });
    /** 取得route.queryParams參數 */
    this.route.queryParams.subscribe(params => {
      if (typeof params.layerParam !== 'undefined') { this.layerTrig = parseInt(params.layerParam, 10); }
      if (typeof params.itemCode !== 'undefined') { this.cardItemCode = parseInt(params.itemCode, 10); }
      (this.cardItemCode === 1) ? this.cardNumberMinlength = 11 : this.cardNumberMinlength = 10;
    });
  }

  ngOnInit() {
    this.readCardList();
    this.callApp.appShowMobileFooter(false);
  }

  /** 讀取卡片列表 */
  readCardList(): void {
    this.cardListLen = null;
    if (this.appService.loginState) {
      const request: Request_MemberMyCard = {
        User_Code: sessionStorage.getItem('userCode'),
        SelectMode: 4,
        AFP_UserFavourite: {
          UserFavourite_CountryCode: 886,
          UserFavourite_Type: 2, // 我的卡片
          UserFavourite_IsDefault: 0,
          UserFavourite_State: 1,
          UserFavourite_SyncState: 0
        },
        SearchModel: {
          UserFavourite_ID: null
        }
      };
      this.appService.toApi('Member', '1507', request).subscribe((data: Response_MemberMyCard) => {
        this.cardGeneralList = data.AFP_UserReport;
        this.cardADList = data.List_ADImg;
        this.cardList = data.List_UserFavourite;
        this.cardListLen = this.cardList.length;
        this.UserReportList = data.AFP_UserReport;
        this.route.queryParams.subscribe(params => {
          this.UserReportList.forEach((item) => {
            // 由route queryParams得知新增的卡片類型，並透過queryParams比對UserReportList取得卡片名稱
            if (item.UserReport_ItemCode === parseInt(params.itemCode, 10)) {
              this.cardTitle = item.UserReport_ItemName;
              this.cardItemCode = parseInt(params.itemCode, 10);
              this.cardLimit = parseInt(item.UserReport_ParamF, 10);
              this.cardLimitMax = parseInt(item.UserReport_ParamE, 10);
            }
          });
        });
      });
    } else {
      this.oauthService.loginPage(this.appService.pathnameUri);
    }
  }

  /** 新增卡片 */
  onAddCardSubmit(form: NgForm): void {
    this.requestCard.UserFavourite_CountryCode = 886;
    this.requestCard.UserFavourite_Type = 2; // 我的卡片
    this.requestCard.UserFavourite_TypeCode = this.cardItemCode; // 卡片類型
    this.requestCard.UserFavourite_IsDefault = 0;
    this.requestCard.UserFavourite_State = 1;
    this.requestCard.UserFavourite_SyncState = 0;
    this.requestCard.UserFavourite_Text1 = form.value.cardName;
    this.requestCard.UserFavourite_Text2 = form.value.cardNumber;
    this.requestCard.UserFavourite_Text3 = form.value.nationalID;

    this.appService.openBlock();  // 開啟灰屏
    const request: Request_MemberMyCard = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 1,  // 新增
      AFP_UserFavourite: this.requestCard,
      SearchModel: {
        UserFavourite_ID: null
      }
    };
    this.appService.toApi('Member', '1507', request).subscribe((data: Response_MemberMyCard) => {
      setTimeout(() => {
        if (this.cardLimit === 2 && this.cardList.length <= this.cardLimitMax) {
          if (request.AFP_UserFavourite.UserFavourite_Text3 === '') {
            this.modal.show('message', {
              initialState: { success: true, message: '綁定成功', note: '【溫馨提醒】本卡尚未完成卡片記名作業，如需記名請至官網操作完成。', showType: 1 }
            });
          } else {
            this.modal.show('message', {
              initialState: { success: true, message: '綁卡成功', showType: 1 }
            });
          }
        }
      }, 2000);
      /** 路由參數切換 {showBack: true 非原生頁,code 卡片類型(1一卡通、11悠遊卡),layer 功能切換(0我的卡片、1新增卡片、2卡片列表、3榮民卡)} */
      this.router.navigate(['/MemberFunction/MemberCard'], { queryParams: { showBack: true, itemCode: this.cardItemCode, layerParam: 2 } });
      this.readCardList();
      form.resetForm();
    });
  }

  /** 清除表單資料 */
  inputModelClear() {
    this.inputModel = {
      cardNumber: '',
      cardName: '',
      nationalID: ''
    };
  }
}
