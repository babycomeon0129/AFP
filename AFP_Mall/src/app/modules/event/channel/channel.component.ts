import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '@app/app.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { InfoModalComponent } from '@app/shared/modal/info-modal/info-modal.component';
import { SwiperOptions } from 'swiper';
import { layerAnimation } from '@app/animations';
@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
  animations: [layerAnimation]
})
export class ChannelComponent implements OnInit {
  /** 視窗modal */
  bsModalRef: BsModalRef;
  /** 上方廣告 swiper */
  public boxAD: SwiperOptions = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
  };
  /** 中間大廣告 swiper */
  public boxAD1: SwiperOptions = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    slidesPerView: 1.2,
    spaceBetween: 10,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
  };
  /** 服務icon */
  public boxIconPC: SwiperOptions = {
    slidesPerView: 5,
    breakpoints: {
      768: {
        slidesPerView: 7,
      },
      1024: {
        slidesPerView: 9
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    loop: false
  };
  public boxIcon: SwiperOptions = {
    spaceBetween: 0,
    slidesPerView: 5,
    slidesPerColumn: 2,
    slidesPerColumnFill : 'row',
    slidesPerGroup: 5,
    loop: false
  };
  /** 同頁滑動切換 0:本頁 1:更多服務 */
  public layerTrig = 0;

  /** 專屬新聞 tab swiper */
  public boxTabs: SwiperOptions = {
    slidesPerView: 4.3,
    spaceBetween: 10,
    breakpoints: {
      570: {
        slidesPerView: 5.3,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 6.3,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 8.3,
        spaceBetween: 10,
      }
    },
    on: {
      click() {
        this.slideTo(this.clickedIndex);
      }
    }
  };
  /** 專屬新聞 panes swiper */
  public boxChannel1: SwiperOptions = {
    slidesPerView: 2.5,
    spaceBetween: 10,
    breakpoints: {
      570: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 10,
      }
    },
    loop: false,
    observer: true,
    observeParents: true,
    preloadImages: true,
    updateOnImagesReady: true,
    on: {
      click() {
        this.slideTo(this.clickedIndex);
      }
    }
  };

  /** 專屬優惠券 panes swiper */
  public boxChannel2: SwiperOptions = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slidesPerView: 3,
    spaceBetween: 10,
    breakpoints: {
      570: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 10,
      }
    },
    loop: false,
    observer: true,
    observeParents: true,
    preloadImages: true,
    updateOnImagesReady: true,
    on: {
      click() {
        this.slideTo(this.clickedIndex);
      }
    }
  };
  /** 判斷 justKa客服modal 顯示與否 */
  public show = false;
  /** 關閉 justKa 對話框 */
  public closeMsg = false;

  /** 假資料 */
  public adMid = [{
    'ADImg_ID': 173,
    'ADImg_Type': 1,
    'ADImg_ADCode': 10006,
    'ADImg_Img': './img/channel/banner.png',
    'ADImg_VideoURL': null,
    'ADImg_Title': null,
    'ADImg_SubTitle': null,
    'ADImg_URL': '',
    'ADImg_URLTarget': '_self'
  }];
  public adMid1 = [{
    'ADImg_ID': 173,
    'ADImg_Type': 1,
    'ADImg_ADCode': 10006,
    'ADImg_Img': './img/channel/banner.png',
    'ADImg_VideoURL': null,
    'ADImg_Title': null,
    'ADImg_SubTitle': null,
    'ADImg_URL': '',
    'ADImg_URLTarget': '_self'
  },
  {
    'ADImg_ID': 172,
    'ADImg_Type': 1,
    'ADImg_ADCode': 10006,
    'ADImg_Img': './img/channel/banner1.png',
    'ADImg_VideoURL': null,
    'ADImg_Title': null,
    'ADImg_SubTitle': null,
    'ADImg_URL': '',
    'ADImg_URLTarget': '_self'
  }];
  public icon = [
    {
        'Function_ID': 85,
        'Function_Code': 1006,
        'Function_CategaryCode': 10015,
        'Function_Name': '彩蛋',
        'Function_URL': '/Notification/NotificationDetail/380061081528577',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200825/ec6c3f93-e394-4aac-8018-b5964ec75313.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_self',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 44,
        'Function_Code': 10014,
        'Function_CategaryCode': 10011,
        'Function_Name': '一元搶購',
        'Function_URL': '/Voucher/Event',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200519/30874134-3c8a-45ca-bb05-141b95436060.jpg',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_blank',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 9,
        'Function_Code': 10009,
        'Function_CategaryCode': 10015,
        'Function_Name': '遊戲',
        'Function_URL': '/GameCenter',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200519/f8d07653-40aa-4bb8-93d4-56a5b075a556.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_self',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 42,
        'Function_Code': 10016,
        'Function_CategaryCode': 10013,
        'Function_Name': '交通訂票',
        'Function_URL': '/Shopping/ProductList/210058666369001',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200409/e8bbd771-1f48-4ee5-8dd1-4e7e563c4ea9.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_blank',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 49,
        'Function_Code': 10010,
        'Function_CategaryCode': 10014,
        'Function_Name': '新聞',
        'Function_URL': 'https://www.ettoday.net/',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200810/d8091f44-5707-4b9d-8677-27c8b942e6fa.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_blank',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 25,
        'Function_Code': 20010,
        'Function_CategaryCode': 10011,
        'Function_Name': '自動測試用',
        'Function_URL': '/Shopping/ProductList/210064605585471',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20210610/bfb8b863-4573-4dc3-9685-fb4232d10a7c.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_self',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 3,
        'Function_Code': 10003,
        'Function_CategaryCode': 10016,
        'Function_Name': '線上商城',
        'Function_URL': '/Shopping',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200409/2d0b4c02-9b8b-4ccb-a69f-ca2865dd6929.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_self',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 4,
        'Function_Code': 10004,
        'Function_CategaryCode': 10016,
        'Function_Name': '找優惠',
        'Function_URL': '/Voucher/Offers',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200519/7167852c-e161-4262-aa48-42a2feae14a1.jpg',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_self',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 46,
        'Function_Code': 10017,
        'Function_CategaryCode': 10013,
        'Function_Name': '道路救援',
        'Function_URL': 'http://www.24tms.com.tw/ugC_Home.asp?hidStyle=_Roads&hidURL=ugC_RoadRescue',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200810/1fc00f21-55ee-4717-b68b-94619dd1b031.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_blank',
        'Function_IsActive': 1
    }
  ];
  public iconMore = [
    {
        'Function_ID': 85,
        'Function_Code': 1006,
        'Function_CategaryCode': 10015,
        'Function_Name': '彩蛋',
        'Function_URL': '/Notification/NotificationDetail/380061081528577',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200825/ec6c3f93-e394-4aac-8018-b5964ec75313.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_self',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 44,
        'Function_Code': 10014,
        'Function_CategaryCode': 10011,
        'Function_Name': '一元搶購',
        'Function_URL': '/Voucher/Event',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200519/30874134-3c8a-45ca-bb05-141b95436060.jpg',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_blank',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 9,
        'Function_Code': 10009,
        'Function_CategaryCode': 10015,
        'Function_Name': '遊戲',
        'Function_URL': '/GameCenter',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200519/f8d07653-40aa-4bb8-93d4-56a5b075a556.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_self',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 42,
        'Function_Code': 10016,
        'Function_CategaryCode': 10013,
        'Function_Name': '交通訂票',
        'Function_URL': '/Shopping/ProductList/210058666369001',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200409/e8bbd771-1f48-4ee5-8dd1-4e7e563c4ea9.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_blank',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 49,
        'Function_Code': 10010,
        'Function_CategaryCode': 10014,
        'Function_Name': '新聞',
        'Function_URL': 'https://www.ettoday.net/',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200810/d8091f44-5707-4b9d-8677-27c8b942e6fa.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_blank',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 25,
        'Function_Code': 20010,
        'Function_CategaryCode': 10011,
        'Function_Name': '自動測試用',
        'Function_URL': '/Shopping/ProductList/210064605585471',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20210610/bfb8b863-4573-4dc3-9685-fb4232d10a7c.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_self',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 3,
        'Function_Code': 10003,
        'Function_CategaryCode': 10016,
        'Function_Name': '線上商城',
        'Function_URL': '/Shopping',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200409/2d0b4c02-9b8b-4ccb-a69f-ca2865dd6929.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_self',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 4,
        'Function_Code': 10004,
        'Function_CategaryCode': 10016,
        'Function_Name': '找優惠',
        'Function_URL': '/Voucher/Offers',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200519/7167852c-e161-4262-aa48-42a2feae14a1.jpg',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_self',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 46,
        'Function_Code': 10017,
        'Function_CategaryCode': 10013,
        'Function_Name': '道路救援',
        'Function_URL': 'http://www.24tms.com.tw/ugC_Home.asp?hidStyle=_Roads&hidURL=ugC_RoadRescue',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200810/1fc00f21-55ee-4717-b68b-94619dd1b031.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_blank',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 3,
        'Function_Code': 10003,
        'Function_CategaryCode': 10016,
        'Function_Name': '線上商城',
        'Function_URL': '/Shopping',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200409/2d0b4c02-9b8b-4ccb-a69f-ca2865dd6929.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_self',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 4,
        'Function_Code': 10004,
        'Function_CategaryCode': 10016,
        'Function_Name': '找優惠',
        'Function_URL': '/Voucher/Offers',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200519/7167852c-e161-4262-aa48-42a2feae14a1.jpg',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_self',
        'Function_IsActive': 1
    },
    {
        'Function_ID': 46,
        'Function_Code': 10017,
        'Function_CategaryCode': 10013,
        'Function_Name': '道路救援',
        'Function_URL': 'http://www.24tms.com.tw/ugC_Home.asp?hidStyle=_Roads&hidURL=ugC_RoadRescue',
        'Function_Icon': 'http://54.150.124.230:38085//Upload/Images/20200810/1fc00f21-55ee-4717-b68b-94619dd1b031.png',
        'Function_IsTop': 0,
        'Function_IsOther': 0,
        'Function_Sort': 0,
        'Function_URLTarget': '_blank',
        'Function_IsActive': 1
    }
  ];
  public channel1 = [
    {
        "UserDefine_ChannelID": 1111115,
        "UserDefine_Code": 210062803930555,
        "UserDefine_Name": "天母美食",
        "VoucherData": [
            {
                "Voucher_ID": 556,
                "Voucher_Code": 460085958801227,
                "Voucher_UserVoucherCode": null,
                "Voucher_CountryCode": 886,
                "Discount_Amount": 0,
                "Voucher_UsedType": 3,
                "Voucher_UsedTypeName": null,
                "Voucher_ShowType": 2200,
                "Voucher_ShowTypeName": null,
                "Voucher_Title": "山水屋民宿",
                "Voucher_URLTarget": null,
                "Voucher_URL": null,
                "Voucher_IsFreq": 1,
                "Voucher_FreqName": "兌換",
                "Voucher_Type": 11,
                "Voucher_CompanyCode": 110042239332031,
                "Voucher_ECStoreCode": 290057515001814,
                "Voucher_ExtName": "早餐兌換券",
                "Voucher_DedPoint": 0,
                "Voucher_SpecialPoint": 0,
                "Voucher_Image": "http://54.150.124.230:38085//Upload/Images/20210623/a198158b-02de-4050-aeac-e99b4811d139.png",
                "Voucher_ReleasedCount": 0,
                "Voucher_IssuanceLimit": 0,
                "Voucher_ReceiveLimit": 0,
                "Voucher_UsedLimitType": 0,
                "Voucher_UsedLimit": 0,
                "Voucher_CheckLimit": null,
                "Voucher_FeeType": null,
                "Voucher_UsedOnDate": "2021-06-23T15:17:00",
                "Voucher_UsedOffDate": "2022-06-23T15:17:00",
                "Voucher_OnlineDate": "2021-06-23T15:17:00",
                "Voucher_OfflineDate": "2022-06-23T15:17:00",
                "Voucher_State": 0,
                "Voucher_Content": null,
                "Voucher_Note": null,
                "VoucherRange_Prod": [],
                "List_VoucherLimit": [],
                "VoucherUseCount": null,
                "Voucher_ReceiveDate": null,
                "Voucher_IsScan": 0,
                "Voucher_SpecialPrice": 1500,
                "Voucher_SellPrice": 1200
            },
            {
                "Voucher_ID": 554,
                "Voucher_Code": 460083631238457,
                "Voucher_UserVoucherCode": null,
                "Voucher_CountryCode": 886,
                "Discount_Amount": 0,
                "Voucher_UsedType": 3,
                "Voucher_UsedTypeName": null,
                "Voucher_ShowType": 2000,
                "Voucher_ShowTypeName": null,
                "Voucher_Title": "MOB-2625",
                "Voucher_URLTarget": null,
                "Voucher_URL": null,
                "Voucher_IsFreq": 1,
                "Voucher_FreqName": "兌換",
                "Voucher_Type": 1,
                "Voucher_CompanyCode": 110042239332031,
                "Voucher_ECStoreCode": 290057515001814,
                "Voucher_ExtName": "MOB-2625 測試推播",
                "Voucher_DedPoint": 0,
                "Voucher_SpecialPoint": 0,
                "Voucher_Image": "http://54.150.124.230:38085//Upload/Images/20210527/505061b2-ddc7-4f61-beeb-83536e8c660e.png",
                "Voucher_ReleasedCount": 0,
                "Voucher_IssuanceLimit": 0,
                "Voucher_ReceiveLimit": 0,
                "Voucher_UsedLimitType": 0,
                "Voucher_UsedLimit": 0,
                "Voucher_CheckLimit": null,
                "Voucher_FeeType": null,
                "Voucher_UsedOnDate": "2021-05-27T16:46:00",
                "Voucher_UsedOffDate": "2022-05-27T16:46:00",
                "Voucher_OnlineDate": "2021-05-27T16:46:00",
                "Voucher_OfflineDate": "2022-05-27T16:46:00",
                "Voucher_State": 0,
                "Voucher_Content": null,
                "Voucher_Note": null,
                "VoucherRange_Prod": [],
                "List_VoucherLimit": [],
                "VoucherUseCount": null,
                "Voucher_ReceiveDate": null,
                "Voucher_IsScan": 0,
                "Voucher_SpecialPrice": 0,
                "Voucher_SellPrice": 590
            },
            {
                "Voucher_ID": 461,
                "Voucher_Code": 460064343500681,
                "Voucher_UserVoucherCode": null,
                "Voucher_CountryCode": 886,
                "Discount_Amount": 0,
                "Voucher_UsedType": 3,
                "Voucher_UsedTypeName": null,
                "Voucher_ShowType": 2200,
                "Voucher_ShowTypeName": null,
                "Voucher_Title": "三明堂",
                "Voucher_URLTarget": null,
                "Voucher_URL": null,
                "Voucher_IsFreq": 1,
                "Voucher_FreqName": "兌換",
                "Voucher_Type": 11,
                "Voucher_CompanyCode": 110064340449969,
                "Voucher_ECStoreCode": 290064341918799,
                "Voucher_ExtName": "消費定食滿250元贈小點乙份",
                "Voucher_DedPoint": 0,
                "Voucher_SpecialPoint": 0,
                "Voucher_Image": "http://54.150.124.230:38085//Upload/Images/20201016/c2a503cc-fb1d-42f8-b56d-cafc7dc5330f.jpg",
                "Voucher_ReleasedCount": 0,
                "Voucher_IssuanceLimit": 0,
                "Voucher_ReceiveLimit": 0,
                "Voucher_UsedLimitType": 0,
                "Voucher_UsedLimit": 0,
                "Voucher_CheckLimit": null,
                "Voucher_FeeType": null,
                "Voucher_UsedOnDate": "2020-10-16T10:53:48",
                "Voucher_UsedOffDate": "2021-11-30T23:59:59",
                "Voucher_OnlineDate": "2020-10-16T10:53:48",
                "Voucher_OfflineDate": "2021-11-30T23:59:59",
                "Voucher_State": 0,
                "Voucher_Content": null,
                "Voucher_Note": null,
                "VoucherRange_Prod": [],
                "List_VoucherLimit": [],
                "VoucherUseCount": null,
                "Voucher_ReceiveDate": null,
                "Voucher_IsScan": 0,
                "Voucher_SpecialPrice": 2300,
                "Voucher_SellPrice": 2300
            },
            {
                "Voucher_ID": 461,
                "Voucher_Code": 460064343500682,
                "Voucher_UserVoucherCode": null,
                "Voucher_CountryCode": 886,
                "Discount_Amount": 0,
                "Voucher_UsedType": 3,
                "Voucher_UsedTypeName": null,
                "Voucher_ShowType": 2200,
                "Voucher_ShowTypeName": null,
                "Voucher_Title": "三明堂三明堂三明堂",
                "Voucher_URLTarget": null,
                "Voucher_URL": null,
                "Voucher_IsFreq": 1,
                "Voucher_FreqName": "兌換",
                "Voucher_Type": 11,
                "Voucher_CompanyCode": 110064340449969,
                "Voucher_ECStoreCode": 290064341918799,
                "Voucher_ExtName": "消費定食滿250元贈小點乙份 消費定食滿250元贈小點乙份",
                "Voucher_DedPoint": 0,
                "Voucher_SpecialPoint": 0,
                "Voucher_Image": "http://54.150.124.230:38085//Upload/Images/20201016/c2a503cc-fb1d-42f8-b56d-cafc7dc5330f.jpg",
                "Voucher_ReleasedCount": 0,
                "Voucher_IssuanceLimit": 0,
                "Voucher_ReceiveLimit": 0,
                "Voucher_UsedLimitType": 0,
                "Voucher_UsedLimit": 0,
                "Voucher_CheckLimit": null,
                "Voucher_FeeType": null,
                "Voucher_UsedOnDate": "2020-10-16T10:53:48",
                "Voucher_UsedOffDate": "2021-11-30T23:59:59",
                "Voucher_OnlineDate": "2020-10-16T10:53:48",
                "Voucher_OfflineDate": "2021-11-30T23:59:59",
                "Voucher_State": 0,
                "Voucher_Content": null,
                "Voucher_Note": null,
                "VoucherRange_Prod": [],
                "List_VoucherLimit": [],
                "VoucherUseCount": null,
                "Voucher_ReceiveDate": null,
                "Voucher_IsScan": 0,
                "Voucher_SpecialPrice": 11800,
                "Voucher_SellPrice": 11500
            }
        ]
    },
    {
        "UserDefine_ChannelID": 1111115,
        "UserDefine_Code": 210062803993187,
        "UserDefine_Name": "永康美食",
        "VoucherData": []
    },
    {
        "UserDefine_ChannelID": 1111115,
        "UserDefine_Code": 210062804019069,
        "UserDefine_Name": "永康飲品",
        "VoucherData": []
    },
    {
        "UserDefine_ChannelID": 1111115,
        "UserDefine_Code": 210062804193575,
        "UserDefine_Name": "永康生活",
        "VoucherData": []
    },
    {
        "UserDefine_ChannelID": 1111115,
        "UserDefine_Code": 210062804281370,
        "UserDefine_Name": "強打推薦",
        "VoucherData": []
    }
  ];
  public footerHtml = "注意事項：<br>媽小里家再即會色外出查賣收？時象案，創選告類，早的樣式自演等明，朋輕內間，管童苦行皮腳種時輕應西野：程熱斯民作油得當我舉案也？字成樣日張華李，學起作變老要足開民門氣有去在音不小清創選告類，早的樣式自演等明，朋輕內間，管童苦行皮腳種時輕應西野：程熱斯民作油得當我舉案也？字成樣日張華李，學起作變老要足開民門創選告類，早的樣式自演學起作變老要足開民門...<a href='#'><繼續閱讀></a>"

  constructor(public appService: AppService, private modalService: BsModalService, private activatedRoute: ActivatedRoute) {
    /** 取得queryParams設定LayerTrig(更多服務) */
    this.activatedRoute.queryParams.subscribe(params => {
      if (typeof params.layerTrig !== 'undefined') {
        this.layerTrig = parseInt(params.layerTrig, 10);
      }
    });
  }

  ngOnInit(): void {
  }
  /** open模組infoModal */
  openInfoModal() {
    // tslint:disable-next-line: max-line-length
    const noteTxt = '注意事項：媽小里家再即會色外出查賣收？時象案，創選告類，早的樣式自演等明，朋輕內間，管童苦行皮腳種時輕應西野：程熱斯民作油得當我舉案也？字成樣日張華李，學起作變老要足開民門氣有去在音不小清。小里家再即會色外出查賣收？時象案，創選告類，早的樣式自演等明，朋輕內間，管童苦行皮腳種時輕應西野：程熱斯民作油得當我舉案也？字成樣日張華李，學起作變老要足開民門氣有去在音不小清。小里家再即會色外出查賣收？時象案，創選告類，早的樣式自演等明，朋輕內間，管童苦行皮腳種時輕應西野：程熱斯民作油得當我舉案也？字成樣日張華李，學起作變老要足開民門氣有去在音不小清。小里家再即會色外出查賣收？時象案，創選告類，早的樣式自演等明，朋輕內間，管童苦行皮腳種時輕應西野：程熱斯民作油得當我舉案也？字成樣日張華李，學起作變老要足開民門氣有去在音不小清。小里家再即會色外出查賣收？時象案，創選告類，早的樣式自演等明，朋輕內間，管童苦行皮腳種時輕應西野：程熱斯民作油得當我舉案也？字成樣日張華李，學起作變老要足開民門氣有去在音不小清。小里家再即會色外出查賣收？時象案，創選告類，早的樣式自演等明，朋輕內間，管童苦行皮腳種時輕應西野：程熱斯民作油得當我舉案也？字成樣日張華李，學起作變老要足開民門氣有去在音不小清。';
    const initialState = { title: '活動資訊', message: noteTxt };
    this.bsModalRef = this.modalService.show(InfoModalComponent, {initialState});
  }


  /** 取得channel頁籤資訊（點擊時）
   * @param mode SelectMode
   * @param index 索引
   * @param menuCode 目錄編碼
   * @param channelCode 頻道編號
   */
   readSheet(mode: number, index: number, menuCode: number, channelCode?: number): void {
    console.log(mode, index, menuCode, channelCode);
  }

  /** justKa點擊事件（justKa modal 顯示與否） */
   toggle() {
    this.show = !this.show;
    if (this.show) {
      const JustKaUrl = 'https://biz.justka.ai/webapp/home?q=a2d422f6-b4bc-4e1d-9ca0-7b4db3258f35&a=d3f53a60-db70-11e9-8a34-2a2ae2dbcce4'
      this.appService.showJustka(JustKaUrl);
    } else {
      document.querySelector('body').classList.remove('modal-open');
    }
  }
}
