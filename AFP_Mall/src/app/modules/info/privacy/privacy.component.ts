import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';
import { AppService } from '@app/app.service';
import { Request_MemberQuestion, Response_MemberQuestion } from '@app/_models';

@Component({
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent implements OnInit {
  /** 隱私權政策標題 */
  public privacyTitle: string;
  /** 隱私權政策內容 */
  public privacyContent: string;
  /** 是否從APP登入頁進入（若從APP登入頁進入則按回上一頁時APP把此頁關掉） */
  public fromAppLogin: boolean;

  constructor(public appService: AppService, private meta: Meta, private title: Title, private location: Location, public callApp: AppJSInterfaceService) {
    this.title.setTitle('隱私權政策 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 隱私權政策。此隱私權政策描述了 Mobii! 平台如何搜集您的個人資料，以及這些資料將如何被處理及利用。建議您在使用Mobii! 網站、服務及與平台進行交易前，先仔細閱讀此隱私權政策及使用者條款。'});
    this.meta.updateTag({content: '隱私權政策 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 隱私權政策。此隱私權政策描述了 Mobii! 平台如何搜集您的個人資料，以及這些資料將如何被處理及利用。建議您在使用Mobii! 網站、服務及與平台進行交易前，先仔細閱讀此隱私權政策及使用者條款。', property: 'og:description'});
  }

  ngOnInit() {
    if (this.appService.isApp !== null && (this.appService.prevUrl === '/' || this.appService.prevUrl === '')) {
      this.fromAppLogin = true;
    } else {
      this.fromAppLogin = false;
    }

    this.appService.openBlock();
    const request: Request_MemberQuestion = {
      SelectMode: 5,
      SearchModel: {
        QuestionContent_Mode: 11,
        QuestionContent_CategoryCode: 1
      }
    };

    this.appService.toApi('Member', '1522', request).subscribe((data: Response_MemberQuestion) => {
      this.privacyTitle = data.AFP_QuestionContent.QuestionContent_Title;
      this.privacyContent = data.AFP_QuestionContent.QuestionContent_Body;
    });
  }

  /** 若從APP登入頁進入則按回上一頁時APP把此頁關掉 */
  backIf(): void {
    if (this.fromAppLogin) {
      this.callApp.appWebViewClose();
    } else {
      this.location.back();
    }
  }

}
