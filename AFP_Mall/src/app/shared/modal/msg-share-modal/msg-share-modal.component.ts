import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AppService } from 'src/app/app.service';

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

  constructor(public bsModalRef: BsModalRef, public appService: AppService) {
  }

  ngOnInit() {
    this.pageUrl = decodeURI(location.href);
  }

  closeModal(): void {
    this.bsModalRef.hide();
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
