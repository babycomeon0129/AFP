import { Component, OnInit, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import {
  AFP_ECStore, AFP_MemberOrder, AFP_ItemInfoPart, AFP_UserFavourite
  , Model_ShareData, AFP_Services, AFP_UserReport, AFP_DealInfo
} from '../../../_models';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-return-dialog',
  templateUrl: './return-dialog.component.html',
  styleUrls: ['../../../../dist/style/member.min.css', '../../../../dist/style/shopping-index.min.css']
})
export class ReturnDialogComponent implements OnInit, AfterViewInit, AfterViewChecked {
  constructor(private route: ActivatedRoute, public appService: AppService, public el: ElementRef) {
    this.ServiceTableNO = this.route.snapshot.params.Services_TableNo;
    this.ECStoreName = this.route.snapshot.paramMap.get('ECStoreName');
    this.HandleState = Number(this.route.snapshot.paramMap.get('HandleState'));

    const request: Request_MemberServices = {
      User_Code: sessionStorage.getItem('userCode'),
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

  /** 傳送訊息 */
  sendMessage(): void {
    if (this.CostomerMsg.length > 0) {
      const ServicesModel: AFP_Services = new AFP_Services();
      ServicesModel.Services_TableNo = this.ServiceTableNO;
      const request: Request_MemberServices = {
        User_Code: sessionStorage.getItem('userCode'),
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

    // tslint:disable-next-line: no-shadowed-variable
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

  ngOnInit() {
  }

  ngAfterViewInit() {
    // $('CostomerMsg').on('keypress', (e) => {
    //   if (e.keyCode === 13) {
    //     this.sendMessage();
    //   }
    // });
  }
  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
  }
  ngAfterViewChecked() {
    // this.el.nativeElement.querySelector('.service-store-footer').style = 'bottom:' +
    // this.el.nativeElement.querySelector('#footpc').clientHeight + 'px;';
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
  AFP_DealInfo?: AFP_DealInfo;
}

export class ReturnDialog {
  date: string;
  content: AFP_DealInfo[];
}
