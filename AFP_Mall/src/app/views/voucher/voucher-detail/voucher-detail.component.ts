import { Component, OnInit, DoCheck, KeyValueDiffer, KeyValueDiffers, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Model_ShareData, AFP_Voucher, AFP_UserVoucher, AFP_ECStore, Request_MemberUserVoucher,
  Response_MemberUserVoucher, Request_MemberCheckStatus, Response_MemberCheckStatus
} from '../../../_models';
import { AppService } from 'src/app/app.service';
import { Router, NavigationExtras } from '@angular/router';
import { ModalService } from '../../../shared/modal/modal.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-voucher-detail',
  templateUrl: './voucher-detail.component.html',
  styleUrls: ['../../../../dist/style/offers.min.css']
})
export class VoucherDetailComponent implements OnInit, DoCheck, OnDestroy {
  /** UUID */
  public UUid: number;
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
  /** 今日日期 */
  public today = new Date();
  /** 優惠券下架日期 */
  public offlineDate: Date;
  /** 核銷5秒Interval */
  public checkTimer;
  /** 核銷3分鐘倒數timeout */
  public timer3Mins;
  /** 變化追蹤（登入狀態） */
  private serviceDiffer: KeyValueDiffer<string, any>;
  /** 分享至社群時顯示的文字 */
  public textForShare: string;
  public showBackBtn = false; // APP特例處理

  constructor(public appService: AppService, private route: ActivatedRoute, private router: Router, public modal: ModalService,
              private differs: KeyValueDiffers, private meta: Meta, private title: Title) {
    this.serviceDiffer = this.differs.find({}).create();
    this.voucherCode = this.route.snapshot.params.Voucher_Code;
    if (this.voucherCode.toString().substring(0, 2) === '46') {
      this.selectMode = 4;
    } else {
      this.selectMode = 5;
    }
    // APP特例處理: 若是從會員進來則顯示返回鍵
    if (this.route.snapshot.queryParams.showBack !== undefined && this.route.snapshot.queryParams.showBack === 'true') {
      this.showBackBtn = true;
    }
  }

  ngOnInit() {
    this.readVoucherData();
  }

  /** 讀取優惠券資料 */
  readVoucherData() {
    const request: Request_ECVoucherDetail = {
      User_Code: sessionStorage.getItem('userCode'),
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

      // tslint:disable: max-line-length
      this.title.setTitle(this.voucherData.Voucher_ExtName + ' - Mobii!');
      this.meta.updateTag({ name: 'description', content: this.voucherData.Voucher_Content });
      this.meta.updateTag({ content: this.voucherData.Voucher_ExtName + ' - Mobii!', property: 'og:title' });
      this.meta.updateTag({ content: this.voucherData.Voucher_Content, property: 'og:description' });
      this.textForShare = `嘿！我有好康優會要跟你分享喔！趕快進來看看吧！這是「${this.voucherData.Voucher_ExtName}」，趕快去領不然被領光就沒得領囉！
      ${location.href}`;
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
            message: `<div class="no-data"><img src="../../../../img/shopping/payment-failed.png"><p>兌換失敗！</p></div>`
          };
          this.modal.show('message', { initialState });
        }
      });
    } else {
      this.onVoucher(voucher);
    }
  }

  /** 優惠券按鈕行為
   * @param voucher 優惠券
   * Voucher_FreqName: 0 已兌換 1 兌換 2 去商店 3 已使用 4 兌換完畢（限一元搶購） 5 使用 6 已逾期（限我的優惠+優惠券詳細） 7 未生效（限我的優惠+優惠券詳細）
   */
  onVoucher(voucher: AFP_Voucher) {
    if (this.appService.loginState === true) {
      switch (voucher.Voucher_IsFreq) {
        case 1:
          // 兌換（加入到「我的優惠券」）
          const request: Request_MemberUserVoucher = {
            User_Code: sessionStorage.getItem('userCode'),
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
                message: `<div class="no-data"><img src="../../../../img/shopping/payment-ok.png"><p>兌換成功！</p></div>`
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
          this.appService.tLayer = []; // APP 特例處理(APP QRCode的返回鍵是history.back()不是backLayer())
          this.appService.callLayer('.useoffers');
          this.checkWritenOff();
          break;
      }
    } else {
      this.appService.loginPage();
    }
  }

  /** 檢查優惠券是否已被核銷 */
  checkWritenOff() {
    // 每5秒問一次API是否已核銷
    this.checkTimer = setInterval(() => {
      const request: Request_MemberCheckStatus = {
        User_Code: sessionStorage.getItem('userCode'),
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
          this.appService.backLayer();
          // showType: 999核銷成功後顯示廣告圖片
          this.modal.show('message', { initialState: { success: true, message: data.AFP_UserVoucher.VoucherUsedMessage, showType: 999, adImgList: data.List_ADImg, voucherName: data.AFP_UserVoucher.Voucher_Name } });
          return false;
        }
      });
    }, 5000);

    // 三分鐘後(若還在此頁)則停止timer
    this.timer3Mins = setTimeout(() => {
      this.modal.show('message', { initialState: { success: false, message: '連線逾時，請重新操作。', showType: 1 } });
      clearInterval(this.checkTimer);
      this.appService.backLayer();
    }, 180000);
  }

  /** 關閉顯示QR Code */
  closeQRCode() {
    this.appService.backLayer();
    clearInterval(this.checkTimer);
    clearTimeout(this.timer3Mins);
  }

  ngDoCheck(): void {
    const change = this.serviceDiffer.diff(this.appService);
    if (change) {
      change.forEachChangedItem(item => {
        if (item.key === 'loginState' && item.currentValue === true) {
          // 在此頁登入則更新優惠券資料
          this.readVoucherData();
        }
      });
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.checkTimer);
    clearTimeout(this.timer3Mins);
  }

}

export interface Request_ECVoucherDetail extends Model_ShareData {
  SearchModel: Search_ECVoucherDetail;
}

export interface Search_ECVoucherDetail {
  Voucher_Code?: number;
  UserVoucher_Code?: number;
}

export interface Response_ECVoucherDetail extends Model_ShareData {
  AFP_Voucher: AFP_Voucher;
  AFP_UserVoucher: AFP_UserVoucher;
  List_ECStore: AFP_ECStore[];
}
