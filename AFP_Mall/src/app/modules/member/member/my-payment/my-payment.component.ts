import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { Model_ShareData, AFP_UserFavourite } from '@app/_models';
import { ModalService } from '@app/shared/modal/modal.service';
import { layerAnimation } from '@app/animations';

@Component({
  selector: 'app-my-payment',
  templateUrl: './my-payment.component.html',
  styleUrls: ['../member.scss', './my-payment.scss'],
  animations: [layerAnimation]
})
export class MyPaymentComponent implements OnInit {
  /** 付款設定 */
  public paymentData: AFP_UserFavourite[] = [];
  /** 信用卡詳細 */
  public paymentDetail: AFP_UserFavourite;
  /** 開啟層：0 列表、1 新增信用卡、2 信用卡詳細 */
  public shownLayer = 0;

  constructor(public appService: AppService, public modal: ModalService) {
  }

  ngOnInit() {
    this.onGetPaymentList();
  }

  /** 付款設定 */
  onGetPaymentList(): void  {
    const request: Request_MemberPaySetting = {
      SelectMode: 4
    };

    this.appService.toApi('Member', '1504', request).subscribe((data: Response_MemberPaySetting) => {
      this.paymentData = data.List_UserFavourite;
    });
  }

  /** 顯示信用卡詳細
   * @param card 信用卡
   */
  showPaymentDeatail(card: AFP_UserFavourite): void  {
    this.paymentDetail = card;
  }

  /** 刪除信用卡
   * @param itemId 信用卡ID
   */
  onDelCard(itemId: number): void  {
    this.modal.confirm({ initialState: { message: '請問是否要刪除這個付款方式?' } }).subscribe(res => {
      if (res) {
        const request: Request_MemberPaySetting = {
          SelectMode: 2,
          AFP_UserFavourite: {
            UserFavourite_ID: itemId
          }
        };
        this.appService.toApi('Member', '1504', request).subscribe(() => {
          this.onGetPaymentList();
          this.shownLayer = 0;
        });
      }
    });
  }

  /** 變更預設信用卡 */
  toggleDefaultCard(): void  {
    if (this.paymentDetail.UserFavourite_IsDefault === 1) {
      this.paymentDetail.UserFavourite_IsDefault = 0;
    } else {
      this.paymentDetail.UserFavourite_IsDefault = 1;
    }

    const request: Request_MemberPaySetting = {
      SelectMode: 3,
      AFP_UserFavourite: {
        UserFavourite_ID: this.paymentDetail.UserFavourite_ID,
        UserFavourite_IsDefault: this.paymentDetail.UserFavourite_IsDefault
      }
    };

    this.appService.toApi('Member', '1504', request).subscribe(() => {
      this.onGetPaymentList();
    });
  }

}

/** 會員中心-付款設定 */
class Request_MemberPaySetting extends Model_ShareData {
  /** 我的收藏 */
  AFP_UserFavourite?: AFP_UserFavourite;
}

/** 會員中心-付款設定  */
interface Response_MemberPaySetting extends Model_ShareData {
  /** 我的收藏 列表 */
  List_UserFavourite: AFP_UserFavourite[];
}
