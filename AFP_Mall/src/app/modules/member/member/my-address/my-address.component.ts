import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AFP_UserFavourite, AFP_UserReport, Request_MemberAddress, Response_MemberAddress } from '@app/_models';
import { NgForm } from '@angular/forms';
import { ModalService } from '../../../../shared/modal/modal.service';
import { layerAnimation } from '../../../../animations';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-my-address',
  templateUrl: './my-address.component.html',
  styleUrls: ['../member.scss'],
  animations: [layerAnimation]
})
export class MyAddressComponent implements OnInit {
  /** 會員地址列表 */
  public userAddressList: AFP_UserFavourite[] = [];
  /** 地址ID */
  public addressId = 0;
  /** 新增、修改地址 ngForm request */
  public requestAddress: AFP_UserFavourite = new AFP_UserFavourite();
  /** 縣市行政區資料集 */
  public UserReoprtList: AFP_UserReport[] = [];
  /** 地區列表 */
  public areaList: AFP_UserReport[] = [];
  /** 縣市列表 */
  public cityList: AFP_UserReport[] = [];
  /** 行政區列表 */
  public districtList: AFP_UserReport[] = [];
  /** 地址詳細開啟狀態 */
  public showDetail = false;
  /** 同頁滑動切換 0: 本頁 1:縣市區  2:行政區 */
  public layerTrig = 0;

  constructor(public appService: AppService, public modal: ModalService, private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('我的地址 - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: '我的地址 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});
  }

  ngOnInit() {
    this.onGetAddressList();
  }

  /** 讀取地址列表，及「新增地址」中的縣市和行政區 */
  onGetAddressList() {
    const request: Request_MemberAddress = {
      SelectMode: 4,
      User_Code: sessionStorage.getItem('userCode')
    };
    this.appService.toApi('Member', '1503', request).subscribe((data: Response_MemberAddress) => {
      // 地址列表
      this.userAddressList = data.List_UserFavourite;
      // 地區、縣市、行政區
      if (this.UserReoprtList.length === 0) {
        this.UserReoprtList = data.AFP_UserReport;
        for (const item of data.AFP_UserReport) {
          if (item.UserReport_CategoryCode === 20) {
            this.areaList.push(item);
          } else if (item.UserReport_CategoryCode === 21) {
            this.cityList.push(item);
          } else if (item.UserReport_CategoryCode === 22) {
            this.districtList.push(item);
          }
        }
      }
    });
  }

  /** 讀取地址詳細
   * @param addressId 地址ID
   */
  onReadAddressDetail(addressID: number) {
    if (addressID > 0) {
      const request: Request_MemberAddress = {
        SelectMode: 5,
        User_Code: sessionStorage.getItem('userCode'),
        AFP_UserFavourite: {
          UserFavourite_ID: addressID,
          UserFavourite_CountryCode: 886,
          UserFavourite_Type: 1,
          UserFavourite_UserInfoCode: 0,
          UserFavourite_TypeCode: 0,
          UserFavourite_IsDefault: 0,
          UserFavourite_State: 1,
          UserFavourite_SyncState: 0,
        }
      };
      this.appService.toApi('Member', '1503', request).subscribe((data: Response_MemberAddress) => {
        this.requestAddress = data.AFP_UserFavourite;
      });
    } else {
      this.requestAddress = new AFP_UserFavourite();
      this.requestAddress.UserFavourite_Number1 = this.cityList[0].UserReport_ItemCode;
    }

    this.addressId = addressID;
    this.showDetail = true;
  }

  /** 地址組合
   * @param address 地址資訊
   */
  CombineAddress(address: AFP_UserFavourite): string {
    let strAddress = '';

    strAddress = address.UserFavourite_Number2.toString() + ' ' +
      this.cityList.find(x => x.UserReport_ItemCode === address.UserFavourite_Number1).UserReport_ItemName +
      this.districtList.find(x => x.UserReport_ItemCode === address.UserFavourite_Number2).UserReport_ItemName
      + address.UserFavourite_Text3;

    return strAddress;
  }

  /** 新增/修改地址 */
  onAddressSubmit(form: NgForm): void {
    this.requestAddress.UserFavourite_ID = this.addressId;
    this.requestAddress.UserFavourite_CountryCode = 886;
    this.requestAddress.UserFavourite_Type = 1;
    this.requestAddress.UserFavourite_UserInfoCode = 0;
    this.requestAddress.UserFavourite_TypeCode = 0;
    this.requestAddress.UserFavourite_State = 1;
    this.requestAddress.UserFavourite_SyncState = 0;
    if (this.requestAddress.UserFavourite_IsDefault === undefined) {
      this.requestAddress.UserFavourite_IsDefault = 0;
    }
    const request: Request_MemberAddress = {
      SelectMode: (this.addressId) > 0 ? 3 : 1,
      User_Code: sessionStorage.getItem('userCode'),
      AFP_UserFavourite: this.requestAddress
    };
    this.appService.toApi('Member', '1503', request).subscribe(() => {
      // 將資料撈出放在前頁「地址列表」中
      this.onGetAddressList();
      // 回到上一頁(「地址列表」)
      this.showDetail = false;
      // 將「新增地址」清空
      form.resetForm();
    });
  }

  /** 刪除地址 */
  onDeleteAddress() {
    this.modal.confirm({ initialState: { message: '請問是否要刪除這個地址?' } }).subscribe(res => {
      if (res) {
        const request: Request_MemberAddress = {
          SelectMode: 2,
          User_Code: sessionStorage.getItem('userCode'),
          AFP_UserFavourite: {
            UserFavourite_ID: this.addressId,
            UserFavourite_CountryCode: 886,
            UserFavourite_Type: 1,
            UserFavourite_UserInfoCode: 0,
            UserFavourite_TypeCode: 0,
            UserFavourite_IsDefault: 0,
            UserFavourite_State: 1,
          }
        };
        this.appService.toApi('Member', '1503', request).subscribe(() => {
          // 更新前頁「地址列表」
          this.userAddressList = [];
          this.onGetAddressList();
          // 回到上一頁(「地址列表」)
          this.showDetail = false;
        });
      }
    });
  }

  /** 同頁滑動切換 0: 本頁 1:縣市區  2:行政區 */
  layerToggle(index: number) {
    this.layerTrig = index;
  }
}
