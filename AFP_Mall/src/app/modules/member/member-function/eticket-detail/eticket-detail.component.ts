import { Component, OnInit } from '@angular/core';
import { Request_MemberTicket, Response_MemberTicket, AFP_UserTicket, AFP_Product } from '@app/_models';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '@app/app.service';
import { layerAnimation} from '@app/animations';

@Component({
  selector: 'app-eticket-detail',
  templateUrl: './eticket-detail.component.html',
  styleUrls: ['../../member/member.scss', './eticket-detail.scss'],
  animations: [layerAnimation]
})
export class ETicketDetailComponent implements OnInit {
  /** 票券編碼 */
  public ticketCode: number;
  /** 使用者票券 */
  public userTicket: AFP_UserTicket;
  /** 票券商品 */
  public ticketProd: AFP_Product;
  /** 同頁滑動切換 0: 本頁 1:使用票券 */
  public layerTrig = 0;

  constructor(private route: ActivatedRoute, public appService: AppService) {
    this.ticketCode = this.route.snapshot.params.UserTicket_Code;
  }

  ngOnInit() {
    this.readTicket();
  }

  readTicket(): void {
    const request: Request_MemberTicket = {
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
