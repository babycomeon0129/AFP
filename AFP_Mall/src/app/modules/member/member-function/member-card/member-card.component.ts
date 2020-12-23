import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { NgForm } from '@angular/forms';
import { ModalService } from '../../../../shared/modal/modal.service';
import { Model_ShareData, AFP_UserFavourite, AFP_UserReport } from '@app/_models';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation } from '../../../../animations';
import CaptchaMini from 'captcha-mini';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['../../member/member.scss', '../../../../../styles/member-function.min.css'],
  animations: [layerAnimation]
})
export class MemberCardComponent implements OnInit, AfterViewInit {
  /** 卡片列表 */
  public cardList: AFP_UserFavourite[] = [];
  /** 新增/修改卡片 ngForm request */
  public requestCard: AFP_UserFavourite = new AFP_UserFavourite();
  /** captcha 圖形驗證配置 */
  public captcha1: CaptchaMini = new CaptchaMini(
    {
      lineWidth: 1, // 線條寬度
      lineNum: 3, // 線條數量
      dotR: 1, // 點的半徑
      dotNum: 8, // 點的數量
      preGroundColor: [10, 80], // 前景色區間
      backGroundColor: [150, 250], // 背景色區間
      fontSize: 30, // 字體大小
      fontFamily: ['Georgia', 'Helvetica', 'System'], // 字體類型
      fontStyle: 'fill', // 字體繪製方法，有fill和stroke
      content: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // 驗證碼內容
      length: 4 // 驗證碼長度
    }
  );
  /** captcha 驗證碼 */
  public captchaAns: string;
  /** captcha 使用者輸入 */
  public captchaInput: string;
  /** captcha 輸入正確與否 */
  public captchaCorrect = false;
  /** 卡片號碼長度是否正確(11或16碼) */
  public cardNumLength = false;

