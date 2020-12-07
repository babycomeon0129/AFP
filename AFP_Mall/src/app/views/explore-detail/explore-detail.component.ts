import { Component, ViewChild, OnInit, DoCheck, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { AppService } from 'src/app/app.service';
import {
  Response_AreaDetail, AFP_ECStore, Request_AreaDetail, AFP_Voucher, AFP_Product,
  Request_MemberUserVoucher, Response_MemberUserVoucher, AFP_ECStoreExtType
} from '../../_models';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'ngx-useful-swiper';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from '../../shared/modal/modal.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-explore-detail',
  templateUrl: './explore-detail.component.html',
  styleUrls: ['../../../dist/style/shopping-index.min.css']
})
export class ExploreDetailComponent implements OnInit, DoCheck {
  @ViewChild('kvSwiper', { static: false }) kvSwiper: SwiperComponent;

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
  public ecStoreExtType: AFP_ECStoreExtType = new AFP_ECStoreExtType();
  /** JustKa連結 */
  public JustKaUrl: string;
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
  /** 變化追蹤（登入狀態） */
  private serviceDiffer: KeyValueDiffer<string, any>;
  /** 分享至社群時顯示的文字 */
  public textForShare: string;
  /** APP特例處理  */
  public showBackBtn = false;
  /** 確認資料是否下載完畢  */
  public dataLoad = false;

  constructor(public appService: AppService, private router: Router, private route: ActivatedRoute, public modal: ModalService,
              private differs: KeyValueDiffers, private meta: Meta, private title: Title) {
    this.serviceDiffer = this.differs.find({}).create();
    // 取得商家/景點編碼
    this.siteCode = Number(this.route.snapshot.params.ECStore_Code);
    // APP從會員中心進來則隱藏返回鍵
    if (this.route.snapshot.queryParams.showBack === 'true') {
      this.showBackBtn = true;
    }
  }

