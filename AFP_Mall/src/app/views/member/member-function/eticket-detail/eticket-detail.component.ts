import { Component, OnInit } from '@angular/core';
import { Request_MemberTicket, Response_MemberTicket, AFP_UserTicket, AFP_Product } from '../../../../_models';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-eticket-detail',
  templateUrl: './eticket-detail.component.html',
  styleUrls: ['../../../../../dist/style/offers.min.css']
})
export class ETicketDetailComponent implements OnInit {
  /** 票券編碼 */
  public ticketCode: number;
  /** 使用者票券 */
  public userTicket: AFP_UserTicket;
  /** 票券商品 */
  public ticketProd: AFP_Product;
  public showBackBtn = false; // APP特例處理

  constructor(private route: ActivatedRoute, public appService: AppService) {
    this.ticketCode = this.route.snapshot.params.UserTicket_Code;
    // APP特例處理: 若是從會員進來則顯示返回鍵
    if (this.route.snapshot.queryParams.showBack !== undefined && this.route.snapshot.queryParams.showBack === 'true') {
      this.showBackBtn = true;
    }
  }

  ngOnInit() {
    this.readTicket();
  }

  readTicket() {
    const request: Request_MemberTicket = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 5, // 查詢詳細
      SearchModel: {
        UserTicket_Code: this.ticketCode
      }
    };

    this.appService.toApi('Member', '1508', request).subscribe((data: Response_MemberTicket) => {
      this.userTicket = data.AFP_UserTicket;
      this.ticketProd = data.AFP_Product;
    });
  }

}
