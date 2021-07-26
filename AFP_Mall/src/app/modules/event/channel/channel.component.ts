import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { InfoModalComponent } from '@app/shared/modal/info-modal/info-modal.component';
import { SwiperOptions } from 'swiper';
@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
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
    spaceBetween: 6,
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
  constructor(private modalService: BsModalService, private activatedRoute: ActivatedRoute) {
    /** 取得queryParams設定LayerTrig(更多服務) */
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
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


}
