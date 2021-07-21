import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AppService } from 'src/app/app.service';
import { Request_MemberQuestion, Response_MemberQuestion } from '@app/_models';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss']
})
export class ReturnComponent implements OnInit {
  /** 退貨流程標題 */
  public returnTitle: string;
  /** 退貨流程內容 */
  public returnContent: string;
  /** 是否從APP登入頁進入（若從APP登入頁進入則按回上一頁時APP把此頁關掉） */
  public fromAppLogin = false;

  constructor(public appService: AppService, private meta: Meta, private title: Title, private location: Location) {
    this.title.setTitle('退貨流程 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 退貨流程。描述Mobii! 平台針對商品進行退貨，以及如何處理後續例如款項退回、商品寄回等細節項目。' });
    this.meta.updateTag({ content: '退貨流程 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 退貨流程。描述Mobii! 平台針對商品進行退貨，以及如何處理後續例如款項退回、商品寄回等細節項目。', property: 'og:description' });
  }

  ngOnInit(): void {
    if (this.appService.isApp !== null && (this.appService.prevUrl === '/' || this.appService.prevUrl === '')) {
      this.fromAppLogin = true;
    } else {
      this.fromAppLogin = false;
    }

    this.appService.openBlock();
    const request: Request_MemberQuestion = {
      SelectMode: 5,
      User_Code: sessionStorage.getItem('userCode'),
      SearchModel: {
        QuestionContent_Mode: 11,
        QuestionContent_CategoryCode: 4
      }
    };

    this.appService.toApi('Member', '1522', request).subscribe((data: Response_MemberQuestion) => {
      this.returnTitle = data.AFP_QuestionContent.QuestionContent_Title;
      this.returnContent = data.AFP_QuestionContent.QuestionContent_Body;
    });

  }

  /** 若從APP登入頁進入則按回上一頁時APP把此頁關掉 */
  backIf(): void {
    if (this.fromAppLogin) {
      this.appService.appWebViewClose();
    } else {
      this.location.back();
    }
  }

}
