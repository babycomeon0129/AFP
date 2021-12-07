import { Component, ViewChild, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { Response_AreaDetail, AFP_ECStore, Model_ShareData, AFP_Voucher, AFP_Product, AFP_ECStoreLink } from '@app/_models';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'ngx-useful-swiper';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '@app/shared/modal/modal.service';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation } from '@app/animations';

@Component({
  selector: 'app-explore-detail',
  templateUrl: './explore-detail.component.html',
  styleUrls: ['./explore-detail.scss',
    '../../shopping/product-list/product-list.scss',
    '../../../../styles/layer/shopping-footer.scss'],
  animations: [layerAnimation]
})
export class ExploreDetailComponent implements OnInit {
  @ViewChild('kvSwiper', { static: false }) kvSwiper: SwiperComponent;
  /** 緯度 */
  public lat: number;
  /** 經度 */
  public lng: number;

  /** 商家/景點詳細編碼 */
  public siteCode: number;
  /** 分頁代號 1: 商家介紹, 2: 優惠券 3: 線上商城 */
  public tabNo = 1;
  /** 商家/景點詳細資訊 */
  public siteInfo: AFP_ECStore;
  /** 顯示網站資訊 */
  public websitesArr: siteObj[] = [];
  /** 商家分店資訊 */
  public branchList: AFP_ECStore[] = [];
  /** 商家優惠券 */
  public voucherList: AFP_Voucher[] = [];
  /** 商家商品 */
  public productList: AFP_Product[] = [];
  /** 判斷是否有外送點餐服務 */
  public ecStoreExtType = false;
  /** JustKa連結 */
  public JustKaUrl: string;
  /** APP分享使用的url */
  public APPShareUrl: string;
  /** 上方大圖 swiper */
  public imgSwiper: SwiperOptions = {
    effect: 'fade',
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.shopping-storeimgbox .swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.shopping-storeimgbox .swiper-button-next',
      prevEl: '.shopping-storeimgbox .swiper-button-prev',
    }
  };
  /** 被展開的內容代碼陣列 */
  public unfolded: number[] = [];
  /** 分享至社群時顯示的文字 */
  public textForShare: string;
  /** 店家推薦連結 */
  public ecstoreLink : AFP_ECStoreLink[] = [];
  /** 同頁滑動切換 0:本頁 1:篩選清單 2:篩選-商品分類 3:更多推薦 */
  public layerTrig = 0;

  constructor(public appService: AppService, private route: ActivatedRoute, private modal: ModalService,
              private meta: Meta, private title: Title ) {
    // 取得商家/景點編碼
    this.siteCode = Number(this.route.snapshot.params.ECStore_Code);
    if (this.route.snapshot.params.ECStore_Code.tabNo !== undefined) {
      this.tabNo = Number(this.route.snapshot.params.tabNo);
    }
  }

  ngOnInit() {
    // 判斷瀏覽器是否支援geolocation API
    if (navigator.geolocation !== undefined) {
      // 請求取用使用者現在的位置
      navigator.geolocation.getCurrentPosition(success => {
        this.lat = success.coords.latitude;
        this.lng = success.coords.longitude;
        this.readTabData(1);
      }, err => {
        // 如果用戶不允取分享位置，取預設位置(台北101)
        this.lat = 25.034306;
        this.lng = 121.564603;
        this.readTabData(1);
      });
    } else {
      this.modal.show('message', { class: 'modal-dialog-centered',
        initialState: { success: true, message: '該瀏覽器不支援定位功能', showType: 1 } });
      this.lat = 25.034306;
      this.lng = 121.564603;
      this.readTabData(1);
    }

    // 從外部進來指定分頁
    this.route.queryParams.subscribe(params => {
      if (typeof params.navNo !== 'undefined') {
        this.tabNo = parseInt(params.navNo, 10);
        if (this.tabNo > 1 && this.tabNo <= 3) {
          this.readTabData(this.tabNo);
        }
      }
    });
    // load data when route param changes(前往分店)
    this.route.params.subscribe(routeParams => {
      if (this.siteCode !== Number(routeParams.ECStore_Code)) {
        this.siteCode = Number(routeParams.ECStore_Code);
        this.readTabData(this.tabNo);
      }
    });
    // 若是登入狀態下則顯示收藏狀態
    if (this.appService.loginState) {
      this.appService.showFavorites();
    }
  }

  /** 讀取分頁資料
   * @param index 分頁代號
   */
  readTabData(index: number): void {
    const request: Request_AreaDetail = {
      SearchModel: {
        ECStore_Code: this.siteCode,
        TabIndex: index
      }
    };
    // request
    this.appService.openBlock();
    this.appService.toApi('Area', '1403', request, this.lat, this.lng).subscribe((data: Response_AreaDetail) => {
      switch (index) {
        //  商家簡介
        case 1: {
          this.siteInfo = data.Model_ECStore;
          if (this.siteInfo.ECStore_DeliveryURL !== null || this.siteInfo.ECStore_TakeoutURL !== null) {
            this.ecStoreExtType = true;
          }
          this.ecstoreLink = data.List_ECStoreLink;
          // Enter轉換行
          if (this.siteInfo.ECStore_Features !== null && this.siteInfo.ECStore_Features !== '') {
            this.siteInfo.ECStore_Features = this.siteInfo.ECStore_Features.replace(/(?:\r\n|\r|\n)/g, '<br/>');
          }
          if (this.siteInfo.ECStore_OpenTime !== null) {
            this.siteInfo.ECStore_OpenTime = this.siteInfo.ECStore_OpenTime.replace(/(?:\r\n|\r|\n)/g, '<br/>');
          }
          this.branchList = data.List_ECStore;
          // 顯示網站判定
          if (data.Model_ECStore.ECStore_WebURL !== null && data.Model_ECStore.ECStore_WebURL.trim() !== '') {
            this.websitesArr.push({ siteName: '官方網站', siteUrl: data.Model_ECStore.ECStore_WebURL });
          }
          if (data.Model_ECStore.ECStore_FBURL !== null && data.Model_ECStore.ECStore_FBURL.trim() !== '') {
            this.websitesArr.push({ siteName: 'Facebook', siteUrl: data.Model_ECStore.ECStore_FBURL });
          }
          if (data.Model_ECStore.ECStore_IGURL !== null && data.Model_ECStore.ECStore_IGURL.trim() !== '') {
            this.websitesArr.push({ siteName: 'Instagram', siteUrl: data.Model_ECStore.ECStore_IGURL });
          }
          // 確認類型後顯示類型文字、定義分享文字
          let typeText = '';
          if (this.siteInfo.ECStore_Type < 2000) {
            typeText = '店家';
            this.textForShare = `嘿！我有好店要跟你分享喔！趕快進來看看吧！這是「${this.siteInfo.ECStore_ShowName}」，快來跟我一起進來逛逛吧！`;
          } else {
            typeText = '周邊';
            this.textForShare = `嘿！我發現新地方要跟你分享喔！趕快進來看看吧！這是「${this.siteInfo.ECStore_ShowName}」，快來跟我一起了解一下吧！`;
          }
          this.APPShareUrl = data.AppShareUrl;
          this.JustKaUrl = data.JustKaUrl;
          // 設置meta
          this.title.setTitle(this.siteInfo.ECStore_ShowName + '｜' + typeText + '介紹 - Mobii!');
          this.meta.updateTag({ name: 'description', content: this.siteInfo.ECStore_Features });
          this.meta.updateTag({ content: this.siteInfo.ECStore_ShowName + '｜' + typeText + '介紹 - Mobii!', property: 'og:title' });
          this.meta.updateTag({ content: this.siteInfo.ECStore_Features, property: 'og:description' });
          break;
        }
        //  優惠券
        case 2: {
          this.voucherList = data.List_Voucher;
          break;
        }
        //  所有商品
        case 3: {
          this.productList = data.List_Product;
          break;
        }
      }
    });
  }

  /** 展開內容
   * @param section 1 簡介文字, 2 分店資訊, 3 營業時間
   */
  unfold(section: number): void {
    if (this.unfolded.includes(section)) {
      this.unfolded.splice(this.unfolded.indexOf(section), 1);
    } else {
      this.unfolded.push(section);
    }
  }

  /** 外送/外帶點餐按鈕
   * @param url 外連連結
   */
  sendDelivery(url: string): void {
    // 先判斷是否有登入
    if (!this.appService.loginState) {
      this.appService.logoutModal();
    } else {
      // 把商店code帶到DeliveryInfo頁面
      window.open(url);
    }
  }

}

/** 顯示網站資訊 */
interface siteObj {
  /** 店家詳細頁的網站名稱 */
  siteName: string;
  /** 店家詳細頁的網站連結 */
  siteUrl: string;
}

/** 周邊探索 - 詳細 Request */
interface Request_AreaDetail extends Model_ShareData {
  /** 搜尋Model */
  SearchModel: Search_AreaDetail;
}

/** 搜尋Model */
interface Search_AreaDetail {
  /** 電商編碼 */
  ECStore_Code: number;
  /** 書籤Index  1:商家介紹  2: 優惠卷 3: 線上商城 */
  TabIndex: number;
}