  constructor(public appService: AppService, public modal: ModalService, private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('我的卡片 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。'});
    this.meta.updateTag({content: '我的卡片 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。', property: 'og:description'});
  }

  ngOnInit() {
    this.readCardList();
  }

  /** 讀取卡片列表 */
  readCardList() {
    this.appService.openBlock();
    const request: Request_MemberMyCard = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 4,
      AFP_UserFavourite: {
        UserFavourite_CountryCode: 886,
        UserFavourite_Type: 2,
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
    });
  }

  /** 開啟「新增會員卡」 */
  showAddCard() {
    // 繪製圖形驗證
    this.captcha1.draw(document.querySelector('#captcha1'), r => {
      this.captchaAns = r;
    });
    this.appService.callLayer('.mycardadd');
  }

  /** 檢查卡片號碼長度(須為11或16碼) */
  checkLength() {
    if (this.requestCard.UserFavourite_Text2.length === 11 || this.requestCard.UserFavourite_Text2.length === 16) {
      this.cardNumLength = true;
    } else {
      this.cardNumLength = false;
    }
  }

  /** 檢查captcha驗證碼是否輸入正確（不分大小寫） */
  checkCaptcha() {
    if (this.captchaAns.toLowerCase() === this.captchaInput.toLowerCase()) {
      this.captchaCorrect = true;
    } else {
      this.captchaCorrect = false;
    }
  }

  /** 新增/修改卡片 */
  onAddCardSubmit(form: NgForm): void {
    this.requestCard.UserFavourite_CountryCode = 886;
    this.requestCard.UserFavourite_Type = 2;
    this.requestCard.UserFavourite_TypeCode = 1;
    this.requestCard.UserFavourite_IsDefault = 0;
    this.requestCard.UserFavourite_State = 1;
    this.requestCard.UserFavourite_SyncState = 0;

    this.appService.openBlock();
    const request: Request_MemberMyCard = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: (this.requestCard.UserFavourite_ID > 0) ? 3 : 1,
      AFP_UserFavourite: this.requestCard,
      SearchModel: {
        UserFavourite_ID:  (this.requestCard.UserFavourite_ID > 0) ? this.requestCard.UserFavourite_ID : null
      }
    };

    this.appService.toApi('Member', '1507', request).subscribe((data: Response_MemberMyCard) => {
      // const msg = (this.requestCard.UserFavourite_ID > 0) ? '修改完成' : '綁定成功';
      this.readCardList();
      this.appService.backLayer();
      // this.modal.show('message', { initialState: { success: true, message: msg, showType: 1}});
      if (this.requestCard.UserFavourite_ID > 0) {
        this.modal.show('message', { initialState: { success: true, message: '修改完成', showType: 1}});
      } else {
        this.modal.show('message', { initialState: { success: true, message: '綁定成功', note: '【溫馨提醒】本卡尚未完成一卡通記名作業，如需記名請至一卡通官網操作完成。', showType: 1}});
      }
      form.resetForm();
    });
  }

  /** 點擊卡片編輯按鈕 */
  toUpdateCard(card) {
    this.requestCard.UserFavourite_ID = card.UserFavourite_ID;
    this.onReadCardDetail();
    this.appService.callLayer('.mycardedit');
  }

  /** 讀取卡片詳細 */
  onReadCardDetail() {
    const request: Request_MemberMyCard = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 5,
      AFP_UserFavourite: {
        UserFavourite_CountryCode: 886,
        UserFavourite_Type: 2,
        UserFavourite_TypeCode: 1,
        UserFavourite_IsDefault: 0,
        UserFavourite_State: 1,
        UserFavourite_SyncState: 0
      },
      SearchModel: {
        UserFavourite_ID: this.requestCard.UserFavourite_ID
      }
    };
    this.appService.toApi('Member', '1507', request).subscribe((data: Response_MemberMyCard) => {
      this.requestCard = data.AFP_UserFavourite;
    });
  }

  /** 刪除卡片 */
  onDeleteCard(form: NgForm) {
    this.modal.confirm({initialState: {message: '是否確定解除此會員卡?'}}).subscribe(res => {
      if (res) {
        const request: Request_MemberMyCard = {
          User_Code: sessionStorage.getItem('userCode'),
          SelectMode: 2,
          AFP_UserFavourite: {
            UserFavourite_ID: this.requestCard.UserFavourite_ID,
            UserFavourite_CountryCode: 886,
            UserFavourite_Type: 2,
            UserFavourite_TypeCode: 1,
            UserFavourite_IsDefault: 0,
            UserFavourite_State: 1,
            UserFavourite_SyncState: 0
          },
          SearchModel: {
            UserFavourite_ID: this.requestCard.UserFavourite_ID
          }
        };
        this.appService.toApi('Member', '1507', request).subscribe((data: Response_MemberMyCard) => {
          this.readCardList();
          this.appService.backLayer();
          this.modal.show('message', { initialState: { success: true, message: '卡片已刪除', showType: 1}});
          this.requestCard = new AFP_UserFavourite(); // 重置此筆資料避免刪除後無法立即新增卡片(卡號會無法輸入&上方一樣會是修改)
          form.resetForm(); // 重置form避免刪除卡片後立刻按新增會出現舊卡片的資料
        });
      }
    });
  }

  /** 重新產生captcha */
  drawCaptcha() {
    this.captcha1.clear();
    this.captcha1.draw();
  }

  ngAfterViewInit() {
    // tslint:disable-next-line: max-line-length
    (($('.wrap').height()) < ($(window).height())) ? ($('footer.for-pc').css('position', 'absolute')) : ($('footer.for-pc').css('position', 'relative'));
  }

}

// tslint:disable: class-name
export interface Request_MemberMyCard extends Model_ShareData {
  SelectMode: number;
  AFP_UserFavourite: AFP_UserFavourite;
  SearchModel: Search_MemberMyCard;
}

export interface Search_MemberMyCard {
  UserFavourite_ID: number;
}

export interface Response_MemberMyCard extends Model_ShareData {
  List_UserFavourite: AFP_UserFavourite[];
  AFP_UserFavourite: AFP_UserFavourite;
  AFP_UserReport: AFP_UserReport[];
}
