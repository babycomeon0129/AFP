import { style } from '@angular/animations';
import { element } from 'protractor';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Request_MemberMsg, Response_MemberMsg, AFP_MemberMsgTitle, AFP_IMessage } from '@app/_models';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation } from '../../../animations';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.scss'],
  animations: [layerAnimation]

})
export class NotificationComponent implements OnInit, OnDestroy {

  /** 主頁：通知分類 */
  public categoryMsg: AFP_MemberMsgTitle[];
  /** 主頁：最新通知 */
  public latestList: AFP_IMessage[];
  /** 次頁：所選通知分類名稱 */
  public SCategoryName: string;
  /** 次頁：所選通知分類列表容器 */
  public SCategoryList: AFP_IMessage[];
  /** 同頁滑動切換 0:本頁 1:次頁 */
  public layerTrig = 0;
  /** JustKaUrl網址初始 */
  public JustKaUrl = '';

  constructor(public appService: AppService, private router: Router, private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('通知 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 通知。如果你在 Mobii! 平台上購物，通知則會顯示你的訂單相關進度，包括商品的出貨狀態、送貨狀態。或者如果有未解的任務，Mobii! 平台亦會透過通知來提醒使用者相關訊息。' });
    this.meta.updateTag({ content: '通知 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 通知。如果你在 Mobii! 平台上購物，通知則會顯示你的訂單相關進度，包括商品的出貨狀態、送貨狀態。或者如果有未解的任務，Mobii! 平台亦會透過通知來提醒使用者相關訊息。', property: 'og:description' });
  }

  ngOnInit() {

    const request: Request_MemberMsg = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 4,
      SearchModel: {
        MsgCategory_Code: null
      }
    };

    this.appService.toApi('Member', '1517', request).subscribe((data: Response_MemberMsg) => {
      this.categoryMsg = data.List_MsgTitle;
      this.latestList = data.List_Message;
      this.JustKaUrl = data.JustKaUrl;
      // 將通知都視為已讀
      this.appService.pushCount = 0;
    });
    // 若是從訊息詳情點擊分類進來則直接開啟該分類列表
    if (history.state.data !== undefined) {
      this.showCategoryList(history.state.data.cateName, history.state.data.cateCode);
    }
  }

  /**
   * 於次頁顯示所選分類通知列表
   * @param categoryName 所選通知分類名稱
   * @param categoryCode 所選通知分類編碼
   */
  showCategoryList(categoryName: string, categoryCode: number) {
    this.SCategoryName = categoryName;
    const request: Request_MemberMsg = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 5,
      SearchModel: {
        MsgCategory_Code: categoryCode
      }
    };

    this.appService.toApi('Member', '1517', request).subscribe((data: Response_MemberMsg) => {
      this.SCategoryList = data.List_Message;
      this.layerTrig = 1;
    });
  }

  /**
   * 開合單則通知
   * @param msg 通知
   */
  unfoldItem(msg: AFP_IMessage) {
    // 若為訂單通知，則前往訂單，否則僅做開合
    if (msg.IMessage_OrderNo != null) {
      if (msg.IMessage_OrderType === 21) {
        this.router.navigate(['/MemberFunction/ETicketOrderDetail', msg.IMessage_OrderNo]);
      } else {
        this.router.navigate(['/MemberFunction/MyOrderDetail', msg.IMessage_OrderNo]);
      }
    }
    // TODO: [寫法]activeStatus 預設其實為undefined不是false
    msg.activeStatus = !msg.activeStatus;
  }

  ngOnDestroy() {
    this.layerTrig = 0; // 避免此頁callLayer後會直接到別的頁面會造成callLayer失效
  }

}
