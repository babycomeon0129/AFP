import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { SwiperOptions } from 'swiper';
import { AFP_Game, AFP_UserPoint, AFP_ChannelVoucher, AFP_Voucher } from '@app/_models';
import { Request_MemberPoint } from '@app/modules/member/_module-member';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation } from '@app/animations';

@Component({
  selector: 'app-member-coin',
  templateUrl: './member-coin.component.html',
  styleUrls: ['../../member/member.scss', './member-coin.scss'],
  animations: [layerAnimation]
})
export class MemberCoinComponent implements OnInit {
  /** 會員點數 Response */
  public info: Response_MemberPoint = new Response_MemberPoint();
  /** 會員點數 */
  public pointHistory: AFP_UserPoint[] = [];
  /** 點數類型 */
  public pointType = 0;
  /** 同頁滑動切換-點數紀錄顯示與否 0:本頁 1:點數紀錄 */
  public coinHistoryOpen = 0;
  /** 遊戲列表seeAll顯示與否 */
  public gameSeeAll = false;

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

  constructor(public appService: AppService, private oauthService: OauthService, public router: Router, public modal: ModalService,
              private meta: Meta, private title: Title, private route: ActivatedRoute, private activatedRoute: ActivatedRoute) {
    this.title.setTitle('Mobii Point - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - M Points。這裡會顯示 Mobii! 用戶擁有的 M Points 點數與歷史使用紀錄。點數累積的方式包括每日登入、玩遊戲、購物、乘車等回饋。' });
    this.meta.updateTag({ content: 'Mobii Point - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - M Points。這裡會顯示 Mobii! 用戶擁有的 M Points 點數與歷史使用紀錄。點數累積的方式包括每日登入、玩遊戲、購物、乘車等回饋。', property: 'og:description' });

  }

  ngOnInit() {
    if (!this.appService.loginState) {
      this.appService.logoutModal();
    } else {
      this.appService.openBlock();
      const getInfo: Request_MemberPoint = {
        SelectMode: 4,
        SearchModel: {
          VouChannel_Code: 1111111
        }
      };
      this.appService.toApi('Member', '1509', getInfo).subscribe((info: Response_MemberPoint) => {
        this.info = info;
      });
      // 取得queryParams參數coinHistoryOpen，點數紀錄顯示與否(0關閉、1開啟)
      this.activatedRoute.queryParams.subscribe(params => {
        if (typeof params.coinHistory !== 'undefined') {
          this.coinHistoryOpen = Number(params.coinHistory);
        }
        if (params.coinHistory === '1') {
          this.getHistory();
        }
      });
    }
  }

  /** 前往優惠券詳細
   * APP特例處理: 若是從會員過去則要隱藏返回鍵
   */
  goDetail(voucher: AFP_Voucher): void {
    let code = 0;
    if (voucher.Voucher_UserVoucherCode === null) {
      code = voucher.Voucher_Code;
    } else {
      code = voucher.Voucher_UserVoucherCode;
    }
    this.router.navigate(['/Voucher/VoucherDetail', code], { queryParams: { showBack: this.appService.showBack}});
  }

  /** 歷史紀錄 */
  getHistory(): void {
    if (!this.appService.loginState) {
      this.appService.logoutModal();
    } else {
      this.appService.openBlock();
      const getHistory: Request_MemberPoint = {
        SelectMode: 5,
        SearchModel: {
          UserPoint_Type: this.pointType
        }
      };
      this.appService.toApi('Member', '1509', getHistory).subscribe((point: Response_MemberPoint) => {
        this.pointHistory = point.List_UserPoint;
      });
    }
  }

  /** 關閉點數紀錄
   * 從MemberCoin進入, 關閉layerTrig; 其餘情況關閉layerTrig並回到上一頁(避免停留在本頁)
   * 從其他頁面進入, showBack: this.appService.showBack
   * 配合APP點選歷史紀錄要導去網頁coinHistory: 0關閉、1開啟
   */
  coinHistoryClose(): void {
    this.coinHistoryOpen = 0;
    if (this.appService.prevUrl.indexOf('MemberCoin') > -1) {
      this.router.navigate(['/MemberFunction/MemberCoin'], {queryParams: {coinHistory: 0, showBack: this.appService.showBack}});
    } else {
      history.back();
    }
  }
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
