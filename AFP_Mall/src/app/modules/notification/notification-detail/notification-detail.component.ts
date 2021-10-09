import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { AppService } from '@app/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Request_MemberMsg, Response_MemberMsg, AFP_IMessage } from '@app/_models';
import { Meta, Title } from '@angular/platform-browser';
import { ModalService } from '@app/shared/modal/modal.service';

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
  public videoCheck = false;
  /** 分享至社群時顯示的文字 */
  public textForShare: string;
  /** APP分享使用的url */
  public APPShareUrl: string;

  constructor(public appService: AppService, private router: Router, private route: ActivatedRoute, public modal: ModalService,
              private meta: Meta, private title: Title) {
    this.msgCode = Number(this.route.snapshot.params.IMessage_Code);
  }

  ngOnInit() {
    const request: Request_MemberMsg = {
      SelectMode: 6,
      SearchModel: {
        Message_Code: this.msgCode
      }
    };

    this.appService.toApi('Member', '1517', request).subscribe((data: Response_MemberMsg) => {
      this.msgContent = data.AFP_IMessage;
      this.textForShare = `嘿！我發現了一個超棒的活動要跟你分享喔！趕快進來看看吧！這是「${this.msgContent.IMessage_Title}」，快來跟我一起了解一下吧！`;
      this.APPShareUrl = data.AppShareUrl;
      this.title.setTitle(`${data.AFP_IMessage.IMessage_Title}｜${data.AFP_IMessage.IMessage_MsgCategoryName} - Mobii!`);
      this.meta.updateTag({
        name: 'description',
        content: `${data.AFP_IMessage.IMessage_Desc}`
      });
      this.meta.updateTag({
        content: `${data.AFP_IMessage.IMessage_Title}｜${data.AFP_IMessage.IMessage_MsgCategoryName} - Mobii!`,
        property: 'og:title'
      });
      this.meta.updateTag({
        content: `${data.AFP_IMessage.IMessage_Desc}`,
        property: 'og:description'
      });
      this.meta.updateTag({
        content: `${data.AFP_IMessage.IMessage_SmallImg}`,
        property: 'og:image'
      });
    });
  }

  /** 前往通知頁並打開該分類列表layer */
  goCateList(): void {
    this.router.navigate(['/Notification/NotificationList'],
      {
        state:
        {
          data: {
            cateName: this.msgContent.IMessage_MsgCategoryName,
            cateCode: this.msgContent.IMessage_MsgCategoryCode
          }
        }
      });
  }

  /** 回上一頁
   * 一般遊覽方式下若上一頁不存在(this.appService.prevUrl === '')或是是外站則前往大首頁，
   * 若是用貼網址的方式(window.history.length === 2)，則會直接前往大首頁，
   * 其餘情況則正常回上一頁
   */
  conditionBack(): void {
    if (window.history.length === 2 || this.appService.prevUrl === '') {
      this.router.navigate(['/']);
    } else {
      history.back();
    }
  }

  ngAfterViewChecked(): void {
    // CKEditor 5內嵌影片顯示處理。如果抓到影片則不再執行videoShow()
    if (!this.videoCheck) {
      this.videoShow();
    }

  }

  videoShow(): void {
    const videoView = document.querySelectorAll('iframe[allowfullscreen]');
    if (videoView[0] !== undefined) {
      this.videoCheck = true;
    }
    videoView.forEach(video => {
      video.attributes[1].nodeValue = '';
      video.classList.add('ifrwd');
    });

  }

}
