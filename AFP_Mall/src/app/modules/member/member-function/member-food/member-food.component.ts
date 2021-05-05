import { Component, OnInit } from '@angular/core';
import { Model_ShareData } from '@app/_models';
import { AppService } from 'src/app/app.service';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-food',
  templateUrl: './member-food.component.html',
  styleUrls: ['../../member/member.scss']
})
export class MemberFoodComponent implements OnInit {
  /** 我的點餐清單 */
  public foodList: AFP_DeliveryOrder[];


  constructor(public appService: AppService, private meta: Meta, private title: Title, private route: ActivatedRoute) {
    this.title.setTitle('我的點餐 - Mobii!');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ content: '我的點餐 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '', property: 'og:description' });
  }

  ngOnInit() {
    this.getFoodList();
  }

  getFoodList(): void {
    if (this.appService.loginState) {
      const request: Request_MemDeliveryOrder = {
        User_Code: sessionStorage.getItem('userCode')
      };
      this.appService.toApi('Member', '1521', request).subscribe((data: Response_MemDeliveryOrder) => {
        this.foodList = data.List_DeliveryOrder;
      });
    } else {
      this.appService.loginPage();
    }
  }

  /** 跳轉至外連連結 */
  goLink(url: string): void {
    window.open(url);
  }

}



/** 會員中心-外送訂單 */
class Request_MemDeliveryOrder extends Model_ShareData {

}

/** 會員中心-外送訂單 */
class Response_MemDeliveryOrder extends Model_ShareData {
  /** 訂單列表 */
  List_DeliveryOrder: AFP_DeliveryOrder[];
}

/** 外送訂單 */
class AFP_DeliveryOrder {
  /** 合作商編碼 */
  DeliveryOrder_PartnerCode: number;
  /** 商店編碼 */
  DeliveryOrder_ECStoreCode: number;
  /** 商店名稱 */
  DeliveryOrder_ECStoreName: number;
  /** 訂單編號 */
  DeliveryOrder_ExtID: string;
  /** 生成日期 */
  DeliveryOrder_ExtDate: Date;
  /** 訂單狀態 */
  DeliveryOrder_ExtState: string;
  /** 訂單詳細URL */
  DeliveryOrder_URL: string;
}