  ngOnInit() {
    this.readTabData(1);

    // 若是登入狀態下則顯示收藏狀態
    if (this.appService.loginState === true) {
      this.appService.showFavorites();
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
        this.readTabData(1);
      }
    });
  }

  // tslint:disable: max-line-length
  /** 讀取分頁資料
   * @param index 分頁代號
   */
  readTabData(index: number) {
    this.tabNo = index;
    const request: Request_AreaDetail = {
      User_Code: sessionStorage.getItem('userCode'),
      SearchModel: {
        ECStore_Code: this.siteCode,
        TabIndex: index
      }
    };
    // request
    this.appService.openBlock();
    this.appService.toApi('Area', '1403', request).subscribe((data: Response_AreaDetail) => {
      switch (index) {
        //  商家簡介
        case 1: {
          this.siteInfo = data.Model_ECStore;
          // Enter轉換行
          if (this.siteInfo.ECStore_Features !== null) {
            this.siteInfo.ECStore_Features = this.siteInfo.ECStore_Features.replace(/(?:\r\n|\r|\n)/g, '<br/>');
          }
          if (this.siteInfo.ECStore_OpenTime !== null) {
            this.siteInfo.ECStore_OpenTime = this.siteInfo.ECStore_OpenTime.replace(/(?:\r\n|\r|\n)/g, '<br/>');
          }
          this.branchList = data.List_ECStore;
          // 顯示網站判定
          if (data.Model_ECStore.ECStore_WebURL !== null && data.Model_ECStore.ECStore_WebURL.trim() !== '') {
            this.websitesArr.push({siteName: '官方網站', siteUrl: data.Model_ECStore.ECStore_WebURL});
          }
          if (data.Model_ECStore.ECStore_FBURL !== null && data.Model_ECStore.ECStore_FBURL.trim() !== '') {
            this.websitesArr.push({siteName: 'Facebook', siteUrl: data.Model_ECStore.ECStore_FBURL});
          }
          if (data.Model_ECStore.ECStore_IGURL !== null && data.Model_ECStore.ECStore_IGURL.trim() !== '') {
            this.websitesArr.push({siteName: 'Instagram', siteUrl: data.Model_ECStore.ECStore_IGURL});
          }
          // 確認類型後顯示類型文字、定義分享文字
          let typeText = '';
          if (this.siteInfo.ECStore_Type < 2000) {
            typeText = '店家';
            this.textForShare = `嘿！我有好店要跟你分享喔！趕快進來看看吧！這是「${this.siteInfo.ECStore_ShowName}」，快來跟我一起進來逛逛吧！

            ${location.href}`;
          } else {
            typeText = '周邊';
            this.textForShare = `嘿！我發現新地方要跟你分享喔！趕快進來看看吧！這是「${this.siteInfo.ECStore_ShowName}」，快來跟我一起了解一下吧！

            ${location.href}`;
          }
          // 設置meta
          this.title.setTitle(this.siteInfo.ECStore_ShowName + '｜' + typeText + '介紹 - Mobii!');
          this.meta.updateTag({ name: 'description', content: this.siteInfo.ECStore_Features });
          this.meta.updateTag({ content: this.siteInfo.ECStore_ShowName + '｜' + typeText + '介紹 - Mobii!', property: 'og:title' });
          this.meta.updateTag({ content: this.siteInfo.ECStore_Features , property: 'og:description' });
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
      this.dataLoad = true;
      this.ecStoreExtType = data.Model_ECStoreExtType;
      this.JustKaUrl = data.JustKaUrl;
    });
  }

  /**
   * 優惠券按鈕行為
   * @param voucher 所選優惠券資訊
   * @param storeCode 優惠券所屬店編碼
   * Voucher_FreqName: 0「已兌換」(平台), 1「兌換」, 2「前往商店」, 3「已使用」, 5「去使用」
   */
  onVoucher(voucher: AFP_Voucher) {
    if (this.appService.loginState === true) {
      switch (voucher.Voucher_IsFreq) {
        case 1:
          // 加入到「我的優惠券」
          const request: Request_MemberUserVoucher = {
            User_Code: sessionStorage.getItem('userCode'),
            SelectMode: 1,
            Voucher_Code: voucher.Voucher_Code,
            Voucher_ActivityCode: null,
            SearchModel: {
              SelectMode: null
            }
          };
          this.appService.toApi('Member', '1510', request).subscribe((data: Response_MemberUserVoucher) => {
            // 按鈕顯示改變
            voucher.Voucher_IsFreq = data.Model_Voucher.Voucher_IsFreq;
            voucher.Voucher_FreqName = data.Model_Voucher.Voucher_FreqName;
          });
          break;
        case 2:
          // 導去商品tab
          this.readTabData(3);
          break;
        case 5:
          // 前往優惠券詳細
          this.router.navigate(['/VoucherDetail', voucher.Voucher_Code]);
          break;
      }
    } else {
      this.appService.loginPage();
    }
  }

  /** 展開內容
   * 1 簡介文字, 2 分店資訊, 3 營業時間
   */
  unfold(section: number) {
    if (this.unfolded.includes(section)) {
      this.unfolded.splice(this.unfolded.indexOf(section), 1);
    } else {
      this.unfolded.push(section);
    }
  }

  /** 外送點餐按鈕 */
  sendDelivery() {
    // 先判斷是否有登入
    if (this.appService.loginState) {
      // 把商店code帶到DeliveryInfo頁面
       window.open(`/DeliveryInfo/${this.siteCode}`);
    } else {
      this.appService.loginPage();
    }
  }

  ngDoCheck(): void {
    const change = this.serviceDiffer.diff(this.appService);
    if (change) {
      change.forEachChangedItem(item => {
        // 若在此頁的優惠券分頁登入則更新優惠券資料
        if (item.key === 'loginState' && item.currentValue === true && this.tabNo === 2) {
          this.readTabData(2);
        }
      });
    }
  }

}

interface siteObj {
  siteName: string;
  siteUrl: string;
}
