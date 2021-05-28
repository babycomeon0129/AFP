import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { NgForm } from '@angular/forms';
import { ModalService } from '@app/shared/modal/modal.service';
import { AFP_UserFavourite, AFP_UserReport, Request_MemberMyCard, Response_MemberMyCard } from '@app/modules/member/_module-member';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-member-card-add',
  templateUrl: './member-card-add.component.html',
  styleUrls: ['../../member/member.scss', './member-card-add.component.scss']
})
export class MemberCardAddComponent implements OnInit {
  /** 卡片列表 */
  public cardList: AFP_UserFavourite[] = [];
  /** 新增/修改卡片 ngForm request */
  public requestCard: AFP_UserFavourite = new AFP_UserFavourite();
  /** 卡片類型資料集 */
  public UserReoprtList: AFP_UserReport[] = [];
  /** 卡片類型queryParams  1：一卡通, 11：悠遊卡 */
  public cardItemCode: string;
  /** 卡片標頭 */
  public cardTitle: string;
  /** 可綁定卡片限制 1:一卡 2:多卡 */
  public cardLimit: string;
  /** 最大可綁定卡片數量 */
  public cardLimitMax: string;
  /** 卡片號碼最小長度 */
  public cardNumberMinlength: string;
  /** 卡片號碼提示 */
  public cardNumberWarning = '';
  /** 卡片號碼提示背景 */
  public cardNumberWarningBg = false;
  /** 身分證字號提示 */
  public nationalIDWarning = '';
  /** 同意與否 */
  public isChecked = '';
  /** 表單綁定 */
  inputModel: any = {};

  constructor(public appService: AppService, public modal: ModalService, private router: Router,
              private route: ActivatedRoute, private meta: Meta, private title: Title) {
    this.title.setTitle('我的卡片 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。' });
    this.meta.updateTag({ content: '我的卡片 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。', property: 'og:description' });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.cardItemCode = typeof params.itemCode !== 'undefined' ? '1' : '11';
    });
    this.readCardList();
    this.appService.appShowMobileFooter(false);
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
        this.UserReoprtList = data.AFP_UserReport;
        this.route.queryParams.subscribe(params => {
          this.UserReoprtList.forEach((item) => {
            // 由route queryParams得知新增的卡片類型，並透過queryParams比對UserReoprtList取得卡片名稱
            if (item.UserReport_ItemCode === parseInt(params.itemCode, 10)) {
              this.cardTitle = item.UserReport_ItemName;
              this.cardItemCode = params.itemCode;
              this.cardLimit = item.UserReport_ParamF;
              this.cardLimitMax = item.UserReport_ParamE;
            }
          });
        });
        this.cardItemCode === '1' ? this.cardNumberMinlength = '11' : this.cardNumberMinlength = '10';
      });
    } else {
      this.appService.loginPage();
    }
  }

  /** 新增卡片 */
  onAddCardSubmit(form: NgForm): void {
    this.requestCard.UserFavourite_CountryCode = 886;
    this.requestCard.UserFavourite_Type = 2; // 我的卡片
    this.requestCard.UserFavourite_TypeCode = parseInt(this.cardItemCode, 10); // 卡片類型
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
        if (parseInt(this.cardLimit, 10) === 2 && this.cardList.length <= parseInt(this.cardLimitMax, 10)) {
          this.modal.show('message', {
            initialState: { success: true, message: '綁定成功', note: '【溫馨提醒】本卡尚未完成一卡通記名作業，如需記名請至一卡通官網操作完成。', showType: 1 }
          });
        }
      }, 2000);
      this.router.navigate(['/MemberFunction/MemberCardList'], { queryParams: { showBack: this.appService.showBack } });
      form.resetForm();
    });
  }

  /** 卡片號碼提示 */
  onKeyCardNumber(value: string) {
    if (value === null) {
      this.cardNumberWarning = '卡片號碼不可為空';
    } else {
      if (this.cardItemCode === '11') {
        this.cardNumberWarning = '卡號長度不足10碼';
        this.cardNumberWarningBg = true ;
      } else if (this.cardItemCode === '1') {
        this.cardNumberWarning = '卡號長度不足11碼';
        this.cardNumberWarningBg = true ;
      } else {
        this.cardNumberWarning = '';
        this.cardNumberWarningBg = false ;
      }
    }
  }

  /** 身分證字號提示 */
  onKeyNationalID(value: string) {
    (value === null) ?
      this.nationalIDWarning = '' :
      this.nationalIDWarning = '字首為大寫英文＋9組純數字';
  }

  /** 是否同意個人資料使用 */
  checkOn(event: any) {
    this.isChecked = event.target.checked;
  }

}

