import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Model_ShareData, AFP_Voucher, AFP_UserVoucher, AFP_ECStore, Request_MemberUserVoucher,
  Response_MemberUserVoucher, Request_MemberCheckStatus, Response_MemberCheckStatus
} from '@app/_models';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ModalService } from '@app/shared/modal/modal.service';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation } from '@app/animations';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';

@Component({
  selector: 'app-voucher-detail',
  templateUrl: './voucher-detail.component.html',
  styleUrls: ['./voucher-detail.scss'],
  animations: [layerAnimation]
})
export class VoucherDetailComponent implements OnInit, OnDestroy {
  /** UUID */
  public UUid: string;
  /** 優惠券編號（從會員中心進來: 會員優惠券編碼 (UserVoucher_Code)，從其他地方: 優惠券編碼 ） */
  public voucherCode: number;
  /** 搜尋模式（優惠券編號開頭 46(優惠券): 4，47(使用者優惠券): 5）; 若是使用者優惠券則不顯示分享鈕 */
  public selectMode: number;
  /** 優惠券資訊 */
  public voucherData: AFP_Voucher;
  /** 使用者優惠券 */
  public userVoucher: AFP_UserVoucher;
  /** 實體分店資訊 */
  public storeData: AFP_ECStore[];
   /** 實體分店資訊收合 true: 打開 false: 收起 */
   public storeCollapse = false;
  /** 今日日期 */
  public today = new Date();
  /** 優惠券下架日期 */
  public offlineDate: Date;
  /** 核銷5秒Interval */
  public checkTimer: NodeJS.Timer;
  /** 核銷3分鐘倒數timeout */
  public timer3Mins: NodeJS.Timer;
  /** 分享至社群時顯示的文字 */
  public textForShare: string;
  /** APP分享使用的url */
  public APPShareUrl: string;
  /** 同頁滑動切換 0:本頁 1:使用優惠券 */
  public layerTrig = 0;

  constructor(public appService: AppService, private oauthService: OauthService, private route: ActivatedRoute, private router: Router,
              public modal: ModalService, private meta: Meta, private title: Title, private callApp: AppJSInterfaceService) {
    this.voucherCode = this.route.snapshot.params.Voucher_Code;
    if (this.voucherCode.toString().substring(0, 2) === '46') {
      this.selectMode = 4;
    } else {
      this.selectMode = 5;
    }
  }

  ngOnInit() {
    this.readVoucherData();
  }

  /** 讀取優惠券資料 */
  readVoucherData(): void {
    const request: Request_ECVoucherDetail = {
      SelectMode: this.selectMode,
      SearchModel: {
        Voucher_Code: this.voucherCode,
        UserVoucher_Code: this.voucherCode
      }
    };
    this.appService.toApi('EC', '1206', request).subscribe((data: Response_ECVoucherDetail) => {
      this.voucherData = data.AFP_Voucher;
      this.UUid = data.UUID;
      // 若使用者已使用次數為null則改為0（在此頁兌換且隨即使用時會顯示，且在成功使用後會 +1）
      if (this.voucherData.VoucherUseCount == null) {
        this.voucherData.VoucherUseCount = 0;
      }
      this.userVoucher = data.AFP_UserVoucher;
      this.storeData = data.List_ECStore;
      this.offlineDate = new Date(this.voucherData.Voucher_OfflineDate); // 避免優惠券已下架但還能按「兌換」的情況

      this.title.setTitle(this.voucherData.Voucher_ExtName + ' - Mobii!');
      this.meta.updateTag({ name: 'description', content: this.voucherData.Voucher_Content });
      this.meta.updateTag({ content: this.voucherData.Voucher_ExtName + ' - Mobii!', property: 'og:title' });
      this.meta.updateTag({ content: this.voucherData.Voucher_Content, property: 'og:description' });
      this.textForShare = `嘿～跟你分享好店優惠！「${this.voucherData.Voucher_Title}（${this.voucherData.Voucher_ExtName}）」，快到Mobii!領券喔！`;
      this.APPShareUrl = data.AppShareUrl;
    });
  }

  /** 顯示星期幾中文
   * @param date 日期
   */
  dayOfWeek(date: Date): string {
    const day = new Date(date).getDay(); // day of the week (0-6)
    switch (day) {
      case 0:
        return '日';
      case 1:
        return '一';
      case 2:
        return '二';
      case 3:
        return '三';
      case 4:
        return '四';
      case 5:
        return '五';
      case 6:
        return '六';
    }
  }

  /** 兌換優惠券
   * @param voucher 優惠券詳細
   */
  toVoucher(voucher: AFP_Voucher): void {
    if (this.appService.loginState === false) {
      this.oauthService.loginPage(this.appService.isApp, location.pathname);
    } else {
      if (voucher.Voucher_DedPoint > 0 && voucher.Voucher_IsFreq === 1) {
        this.modal.confirm({
          initialState: {
            message: `請確定是否扣除 Mobii! Points ${voucher.Voucher_DedPoint} 點兌換「${voucher.Voucher_ExtName}」？`
          }
        }).subscribe(res => {
          if (res) {
            this.onVoucher(voucher);
          } else {
            const initialState = {
              success: true,
              type: 1,
              message: `<div class="no-data no-transform"><img src="../../../../img/shopping/payment-failed.png"><p>兌換失敗！</p></div>`
            };
            this.modal.show('message', { initialState });
          }
        });
      } else {
        this.onVoucher(voucher);
      }
    }
  }

