import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { layerAnimation } from '@app/animations';
import { AppService } from '@app/app.service';
import { Request_MemberPoint } from '@app/modules/member/_module-member';
import { ModalService } from '@app/shared/modal/modal.service';
import { AFP_ChannelVoucher, AFP_Game, AFP_UserPoint, AFP_Voucher } from '@app/_models';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-member-coin',
  templateUrl: './member-coin.component.html',
  styleUrls: ['../../member/member.scss', './member-coin.scss'],
  animations: [layerAnimation]
})
export class MemberCoinComponent implements OnInit {
  /** 會員點數 Response */
  public info: Response_MemberPoint = new Response_MemberPoint();
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

  constructor(public appService: AppService, public router: Router, public modal: ModalService,
              private meta: Meta, private title: Title) {
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
        this.appService.blockUI.stop();
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
