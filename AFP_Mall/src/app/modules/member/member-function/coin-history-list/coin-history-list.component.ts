import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { AFP_UserPoint } from '@app/_models';
import { Request_MemberPoint, Response_MemberPoint } from '../../_module-member';

@Component({
  selector: 'app-coin-history-list',
  templateUrl: './coin-history-list.component.html',
  styleUrls: ['./coin-history-list.component.scss']
})
export class CoinHistoryListComponent implements OnInit {
  /** 會員點數 Response */
  public info: Response_MemberPoint = new Response_MemberPoint();
  /** 會員點數列表 */
  public pointHistory: AFP_UserPoint[] = [];
  /** 點數類型 */
  public pointType = 0;

  constructor(public appService: AppService, public router: Router) { }

  ngOnInit() {
  }

  /** 點數紀錄
   * pointType點數類型 0: 待入帳，1: 獲得，11: 已使用
   */
  getHistory(): void {
    if (!this.appService.loginState) {
      this.appService.logoutModal();
    } else {
      this.appService.openBlock();
      const getHistory: Request_MemberPoint = {
        SelectMode: 5,
        SearchModel: {
          UserPoint_Type: this.pointType
        }
      };
      this.appService.toApi('Member', '1509', getHistory).subscribe((point: Response_MemberPoint) => {
        this.pointHistory = point.List_UserPoint;
      });
    }
  }
}