  /** 優惠券按鈕行為
   * @param voucher 優惠券
   * Voucher_FreqName: 0 已兌換 1 兌換 2 去商店 3 已使用 4 兌換完畢（限一元搶購） 5 使用 6 已逾期（限我的優惠+優惠券詳細） 7 未生效（限我的優惠+優惠券詳細）
   */
  onVoucher(voucher: AFP_Voucher): void {
    switch (voucher.Voucher_IsFreq) {
      case 1:
        // 兌換（加入到「我的優惠券」）
        const request: Request_MemberUserVoucher = {
          SelectMode: 1, // 新增
          Voucher_Code: voucher.Voucher_Code, // 優惠券Code
          Voucher_ActivityCode: null, // 優惠代碼
          SearchModel: {
            SelectMode: null
          }
        };
        this.appService.toApi('Member', '1510', request).subscribe((data: Response_MemberUserVoucher) => {
          // 按鈕顯示改變
          voucher.Voucher_IsFreq = data.Model_Voucher.Voucher_IsFreq;
          voucher.Voucher_FreqName = data.Model_Voucher.Voucher_FreqName;
          // 放上QRCode
          this.userVoucher = data.AFP_UserVoucher;
          // 如果這個券用點數兌換，跳成功視窗
          if (voucher.Voucher_DedPoint > 0) {
            const initialState = {
              success: true,
              type: 1,
              message: `<div class="no-data no-transform"><img src="../../../../img/shopping/payment-ok.png"><p>兌換成功！</p></div>`
            };
            this.modal.show('message', { initialState });
          }
        });
        break;
      case 2:
        // 去商店
        if (voucher.Voucher_URL !== null) {
          if (voucher.Voucher_URL.substring(0, 1) === '/') {
            const navigationExtras: NavigationExtras = {
              queryParams: { navNo: 3 }
            };
            this.router.navigate([voucher.Voucher_URL], navigationExtras);
          } else {
            window.open(voucher.Voucher_URL, voucher.Voucher_URLTarget);
          }
        }
        break;
      case 5:
        // 使用
        this.layerTrig = 1;
        this.callApp.appShowBackButton(false);
        this.checkWritenOff();
        break;
    }
  }

  /** 檢查優惠券是否已被核銷 */
  checkWritenOff(): void {
    // 每5秒問一次API是否已核銷
    this.checkTimer = setInterval(() => {
      const request: Request_MemberCheckStatus = {
        SelectMode: 1,
        QRCode: this.userVoucher.UserVoucher_QRCode
      };
      this.appService.toApi('Member', '1516', request).subscribe((data: Response_MemberCheckStatus) => {
        // 若使用日期 !== null，則跳出訊息，3秒後clearInterval()、回到上一頁
        if (data.AFP_UserVoucher.UserVoucher_UsedState === 2) {
          clearInterval(this.checkTimer);
          // 保留此次使用前的已使用次數(因為後端不回傳，回null)
          const usedTimes = this.voucherData.VoucherUseCount;
          // 更新優惠券資料
          // this.voucherData = data.AFP_Voucher;
          // 更新優惠券按鈕為已使用
          this.voucherData.Voucher_IsFreq = 3;
          this.voucherData.Voucher_FreqName = '已使用';
          this.userVoucher = data.AFP_UserVoucher;
          // 更新已使用次數
          this.voucherData.VoucherUseCount = usedTimes + 1;
          clearTimeout(this.timer3Mins);
          this.layerTrig = 0;
          this.callApp.appShowBackButton(true);
          // showType: 999核銷成功後顯示廣告圖片
          this.modal.show('message', {
            initialState: {
              success: true, message: data.AFP_UserVoucher.VoucherUsedMessage,
              showType: 999,
              adImgList: data.List_ADImg,
              voucherName: data.AFP_UserVoucher.Voucher_Name
            }
          });
          return false;
        }
      });
    }, 5000);

    // 三分鐘後(若還在此頁)則停止timer
    this.timer3Mins = setTimeout(() => {
      this.modal.show('message', { initialState: { success: false, message: '連線逾時，請重新操作。', showType: 1 } });
      clearInterval(this.checkTimer);
      this.layerTrig = 0;
      this.callApp.appShowBackButton(true);
    }, 180000);
  }

  /** 關閉顯示QR Code */
  closeQRCode(): void {
    this.router.navigate(['/Voucher/VoucherDetail', this.voucherCode], { queryParams: { showBack: this.appService.showBack } });
    this.layerTrig = 0;
    this.callApp.appShowBackButton(true);
    clearInterval(this.checkTimer);
    clearTimeout(this.timer3Mins);
  }

  /** 前往ExploreDetail(App特例處理，從會員中心進來顯示返回鍵) */
  goExploreDetail(ECStore_Code: number): void {
    if (this.appService.isApp !== null) {
      this.callApp.goAppExploreDetail(ECStore_Code);
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: { showBack: this.route.snapshot.queryParams.showBack }
      };
      this.router.navigate(['/Explore/ExploreDetail', ECStore_Code], navigationExtras);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.checkTimer);
    clearTimeout(this.timer3Mins);
  }

}

/** 優惠卷詳細 RequestModel */
interface Request_ECVoucherDetail extends Model_ShareData {
  /** 搜尋Model */
  SearchModel: Search_ECVoucherDetail;
}

/** 優惠卷詳細 SearchModel */
interface Search_ECVoucherDetail {
  /** 優惠卷Code */
  Voucher_Code?: number;
  /** 使用者優惠卷Code */
  UserVoucher_Code?: number;
}

/** 優惠卷詳細 Responsedel */
interface Response_ECVoucherDetail extends Model_ShareData {
  /** 優惠卷 */
  AFP_Voucher: AFP_Voucher;
  /** 使用者優惠卷 */
  AFP_UserVoucher: AFP_UserVoucher;
  /** 優惠卷 - 線下商家 */
  List_ECStore: AFP_ECStore[];
}

