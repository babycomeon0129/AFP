import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Meta, Title } from '@angular/platform-browser';
import { Request_MemberTicket, Response_MemberTicket, AFP_UserTicket } from '@app/_models';
import { layerAnimation } from '../../../../animations';

@Component({
  selector: 'app-member-ticket',
  templateUrl: './member-ticket.component.html',
  styleUrls: ['../../member/member.scss'],
  animations: [ layerAnimation ]
})
export class MemberTicketComponent implements OnInit {
  /** 票券列表 */
  public ticketList: AFP_UserTicket[];
  /** 搜尋輸入文字 */
  public searchText;
  /** 當前所選使用狀態列表 1: 可用, 2: 歷史 （歷史票券不可前往詳細） */
  public listType: number;
  /** 同頁滑動切換 */
  public layerTrig = 0;

  constructor(public appService: AppService, private router: Router, private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('我的車票 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 我的車票。這裡你會看到你從 Mobii! APP 裡購買的票券，包括遊樂園、博物館、美術館等門票。'});
    this.meta.updateTag({content: '我的車票 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 我的車票。這裡你會看到你從 Mobii! APP 裡購買的票券，包括遊樂園、博物館、美術館等門票。', property: 'og:description'});
  }

  ngOnInit() {
    this.readTicketList(1);
  }

  /** 讀取票券列表
   * @param usedType 使用狀態 1: 可用, 2: 歷史
   */
  readTicketList(usedType: number) {
    this.listType = usedType;
    const request: Request_MemberTicket = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 4, // 查詢列表
      SearchModel: {
        UserTicket_UsedType: usedType
      }
    };

    this.appService.toApi('Member', '1508', request).subscribe((data: Response_MemberTicket) => {
      this.ticketList = data.List_UserTicket;
    });
  }

  /** 前往電子票證詳細 */
  goToDetail(code: number) {
    if (this.listType === 1) {
      this.router.navigate(['/MemberFunction/ETicketDetail', code]);
    }
  }

  /** 同頁滑動切換 */
  layerToggle(e) {
    this.layerTrig = e;
  }
}
