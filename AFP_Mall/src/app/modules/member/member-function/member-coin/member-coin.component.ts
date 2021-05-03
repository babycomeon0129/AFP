import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AppService } from '@app/app.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { SwiperOptions } from 'swiper';
import { Model_ShareData, AFP_Game, AFP_UserPoint, AFP_ChannelVoucher, AFP_Voucher } from '@app/_models';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation} from '@app/animations';

@Component({
  selector: 'app-member-coin',
  templateUrl: './member-coin.component.html',
  styleUrls: ['../../member/member.scss', './member-coin.scss'],
  animations: [layerAnimation]
})
export class MemberCoinComponent implements OnInit {
  public info: Response_MemberPoint = new Response_MemberPoint();
  public pointHistory: AFP_UserPoint[] = [];
  public pointType = 0;
  /** 同頁滑動切換 0:本頁 1:點數紀錄 */
  public layerTrig = 0;

  /** 活動分類導覽 */
  public boxTabs: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 10,
    breakpoints: {
      320: {
        slidesPerView: 3,
        spaceBetween: 10
      },
      480: {
        slidesPerView: 4,
        spaceBetween: 15
      },
      640: {
        slidesPerView: 5,
        spaceBetween: 20
      }
    }
  };

  constructor(public appService: AppService, private route: ActivatedRoute, public router: Router, public modal: ModalService,
              private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('Mobii Point - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - M Points。這裡會顯示 Mobii! 用戶擁有的 M Points 點數與歷史使用紀錄。點數累積的方式包括每日登入、玩遊戲、購物、乘車等回饋。'});
    this.meta.updateTag({content: 'Mobii Point - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - M Points。這裡會顯示 Mobii! 用戶擁有的 M Points 點數與歷史使用紀錄。點數累積的方式包括每日登入、玩遊戲、購物、乘車等回饋。', property: 'og:description'});

    // 從會員中心或任務牆進來則隱藏返回鍵
    this.appService.showBack = this.route.snapshot.queryParams.showBack === 'true';
  }

  ngOnInit() {
    this.appService.openBlock();
    const getInfo: Request_MemberPoint = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 4,
      SearchModel: {
        VouChannel_Code: 1111111
      }
    };
    this.appService.toApi('Member', '1509', getInfo).subscribe((info: Response_MemberPoint) => {
      this.info = info;
    });
    // 從會員中心或任務牆進來則隱藏返回鍵
    this.appService.showBack = this.route.snapshot.queryParams.showBack === 'true';
  }

  getHistory(): void {
    this.appService.openBlock();
    const getHistory: Request_MemberPoint = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 5,
      SearchModel: {
        UserPoint_Type: this.pointType
      }
    };
    this.appService.toApi('Member', '1509', getHistory).subscribe((point: Response_MemberPoint) => {
      this.pointHistory = point.List_UserPoint;
    });
  }

  /** 前往優惠券詳細
   * APP特例處理: 若是從會員過去則要隱藏返回鍵
   */
  goDetail(voucher: AFP_Voucher) {
    let code = 0;
    if (voucher.Voucher_UserVoucherCode === null) {
      code = voucher.Voucher_Code;
    } else {
      code = voucher.Voucher_UserVoucherCode;
    }
    if (this.route.snapshot.queryParams.showBack === undefined ) {
      this.router.navigate(['/Voucher/VoucherDetail', code]);
    } else {
      if (this.route.snapshot.queryParams.showBack) {
        const navigationExtras: NavigationExtras = {
          queryParams: { showBack: true }
        };
        this.router.navigate(['/Voucher/VoucherDetail', code], navigationExtras);
      }
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
            this.appService.onVoucher(voucher);
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
        this.appService.onVoucher(voucher);
      }
  }
}

/** 會員點數 RequestModel */
class Request_MemberPoint extends Model_ShareData {
  /** 區別操作(通用) 4:查詢-列表  5:查詢-待入帳等 */
  SelectMode: number;
  /** 搜尋模組 */
  SearchModel?: Search_MemberPoint;
}

/** 會員點數 RequestModel 搜尋模組 */
class Search_MemberPoint {
  /** 點數類型 0: 待入賬，1: 獲得，11: 已使用 */
  UserPoint_Type?: number;
  /** 優惠卷頻道編碼 */
  VouChannel_Code?: number;
}

/** 會員點數 ResponseModel */
class Response_MemberPoint {
  /** 會員總點數 */
  TotalPoint: number;
  /** 即將到期-點數 */
  DaylinePoint: number;
  /** 即將到期-日期 */
  Dayline: Date;
  /** 遊戲 */
  List_Game: AFP_Game[];
  /** 會員點數 */
  List_UserPoint: AFP_UserPoint[];
  /** 優惠券資料 */
  List_Voucher: AFP_ChannelVoucher[];
}
