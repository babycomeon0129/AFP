import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { AFP_UserPoint, Response_MemberPoint, Request_MemberPoint } from '@app/modules/member/_module-member';

@Component({
  selector: 'app-m-point',
  templateUrl: './m-point.component.html',
  styleUrls: ['./m-point.component.scss']
})
export class MPointComponent implements OnInit {

  /** 會員點數 Response */
  public info: Response_MemberPoint = new Response_MemberPoint();
  /** 會員點數 */
  public pointHistory: AFP_UserPoint[] = [];
  /** 點數類型 */
  public pointType = 0;

  constructor(public appService: AppService, public router: Router, public modal: ModalService) { }

  ngOnInit(): void {
    if (this.appService.loginState) {
      this.appService.openBlock();
      const getInfo: Request_MemberPoint = {
        User_Code: sessionStorage.getItem('userCode'),
        SelectMode: 4,
        SearchModel: {
          VouChannel_Code: 1111111
        }
      };
      this.appService.toApi('Member', '1509', getInfo).subscribe((info: Response_MemberPoint) => {
        this.info = info;
      });
    }
  }
}
