import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { NgForm } from '@angular/forms';
import { ModalService } from '@app/shared/modal/modal.service';
import { Model_ShareData, AFP_UserFavourite, AFP_UserReport } from '@app/_models';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation,  layerAnimationUp} from '@app/animations';
import CaptchaMini from 'captcha-mini';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['../../member/member.scss', './member-card.scss'],
  animations: [layerAnimation, layerAnimationUp]
})
export class MemberCardComponent implements OnInit {
  /** 卡片列表 */
  public cardList: AFP_UserFavourite[] = [];
  /** 新增/修改卡片 ngForm request */
  public requestCard: AFP_UserFavourite = new AFP_UserFavourite();
  /** captcha 圖形驗證配置 */
  public captcha1 = new CaptchaMini(
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
  /** 同頁滑動切換 0:本頁 1:新增會員卡 2:修改會員卡 */
  public layerTrig = 0;
  /** 提示視窗(往上) 0:本頁 1:提示卡片號碼位置 */
  public layerTrigUp = 0;

  constructor(public appService: AppService, public modal: ModalService, private meta: Meta, private title: Title) {
    this.title.setTitle('我的卡片 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。'});
    this.meta.updateTag({content: '我的卡片 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 我的卡片。你可以新增信用卡、悠遊卡或一卡通等卡片，並在 Mobii! APP 或網頁上，使用這些卡片來購物、支付或乘車。', property: 'og:description'});
  }

  ngOnInit() {
    this.readCardList();
  }

  /** 讀取卡片列表 */
  readCardList(): void {
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

  /** 點擊立即新增卡片 */
  gotoAddCard(): void {
    if (this.appService.loginState) {
      this.layerTrig = 1;
      this.appService.appShowMobileFooter(false);
    } else {
      this.appService.loginPage();
    }
  }

  /** 開啟「新增會員卡」; layerTrigger動畫完成後,再開啟showAddCard */
  showAddCard(): void {
    this.captcha1 = new CaptchaMini();
    // 繪製圖形驗證
    this.captcha1.draw(document.querySelector('#captcha1'), r => {
      this.captchaAns = r;
    });
  }

  /** 檢查卡片號碼長度(須為11或16碼) */
  checkLength(): void {
    if (this.requestCard.UserFavourite_Text2.length === 11 || this.requestCard.UserFavourite_Text2.length === 16) {
      this.cardNumLength = true;
    } else {
      this.cardNumLength = false;
    }
  }

  /** 檢查captcha驗證碼是否輸入正確（不分大小寫） */
  checkCaptcha(): void {
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
      this.readCardList();
      this.layerTrig = 0;
      if (this.requestCard.UserFavourite_ID > 0) {
        this.modal.show('message', { initialState: { success: true, message: '修改完成', showType: 1}});
      } else {
        this.modal.show('message', { initialState: { success: true, message: '綁定成功', note: '【溫馨提醒】本卡尚未完成一卡通記名作業，如需記名請至一卡通官網操作完成。', showType: 1}});
      }
      form.resetForm();
      this.appService.appShowMobileFooter(true);
    });
  }

  /** 點擊卡片編輯按鈕 */
  toUpdateCard(card: AFP_UserFavourite): void {
    this.requestCard.UserFavourite_ID = card.UserFavourite_ID;
    this.onReadCardDetail();
  }

  /** 讀取卡片詳細 */
  onReadCardDetail(): void {
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
  onDeleteCard(form: NgForm): void {
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
          this.layerTrig = 0;
          this.appService.appShowMobileFooter(true);
          this.modal.show('message', { initialState: { success: true, message: '卡片已刪除', showType: 1}});
          this.requestCard = new AFP_UserFavourite(); // 重置此筆資料避免刪除後無法立即新增卡片(卡號會無法輸入&上方一樣會是修改)
          form.resetForm(); // 重置form避免刪除卡片後立刻按新增會出現舊卡片的資料
        });
      }
    });
  }

  /** 重新產生captcha */
  drawCaptcha(): void {
    this.captcha1.clear();
    this.captcha1.draw();
  }

}

/** 會員中心-我的卡片 - RequestModel */
interface Request_MemberMyCard extends Model_ShareData {
  /** 區別操作(通用) 1:新增 2:刪除 3:編輯 4:查詢-列表 5:查詢 - 詳細 */
  SelectMode: number;
  /** 我的卡片 */
  AFP_UserFavourite: AFP_UserFavourite;
  /** SearchModel */
  SearchModel: Search_MemberMyCard;
}

/** 會員中心-我的卡片 - RequestModel SearchModel*/
 interface Search_MemberMyCard {
   /** ID */
  UserFavourite_ID: number;
}

/** 會員中心-我的卡片 - ResponseModel */
interface Response_MemberMyCard extends Model_ShareData {
  /** 我的卡片 列表 */
  List_UserFavourite: AFP_UserFavourite[];
  /** 我的卡片 詳細 */
  AFP_UserFavourite: AFP_UserFavourite;
  /** 自定義參數 - Category=11 */
  AFP_UserReport: AFP_UserReport[];
}
