import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '@app/app.service';
import { AFP_ECStore, AFP_MemberOrder, AFP_ItemInfoPart, Model_ShareData, AFP_Services, AFP_DealInfo } from '@app/_models';


@Component({
  selector: 'app-return-dialog',
  templateUrl: './return-dialog.component.html',
  styleUrls: []
})
export class ReturnDialogComponent implements OnInit {
  /** 客服單編號 */
  public ServiceTableNO = 0;
  /** 賣家名稱 */
  public ECStoreName = '';
  /** 客服單狀態 */
  public HandleState = 0;
  /** 對話紀錄ListModel */
  public ListDealInfo: AFP_DealInfo[] = [];
  public CostomerMsg = '';
  public ReturnDialog: ReturnDialog[] = [];

  /** 自適應調整輸入框位置 */
  width: number;
  height: number;

  constructor(private route: ActivatedRoute, public appService: AppService, public el: ElementRef) {
    this.ServiceTableNO = this.route.snapshot.params.Services_TableNo;
    this.ECStoreName = this.route.snapshot.queryParams.ECStoreName;
    this.HandleState = Number(this.route.snapshot.queryParams.HandleState);
  }

  ngOnInit() {
    const request: Request_MemberServices = {
      SelectMode: 3, // 對話紀錄
      SearchModel: {
        Services_TableNo: this.ServiceTableNO
      }
    };

    this.appService.toApi('Member', '1515', request).subscribe((data: Response_MemberServices) => {
      this.ListDealInfo = data.List_DealInfo;
      this.CombinContent();
    });
  }

  /** 傳送訊息 */
  sendMessage(): void {
    if (this.CostomerMsg.length > 0) {
      const ServicesModel: AFP_Services = new AFP_Services();
      ServicesModel.Services_TableNo = this.ServiceTableNO;
      const request: Request_MemberServices = {
        SelectMode: 4, // 新增對話
        AFP_Services: ServicesModel,
        DealInfo_Content: this.CostomerMsg
      };

      this.appService.toApi('Member', '1515', request).subscribe((data: Response_MemberServices) => {
        this.CostomerMsg = '';
        this.ListDealInfo.push(data.AFP_DealInfo);
        this.CombinContent();
      });
    }
  }

  CombinContent(): any {
    this.ListDealInfo.forEach((value, index) => {
      const date = new Date(value.DealInfo_Date);
      value.FrontDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    });

    const groups = this.ListDealInfo.reduce((groups, dealInfo) => {
      const date = dealInfo.FrontDate;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(dealInfo);
      return groups;
    }, {});

    // Edit: to add it in the array format instead
    this.ReturnDialog = Object.keys(groups).map((date) => {
      return {
        date,
        content: groups[date]
      };
    });
  }

}

/** 會員中心 - 客服單 Request_Model */
class Request_MemberServices extends Model_ShareData {
  constructor() {
    super();
    this.AFP_Services = new AFP_Services();
  }
  /** 客服單 */
  AFP_Services?: AFP_Services;
  /** 問答訊息 */
  DealInfo_Content?: string;
  /** 搜尋模組 */
  SearchModel?: {
    /** 客服單編號 */
    Services_TableNo?: number
  };
}

/** 會員中心 - 客服單 Response_Model */
class Response_MemberServices extends Model_ShareData {
  /** 客服單 資訊 */
  AFP_Services: AFP_Services;
  /** 訂單資訊 */
  AFP_MemberOrder: AFP_MemberOrder;
  /** 訂單 商品資訊 */
  List_ItemInfoPart: AFP_ItemInfoPart[] = [];
  /** 商家資訊 */
  AFP_ECStore: AFP_ECStore;
  /** 客服單 歷史紀錄 */
  List_DealInfo: AFP_DealInfo[] = [];
  /** 客服單 單筆對話紀錄 */
  AFP_DealInfo?: AFP_DealInfo;
}

export class ReturnDialog {
  date: string;
  content: AFP_DealInfo[];
}
