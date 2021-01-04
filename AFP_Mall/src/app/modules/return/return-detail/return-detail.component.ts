import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AFP_ECStore, AFP_MemberOrder, AFP_ItemInfoPart, AFP_UserFavourite, Model_ShareData,
        AFP_Services, AFP_UserReport, AFP_DealInfo
        } from '@app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-return-detail',
  templateUrl: './return-detail.component.html',
  styleUrls: ['../../member/member/member.scss',
              '../../member/member-function/member-order/member-order.scss',
              '../../order/shopping-order/shopping-order.scss']
})
export class ReturnDetailComponent implements OnInit {
  /** 客服單編號 */
  public ServiceTableNO = 0;
  /** 客服單 */
  public ServiceModel: AFP_Services = new AFP_Services();
  /** 訂單商品 */
  public ListItemInfo: AFP_ItemInfoPart[] = [];
  /** 賣家 */
  public ECStore: AFP_ECStore;
  /** 訂單資訊 */
  public Order: AFP_MemberOrder;
  /** 商品類型是否都為電子票證（若是則有欄位不顯示） */
  public allETicket = false;
  /** 退款Title */
  public StrTitle = '退貨';
  /** 退款SubTitle */
  public StrSubTitle = '退貨申請中，商店將盡快回覆您！';
  /** 同頁滑動切換 */
  public layerTrig = 0;

  constructor(private route: ActivatedRoute, public appService: AppService, private router: Router) {
    this.ServiceTableNO = this.route.snapshot.params.Services_TableNo;

    const request: Request_MemberServices = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 2, // 詳細查詢
      SearchModel: {
        Services_TableNo: this.ServiceTableNO
      }
    };

    this.appService.toApi('Member', '1515', request).subscribe((data: Response_MemberServices) => {
      this.ServiceModel = data.AFP_Services;
      this.ListItemInfo = data.List_ItemInfoPart;
      this.ECStore = data.AFP_ECStore;
      this.Order = data.AFP_MemberOrder;
      if (this.ListItemInfo.every(x => x.ItemInfoPart_Type === 21)) {
        this.allETicket = true;
      }
      this.showServiceText(this.ServiceModel);
    });
  }

  /**
   * 客服單Title及下方文字
   *
   * @param ServiceModel 客服單
   */
  showServiceText(ServiceModel: AFP_Services) {
    if (this.allETicket) {
      this.StrTitle = '退款處理中';
      this.StrSubTitle = '電子票券已退回，退款處理中！';
    }
    switch (ServiceModel.Services_HandleState) {
      case 3: {
        this.StrSubTitle = '商家不同意退貨！';
        break;
      }
      case 4: {
        this.StrSubTitle = '退貨申請已完成！';
        if (this.allETicket ) {
          if (this.ServiceModel.Services_RefundState === 3) {
          this.StrTitle = '退款申請完成';
          this.StrSubTitle = '已完成退款申請，款項將退回原付款之信用卡，實際退款時間依發卡銀行處理時間為準';
          } else {
            this.StrSubTitle = '電子票券已退回，退款處理中！';
          }
        }
        break;
      }
    }
  }

  /**
   *  顯示退貨理由
   *
   * @param reasonNo 理由代碼
   */
  showReason(reasonNo: number): string {
    let reson = '請選擇原因';
    if (typeof reasonNo !== 'undefined') {
      switch (reasonNo) {
        case 1: {
          reson = '我還沒收到商品';
          break;
        }
        case 2: {
          reson = '商品缺件、有瑕疵';
          break;
        }
        case 3: {
          reson = '商家寄錯商品';
          break;
        }
        case 4: {
          reson = '商品故障';
          break;
        }
        // case 5: {
        //   reson = '商品不如預期';
        //   break;
        // }
        case 6: {
          reson = '想要的日期/時段不易預約';
          break;
        }
        case 7: {
          reson = '價格/條件劣於其他通路';
          break;
        }
        case 8: {
          reson = '原訂計畫取消';
          break;
        }
        case 9: {
          reson = '現場有更優惠促銷';
          break;
        }
        case 10: {
          reson = '店家要求現場直接付費';
          break;
        }
        case 255: {
          reson = '其他';
          break;
        }
      }
    }
    return reson;
  }

  /** 前往對話 */
  goToDialog(): void {
    this.router.navigate(['/Return/ReturnDialog', this.ServiceModel.Services_TableNo],
      {queryParams: { ECStoreName: this.ECStore.ECStore_ShowName, HandleState: this.ServiceModel.Services_HandleState }}
    );
  }

  /** 同頁滑動切換 */
  layerToggle(e: number) {
    this.layerTrig = e;
  }
  ngOnInit() {
  }

}

export class Request_MemberServices extends Model_ShareData {
  constructor() {
    super();
    this.AFP_Services = new AFP_Services();
  }
  AFP_Services?: AFP_Services;
  DealInfo_Content?: string;
  SearchModel?: {
    Services_TableNo?: number
  };
}

export class Response_MemberServices extends Model_ShareData {
  AFP_Services: AFP_Services;
  AFP_MemberOrder: AFP_MemberOrder;
  List_ItemInfoPart: AFP_ItemInfoPart[] = [];
  AFP_ECStore: AFP_ECStore;
  List_DealInfo: AFP_DealInfo[] = [];
}
