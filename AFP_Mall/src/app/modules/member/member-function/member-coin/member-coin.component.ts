import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { SwiperOptions } from 'swiper';
import { Model_ShareData, AFP_Game, AFP_UserPoint, AFP_ChannelVoucher, Request_MemberUserVoucher,
        Response_MemberUserVoucher, AFP_Voucher } from 'src/app/_models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-member-coin',
  templateUrl: './member-coin.component.html',
  styleUrls: ['../../../../../dist/style/member.min.css', '../../../../../dist/style/member-function.min.css']
})
export class MemberCoinComponent implements OnInit {
  public info: Response_MemberPoint = new Response_MemberPoint();
  public pointHistory: AFP_UserPoint[] = [];
  public pointType = 0;
  public showBackBtn = false; // APP特例處理

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

  constructor(public appService: AppService, private route: ActivatedRoute, public router: Router,
              private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('Mobii Point - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - M Points。這裡會顯示 Mobii! 用戶擁有的 M Points 點數與歷史使用紀錄。點數累積的方式包括每日登入、玩遊戲、購物、乘車等回饋。'});
    this.meta.updateTag({content: 'Mobii Point - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - M Points。這裡會顯示 Mobii! 用戶擁有的 M Points 點數與歷史使用紀錄。點數累積的方式包括每日登入、玩遊戲、購物、乘車等回饋。', property: 'og:description'});

    // 從會員中心或任務牆進來則隱藏返回鍵
    if (this.route.snapshot.queryParams.showBack === 'true') {
      this.showBackBtn = true;
    }
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
  }

  getHistory(): void {
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

}

export class Request_MemberPoint extends Model_ShareData {
  SelectMode: number;
  SearchModel?: Search_MemberPoint;
}

export class Search_MemberPoint {
  UserPoint_Type?: number;
  VouChannel_Code?: number;
}

export class Response_MemberPoint {
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
