import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { ModalService } from '@app/shared/modal/modal.service';
@Component({
  selector: 'app-m-point',
  templateUrl: './m-point.component.html',
  styleUrls: ['./m-point.component.scss']
})
export class MPointComponent implements OnInit {

  /** 會員點數 */
  @Input() totalPoing: string;
  /** 即將到期魔幣 */
  @Input() daylinePoint: string;
  /** 即將到期時間 */
  @Input() dayline: string;
  /** 點數紀錄顯示與否 */
  @Input() pointShow: boolean;

  constructor(public appService: AppService, public router: Router, public modal: ModalService) { }

  ngOnInit() {
  }

  /** 到點數紀錄頁 */
  goToMpointHistory(): void {
    if (!this.appService.loginState) {
      this.appService.logoutModal();
    } else {
      this.router.navigate(['/MemberFunction/CoinHistoryList'], { queryParams: { showBack: true}});
    }
  }
}
