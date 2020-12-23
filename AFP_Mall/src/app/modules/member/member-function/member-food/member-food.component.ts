import { Component, OnInit } from '@angular/core';
import { Model_ShareData} from '@app/_models';
import { AppService } from 'src/app/app.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-member-food',
  templateUrl: './member-food.component.html',
  styleUrls: ['../../member/member.scss', '../../../../../styles/member-function.min.css']
})
export class MemberFoodComponent implements OnInit {
  /** 我的點餐清單 */
  public foodList: AFP_DeliveryOrder[];
   /** APP特例處理 */
   public showBackBtn = false;


  constructor(public appService: AppService, private meta: Meta, private title: Title, private route: ActivatedRoute) {
    this.title.setTitle('我的點餐 - Mobii!');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ content: '我的點餐 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '', property: 'og:description' });
  }

  ngOnInit() {
    this.getFoodList();
    // 從會員中心進來則隱藏返回鍵
    if (this.route.snapshot.queryParams.showBack === 'true') {
      this.showBackBtn = true;
    }
  }

  getFoodList() {
    const request: Request_MemDeliveryOrder = {
      User_Code: sessionStorage.getItem('userCode')
    };
    this.appService.toApi('Member', '1521', request).subscribe((data: Response_MemDeliveryOrder) => {
      this.foodList = data.List_DeliveryOrder;
    });
  }

  /** 跳轉至外連連結 */
  goLink(url: string) {
    window.open(url);
  }


}



class Request_MemDeliveryOrder extends Model_ShareData {

}

class Response_MemDeliveryOrder extends Model_ShareData {
  List_DeliveryOrder: AFP_DeliveryOrder[];
}

class AFP_DeliveryOrder {
  DeliveryOrder_PartnerCode: number;
  DeliveryOrder_ECStoreCode: number;
  DeliveryOrder_ECStoreName: number;
  DeliveryOrder_ExtID: string;
  DeliveryOrder_ExtDate: Date;
  DeliveryOrder_ExtState: string;
  DeliveryOrder_URL: string;
}
