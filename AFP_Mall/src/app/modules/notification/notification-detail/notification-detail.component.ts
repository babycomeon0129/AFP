import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Request_MemberMsg, Response_MemberMsg, AFP_MemberMsgTitle, AFP_IMessage } from '@app/_models';
import { ModalService } from '../../../shared/modal/modal.service';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.scss']
})
export class NotificationDetailComponent implements OnInit, AfterViewChecked {
  /** 訊息編碼 */
  public msgCode: number;
  /** 訊息詳情 */
  public msgContent: AFP_IMessage;
  public vedioCheck = false;
  /** 分享至社群時顯示的文字 */
  public textForShare: string;

  constructor(public appService: AppService, private router: Router, private route: ActivatedRoute, public modal: ModalService) {
    this.msgCode = Number(this.route.snapshot.params.IMessage_Code);
  }

  ngOnInit() {
    const request: Request_MemberMsg = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 6,
      SearchModel: {
        Message_Code: this.msgCode
      }
    };

    this.appService.toApi('Member', '1517', request).subscribe((data: Response_MemberMsg) => {
      this.msgContent = data.AFP_IMessage;
      this.textForShare = `嘿！我發現了一個超棒的活動要跟你分享喔！趕快進來看看吧！這是「${this.msgContent.IMessage_Title}」，快來跟我一起了解一下吧！
      ${location.href}`;
    });
  }

  /** 前往通知頁並打開該分類列表layer */
  goCateList() {
    this.router.navigate(['/Notification/NotificationList'],
    {state:
      {
        data: {
          cateName: this.msgContent.IMessage_MsgCategoryName,
          cateCode: this.msgContent.IMessage_MsgCategoryCode
        }
      }
    });
  }

  /** 回上一頁
   * （一般遊覽方式下若上一頁不存在或是是外站則前往大首頁，
   * 若是用貼網址的方式則會直接前往大首頁，
   * 其餘情況則正常回上一頁）
   */
  conditionBack() {
    if (this.appService.prevUrl === '/' || this.appService.prevUrl === '') {
      this.router.navigate(['/']);
    } else {
      history.back();
    }
  }

  ngAfterViewChecked(): void {
    // CKEditor 5內嵌影片顯示處理。如果抓到影片則不再執行vedioShow()
    if (!this.vedioCheck) {
      this.vedioShow();
    }

  }

  vedioShow(): void {
    const vedioview = document.querySelectorAll('iframe[allowfullscreen]');
    if (vedioview[0] !== undefined) {
      this.vedioCheck = true;
    }
    vedioview.forEach( vedio => {
      vedio.attributes[1].nodeValue = '';
      vedio.classList.add('ifrwd');
    });

  }

}
