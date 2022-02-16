import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';
import { AppService } from '@app/app.service';
import { Request_MemberQuestion, Response_MemberQuestion } from '@app/_models';

@Component({
  selector: 'app-mpoints',
  templateUrl: './mpoints.component.html',
  styleUrls: ['./mpoints.component.scss']
})
export class MPointsComponent implements OnInit {
  /** 點數說明標題 */
  public mPointsTitle: string;
  /** 點數說明內容 */
  public mPointsContent: string;
  /** 是否從APP登入頁進入（若從APP登入頁進入則按回上一頁時APP把此頁關掉） */
  public fromAppLogin = false;

  constructor(public appService: AppService, private meta: Meta, private title: Title, private location: Location, private callApp: AppJSInterfaceService) {
    this.title.setTitle('點數說明 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 點數說明。M Points 是Mobii! 平台推出的會員專屬回饋點數，消費者於Mobii!官方認可商城賣場內交易，且透過Mobii!認可的付款方式交易成功後，即可獲得M Points。' });
    this.meta.updateTag({ content: '點數說明 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 點數說明。M Points 是Mobii! 平台推出的會員專屬回饋點數，消費者於Mobii!官方認可商城賣場內交易，且透過Mobii!認可的付款方式交易成功後，即可獲得M Points。', property: 'og:description' });
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
        QuestionContent_CategoryCode: 5
      }
    };

    this.appService.toApi('Member', '1522', request).subscribe((data: Response_MemberQuestion) => {
      this.mPointsTitle = data.AFP_QuestionContent.QuestionContent_Title;
      this.mPointsContent = data.AFP_QuestionContent.QuestionContent_Body;
    });
  }

  /** 若從APP登入頁進入則按回上一頁時APP把此頁關掉 */
  backIf(): void {
    if (this.fromAppLogin) {
      this.callApp.appShowMobileFooter(true);
      this.callApp.appWebViewClose();
    } else {
      this.location.back();
    }
  }

}
