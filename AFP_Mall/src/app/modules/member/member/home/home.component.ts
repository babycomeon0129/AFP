import { Component, OnInit, DoCheck, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Model_ShareData, AFP_ADImg } from '@app/_models';
import { Request_MemberThird, Response_MemberThird } from '../member.component';
import { Router } from '@angular/router';
import { ModalService } from '@app/shared/modal/modal.service';
import { SwiperOptions } from 'swiper';
import { MemberService } from '@app/modules/member/member.service';
import { AuthService, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../member.scss', './home.scss']
})
export class HomeComponent implements OnInit, DoCheck {
  // 第三方登入 User容器
  thirdUser: SocialUser;
  thirdClick = false;

  /** 首頁資訊（廣告列表） */
  public indexData: Response_MemberIndex;
  /** 首頁下方廣告 swiper */
  public botttomAd: SwiperOptions = {
    scrollbar: {
      el: '.swiper-container .swiper-scrollbar',
      hide: true
    }
  };
  /** 變化追蹤（登入狀態） */
  private serviceDiffer: KeyValueDiffer<string, any>;

  constructor(public appService: AppService, private router: Router, public modal: ModalService,
              private differs: KeyValueDiffers, public memberService: MemberService, private authService: AuthService) {
    this.serviceDiffer = this.differs.find({}).create();
  }

  ngOnInit() {
    this.readIndexData();
    if (this.appService.loginState === true) {
      this.memberService.readProfileData();
    }
    //  第三方登入取得資料
    this.authService.authState.subscribe((user) => {
      if (user != null && this.thirdClick) {
        this.thirdClick = !this.thirdClick;
        this.appService.openBlock();
        this.thirdUser = user;
        // 社群帳號綁定
        const request: Request_MemberThird = {
          SelectMode: 1,
          User_Code: sessionStorage.getItem('userCode'),
          Mode: this.memberService.bindMode,
          Token: this.thirdUser.id,
          JsonData: JSON.stringify(this.thirdUser)
        };
        this.appService.toApi('Member', '1506', request).subscribe((data: Response_MemberThird) => {
          this.memberService.readThirdData();
        });
      }
    });
  }

  /** 讀取首頁資料 */
  readIndexData() {
    const request: Request_MemberIndex = {
      SelectMode: 4,
      User_Code: sessionStorage.getItem('userCode')
    };

    this.appService.toApi('Member', '1501', request).subscribe((data: Response_MemberIndex) => {
      this.indexData = data;
    });
  }

  /** 前往設定（判斷登入與否） */
  goToSetting() {
    if (this.appService.loginState) {
      this.router.navigate(['/Member/Setting']);
    } else {
      this.appService.loginPage();
    }
  }

  /** 前往廣告
   * @param ADImg 廣告
   */
  adRouter(ADImg: AFP_ADImg) {
    if (ADImg.ADImg_URL !== '/') {
      if (ADImg.ADImg_URL.indexOf('http') !== -1) {
        // 站外連結
        window.open(ADImg.ADImg_URL, ADImg.ADImg_URLTarget);
      } else {
        // 站內連結
        if (this.appService.isApp !== null) {
          this.router.navigate([ADImg.ADImg_URL], { queryParams: { isApp: this.appService.isApp, showBack: true } });
        } else {
          // web
          this.router.navigate([ADImg.ADImg_URL]);
        }
      }
    }
  }

  /** 前往主頁面(依是否登入判定)
   * @param page 頁面相對路徑（「敬請期待」傳'0'）
   */
  pageRoute(page: string) {
    if (this.appService.loginState === false) {
      this.appService.loginPage();
    } else {
      if (page === '0') {
        this.modal.show('message', { initialState: { success: true, message: '敬請期待!', showType: 1 } });
      } else {
        //  APP 特例處理
        this.router.navigate([page], {
          queryParams: {
            showBack: true
          }
        });
      }
    }
  }

  ngDoCheck(): void {
    const change = this.serviceDiffer.diff(this.appService);
    if (change) {
      change.forEachChangedItem(item => {
        if (item.key === 'loginState' && item.currentValue === true) {
          this.memberService.readProfileData();　// 顯示會員暱稱及魔幣點數
        }
      });
    }
  }

}

// tslint:disable-next-line: no-empty-interface
export interface Request_MemberIndex extends Model_ShareData {
}

export class Response_MemberIndex extends Model_ShareData {
  UserInfo_Point: number;
  ADImg_Mid: AFP_ADImg[];
  ADImg_Btm: AFP_ADImg[];
}