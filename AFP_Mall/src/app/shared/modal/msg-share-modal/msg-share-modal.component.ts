import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { Request_MemberMsg, Response_MemberMsg } from '@app/_models';
import { environment } from '@env/environment';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-msg-share-modal',
  templateUrl: './msg-share-modal.component.html'
})
export class MsgShareModalComponent implements OnInit {
  FBAppID = environment.FBApiKey;
  /** 分享頁的 url */
  pageUrl: string;
  /** 分享時所帶文字 */
  sharedText: string;
  /** 訊息視窗切換 */
  subModal: number;
  /** 分享活動頁面的該頁面活動編碼（目前僅限於活動頁分享，用於計算分享次數） */
  msgCode: number;
  constructor(public bsModalRef: BsModalRef, private appService: AppService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.subModal = 0;
    this.pageUrl = decodeURI(location.href).split('?')[0];
    this.sharedText = this.sharedText.replace(/[<>&'":]/g, '');
  }

  /**
   * 分享此頁（複製網址）
   * @param urlValue 網址
   * 若只需單純複製當前網址則不需傳值
   * 使用頁面: 周邊詳細、商品詳細、商家頁
   */
  onCopyUrl(urlValue?: string): void {
    const el = document.createElement('textarea');
    if (urlValue === undefined) {
      el.value = location.href;
    } else {
      el.value = urlValue;
    }
    // 若設備是iphone, ipod 或 ipad且iOS版本比12.4舊
    if (this.iOSversion() !== null && this.iOSversion() <= 12.4) {
      const oldContentEditable = el.contentEditable;
      const oldReadOnly = el.readOnly;
      const range = document.createRange();

      el.contentEditable = 'true';
      el.readOnly = false;
      range.selectNodeContents(el);

      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(range);

      el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

      el.contentEditable = oldContentEditable;
      el.readOnly = oldReadOnly;

      document.execCommand('copy');
    } else {
      // 舊寫法(在iPhone iOS 12.4或之前版本的chrome不能用)
      el.setAttribute('contenteditable', 'true');
      // el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
    }
    document.body.removeChild(el);
    this.subModal = 1;
    // this.bsModal.show(MessageModalComponent,{ initialState: { success: true, message: '已複製網址!', showType: 1 } });
  }

  /** 計算活動頁分享次數 */
  shareTimes(): void {
    // 只在活動詳細頁作用
    if (this.router.url.includes('NotificationDetail')) {
      const request: Request_MemberMsg = {
        SelectMode: 7,
        SearchModel: {
          Message_Code: this.msgCode
        }
      }
      this.appService.toApi('Member', '1517', request).subscribe((data: Response_MemberMsg) => {});
    }
  }

  /** 取得設備iOS版本
   * （若設備非iphone, ipod 或 ipad，則回傳null）
   */
  iOSversion(): number {
    // 若設備是 iphone, ipod or ipad
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null) {
      const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      const d = {
        status: true,
        version: parseInt(v[1], 10),
        info: parseInt(v[1], 10) + '.' + parseInt(v[2], 10)
      };
      return Number(d.info);
    } else {
      return null;
    }
  }

  /**
   * FB Share Dialog display的方式
   *
   * PC網頁版
   *  要使用Facebook SDK for JavaScript才有辦法強制設為 "popup"（預設為iframe）
   *  若使用URL redirect則只能是 "page"
   * 手機網頁版只能是 "touch"
   */

}
