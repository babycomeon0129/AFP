import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import {
  Request_MemberOrder, Response_MemberOrder, AFP_ECStore, AFP_MemberOrder, AFP_ItemInfoPart, Request_MemberAddress,
  Response_MemberAddress, AFP_UserFavourite, AFP_Services, AFP_UserReport, Request_MemberServices, Response_MemberServices
} from '@app/_models';
import { ModalService } from '@app/shared/modal/modal.service';
import { NgForm } from '@angular/forms';
import { layerAnimation } from '@app/animations';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['../../member/member/member.scss',
              '../../member/member-function/member-order/member-order.scss',
              '../../order/shopping-order/shopping-order.scss',
              './return.scss'],
  animations: [ layerAnimation ]
})
export class ReturnComponent implements OnInit {
  public orderNo: number;
  public orderInfo: AFP_MemberOrder;
  public storeInfo: AFP_ECStore;
  public productInfo: AFP_ItemInfoPart[] = [];
  public addressList: AFP_UserFavourite[] = [];
  public userReport: AFP_UserReport[] = [];
  /** 客服單 */
  public servicesModel: AFP_Services = new AFP_Services();
  public choiceDelivery = -1;
  /** 我的收藏 - 地址 */
  public requestAddress: AFP_UserFavourite = new AFP_UserFavourite();
  /** 同頁滑動切換 0:本頁 1:退貨說明 2:退貨原因 3:寄送方式 4:新增地址 5: 縣市清單 6:行政區清單 */
  public layerTrig = 0;

  constructor(private route: ActivatedRoute, public appService: AppService, private modal: ModalService, private router: Router) {
    this.orderNo = this.route.snapshot.params.Order_TableNo;
    const request: Request_MemberOrder = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 2, // 詳細查詢
      SearchModel: {
        OrderNo: this.orderNo,
        OrderState: 2
      }
    };

    this.appService.toApi('Member', '1512', request).subscribe((data: Response_MemberOrder) => {
      this.orderInfo = data.AFP_MemberOrder;
      this.storeInfo = data.AFP_ECStore;
      this.productInfo = data.List_ItemInfoPart;
      this.userReport = data.AFP_UserReport;

      //  取訂單資訊當客服單預設
      this.servicesModel.Services_OrderTableNo = this.orderInfo.Order_TableNo;
      this.servicesModel.Services_ECStoreCode = this.orderInfo.Order_ECStoreCode;
      if (this.orderInfo.Order_RecCity > 0) {
        this.servicesModel.Services_Address = this.CombineAddress(this.orderInfo.Order_RecCity
          , this.orderInfo.Order_RecCityArea, this.orderInfo.Order_RecAddress);
      }
      this.servicesModel.Services_CPhone = this.orderInfo.Order_RecTel;
      this.servicesModel.Services_CName = this.orderInfo.Order_RecName;
    });
  }

  ngOnInit() {
  }

  // 讀取會員儲存地址
  readMemberAddress() {
    const request: Request_MemberAddress = {
      SelectMode: 4,
      User_Code: sessionStorage.getItem('userCode')
    };
    this.appService.toApi('Member', '1503', request).subscribe((data: Response_MemberAddress) => {
      this.addressList = data.List_UserFavourite;
      this.userReport = data.AFP_UserReport;
    });
  }

  /**
   *  顯示退貨理由
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
        case 255: {
          reson = '其他';
          break;
        }
      }
    }
    return reson;
  }

  /** 選擇退貨理由 */
  ChoiceReson(reasonNo: number): void {
    if (typeof reasonNo !== 'undefined') {
      this.servicesModel.Services_Reason = reasonNo;
      this.layerTrig = 0;
    }
  }

  /**
   *  地址組合
   * @param  city  縣市編碼
   * @param  area  行政區編碼
   * @param  address  地址
   * @returns 完整地址
   */
  CombineAddress(city: number, area: number, address: string): string {
    let strAddress = '';
    strAddress = area.toString() + ' ' +
      this.userReport.find(x => x.UserReport_ItemCode === city
        && x.UserReport_CategoryCode === 21).UserReport_ItemName +
      this.userReport.find(x => x.UserReport_ItemCode === area
        && x.UserReport_UpItemCode === city
        && x.UserReport_CategoryCode === 22).UserReport_ItemName
      + address;
    return strAddress;
  }

  /**
   *  選擇退貨地址
   *
   * @param address 我的地址
   * @param num 所選地址
   */
  choiceAddress(address: AFP_UserFavourite, num: number) {
    this.choiceDelivery = num;

    this.servicesModel.Services_Address = this.CombineAddress(address.UserFavourite_Number1
      , address.UserFavourite_Number2, address.UserFavourite_Text3);
    this.servicesModel.Services_CPhone = address.UserFavourite_Text2;
    this.servicesModel.Services_CName = address.UserFavourite_Text1;
  }

  /** 新增地址 */
  onAddressSubmit(form: NgForm): void {
    this.requestAddress.UserFavourite_ID = 0;
    this.requestAddress.UserFavourite_CountryCode = 886;
    this.requestAddress.UserFavourite_Type = 1;
    this.requestAddress.UserFavourite_UserInfoCode = 0;
    this.requestAddress.UserFavourite_TypeCode = 0;
    this.requestAddress.UserFavourite_State = 1;
    this.requestAddress.UserFavourite_SyncState = 0;

    // 未勾選該欄位時，該欄位為undefined，需先賦值，不勾選的情況預設為0
    if (this.requestAddress.UserFavourite_IsDefault === undefined) {
      this.requestAddress.UserFavourite_IsDefault = 0;
    }

    const request: Request_MemberAddress = {
      SelectMode: 1,
      User_Code: sessionStorage.getItem('userCode'),
      AFP_UserFavourite: this.requestAddress
    };

    this.appService.toApi('Member', '1503', request).subscribe(() => {
      // 將資料放入「地址列表」中
      this.addressList.push(JSON.parse(JSON.stringify(this.requestAddress)));
      // 回到上一頁(「地址列表」)
      this.layerTrig = 0;
      // 將「新增地址」的input清空
      form.resetForm();
      this.requestAddress = new AFP_UserFavourite();
    });
  }

  /** 建立客服單 */
  SendService(): void {
    if (this.servicesModel.Services_Reason > 0) {
      if (this.servicesModel.Services_Address.length > 0) {
        const request: Request_MemberServices = {
          SelectMode: 1,
          User_Code: sessionStorage.getItem('userCode'),
          AFP_Services: this.servicesModel
        };
        this.appService.toApi('Member', '1515', request).subscribe((data: Response_MemberServices) => {
          //  導去退貨詳細
          this.router.navigate(['/Return/ReturnDetail', data.AFP_Services.Services_TableNo]);
        });
      } else {
        this.modal.show('message', {
          class: 'modal-sm modal-smbox', initialState: {
            success: false, message: '請選擇取件地址'
          }
        });
      }
    } else {
      this.modal.show('message', {
        class: 'modal-sm modal-smbox', initialState: {
          success: false, message: '請選擇退貨理由'
        }
      });
    }
  }


}
