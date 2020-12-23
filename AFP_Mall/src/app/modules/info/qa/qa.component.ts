import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Request_MemberQuestion, Response_MemberQuestion, AFP_QuestionCategory, AFP_QuestionContent } from '@app/_models';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation } from '../../../animations';
declare var AppJSInterface: any;

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['../../member/member/member.scss', './qa.scss'],
  animations: [layerAnimation]
})
export class QAComponent implements OnInit {
  /** 是否從APP登入頁進入（若從APP登入頁進入則按回上一頁時APP把此頁關掉） */
  public fromAppLogin: boolean;
  /** 常見問題資料集（類別包問題） */
  public qaData: AFP_QuestionCategory[];
  /** 搜尋目標字串 */
  public searchTarget = '';
  /** 原始常見問題資料集 */
  public qaDataCopy: AFP_QuestionCategory[];

  constructor(public appService: AppService, private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('常見問題 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 常見問題。不論是訂單支付、退貨退款、寄件物流、點數 M Points 或優惠券、會員權益等資訊，你都可以在 Mobii! 的常見問題找到答案。' });
    this.meta.updateTag({ content: '常見問題 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 常見問題。不論是訂單支付、退貨退款、寄件物流、點數 M Points 或優惠券、會員權益等資訊，你都可以在 Mobii! 的常見問題找到答案。', property: 'og:description' });
  }

  ngOnInit() {
    if (this.appService.isApp !== null && (this.appService.prevUrl === '/' || this.appService.prevUrl === '')) {
      this.fromAppLogin = true;
    } else {
      this.fromAppLogin = false;
    }

    this.appService.openBlock();
    const request: Request_MemberQuestion = {
      SelectMode: 4,
      User_Code: sessionStorage.getItem('userCode'),
      SearchModel: {
        QuestionContent_Mode: 1
      }
    };

    this.appService.toApi('Member', '1522', request).subscribe((data: Response_MemberQuestion) => {
      // 如果大分類內沒有任何QA內容，先篩選掉
      this.qaDataCopy = data.List_QuestionCategory.filter((list: AFP_QuestionCategory) => list.List_QuestionContent.length > 0);
      this.qaData = JSON.parse(JSON.stringify(this.qaDataCopy));
    });
  }

  /** 搜尋輸入字串 */
  search(): void {
    const newQa = JSON.parse(JSON.stringify(this.qaDataCopy));
    this.qaData = newQa.filter((cate: AFP_QuestionCategory) => {
      const newCate = cate.List_QuestionContent.filter((q: AFP_QuestionContent) => q.QuestionContent_Title.includes(this.searchTarget) || q.QuestionContent_Body.includes(this.searchTarget));
      cate.List_QuestionContent = newCate;
      return newCate.length > 0;
    });
  }

  /** 若從APP登入頁進入則按回上一頁時APP把此頁關掉 */
  backIf(): void {
    if (this.fromAppLogin) {
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        AppJSInterface.back();
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'back' });
      }
    } else {
      history.back();
    }
  }

}
