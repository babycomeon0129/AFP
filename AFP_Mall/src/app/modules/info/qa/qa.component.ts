import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { layerAnimation } from '@app/animations';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';
import { AppService } from '@app/app.service';
import { AFP_QuestionCategory, AFP_QuestionContent, Request_MemberQuestion, Response_MemberQuestion } from '@app/_models';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['../../member/member/member.scss', './qa.scss'],
  animations: [layerAnimation]
})
export class QAComponent implements OnInit {
  /** 是否從APP登入頁進入（若從APP登入頁進入則按回上一頁時APP把此頁關掉） */
  public fromAppLogin: boolean;
  /** 常見問題資料集（render 用） */
  public qaData: AFP_QuestionCategory[];
  /** 常見問題資料集（保留原始檔供篩選用） */
  public qaDataCopy: AFP_QuestionCategory[];
  /** 搜尋目標字串 */
  public searchTarget = '';

  constructor(public appService: AppService, private meta: Meta, private title: Title, public callApp: AppJSInterfaceService, private route: ActivatedRoute, private location: Location) {
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
      SearchModel: {
        QuestionContent_Mode: 1
      }
    };

    this.appService.toApi('Member', '1522', request).subscribe((data: Response_MemberQuestion) => {
      // 如果大分類內沒有任何QA內容，先篩選掉
      this.qaDataCopy = data.List_QuestionCategory.filter((list: AFP_QuestionCategory) => list.List_QuestionContent.length > 0);
      this.qaData = JSON.parse(JSON.stringify(this.qaDataCopy));
      // 如果網址傳參含有目錄編碼，將該目錄的Collapse預設展開
      if (this.route.snapshot.queryParams.catCode !== undefined) {
        const catCode = Number(this.route.snapshot.queryParams.catCode);
        this.qaData.forEach(data => {
          data.Collapse = data.QuestionCategory_Code !== catCode;
          if (!data.Collapse) {
            // 如果網址傳參含有內容編碼，只有符合內容編碼的內容展開
            if (this.route.snapshot.queryParams.contentCode !== undefined) {
              const contentCode = Number(this.route.snapshot.queryParams.contentCode);
              data.List_QuestionContent.forEach(qa => {
                if (qa.QuestionContent_Code === contentCode) {
                  qa.A_Collapse = false;
                } else {
                  qa.A_Collapse = true;
                }
              });
            } else {
              // 網址傳參只有目錄編碼時，符合編碼的目錄ＱA列表都展開
              data.List_QuestionContent.forEach(qa => {
                // 展開問題、答案列表
                qa.A_Collapse = false;
                qa.Q_Collapse = false;
              })
            }
          } else {
            // 目錄關閉的QA都收起來
            data.List_QuestionContent.forEach(qa => {
              qa.A_Collapse = true;
              qa.Q_Collapse = true;
            })
          }
        });
      } else {
        // 網址沒有目錄編碼跟內容編碼時，預設全部ＱＡ列表都收合
        this.qaData.forEach(data => {
          data.Collapse = true;
          data.List_QuestionContent.forEach(content => {
            content.A_Collapse = true;
            content.Q_Collapse = true;
          })
        });
      }
    });
  }

  /** 問題目錄開合 */
  cateCollapse(catCode: number): void {
    this.qaData.forEach(data => {
      if (data.QuestionCategory_Code === catCode) {
        data.Collapse = !data.Collapse;
        data.List_QuestionContent.forEach(qa => {
          qa.Q_Collapse = !qa.Q_Collapse;
          qa.A_Collapse = true;
        });
      }
    });
  }

  /** 問題列表開合 */
  qalistCollapse(catCode: number, contentCode: number): void {
    this.qaData.forEach(data => {
      if (data.QuestionCategory_Code === catCode) {
        data.List_QuestionContent.forEach(qa => {
          if (qa.QuestionContent_Code === contentCode) {
            qa.A_Collapse = !qa.A_Collapse;
          }
        });
      }
    });
  }

  /** 搜尋輸入字串 */
  search(): void {
    // 產生完整原始檔
    const newQa = JSON.parse(JSON.stringify(this.qaDataCopy));
    if (this.searchTarget === '') {
      // 沒有搜尋文字時，預設全部ＱＡ列表都收合
      this.qaData = JSON.parse(JSON.stringify(this.qaDataCopy));
      this.qaData.forEach(data => {
        data.Collapse = true;
        data.List_QuestionContent.forEach(content => {
          content.A_Collapse = true;
          content.Q_Collapse = true;
        });
      });
    } else {
      // 針對問題的標題跟內容(移除掉 html tags 後)做篩選，return 有符合結果的分類做渲染
      this.qaData = newQa.filter((cate: AFP_QuestionCategory) => {
        const newCate = cate.List_QuestionContent.filter((q: AFP_QuestionContent) =>
          q.QuestionContent_Title.includes(this.searchTarget) || q.QuestionContent_Body.replace(/<(.|\n)*?>/g, '').includes(this.searchTarget)
        );
        cate.List_QuestionContent = newCate;
        return newCate.length > 0;
      });
    }
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
