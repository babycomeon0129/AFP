import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { Model_ShareData, AFP_ADImg } from '@app/_models';
import { Request_MemberThird, Response_MemberThird } from '../member.component';
import { Router } from '@angular/router';
import { ModalService } from '@app/shared/modal/modal.service';
import { SwiperOptions } from 'swiper';
import { MemberService } from '@app/modules/member/member.service';
import { AuthService, SocialUser } from 'angularx-social-login';
import { BsModalService } from 'ngx-bootstrap';

declare var AppJSInterface: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../member.scss', './home.scss']
})
export class HomeComponent implements OnInit {
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


  constructor(public appService: AppService, public oauthService: OauthService,
              private router: Router, private modal: ModalService,
              public memberService: MemberService) {
  }

  ngOnInit() {
    this.readIndexData();
    // this.memberService.readProfileData();
    //  第三方登入取得資料
    // this.authService.authState.subscribe((user) => {
    //   this.thirdUser = user;
    //   if (this.thirdUser !== null && this.thirdClick) {
    //     this.thirdClick = !this.thirdClick;
    //     this.appService.openBlock();
    //     // 社群帳號綁定
    //     const request: Request_MemberThird = {
    //       SelectMode: 1,
    //       Mode: this.memberService.bindMode,
    //       Token: this.thirdUser.id,
    //       JsonData: JSON.stringify(this.thirdUser)
    //     };
    //     this.appService.toApi('Member', '1506', request).subscribe((data: Response_MemberThird) => {
    //       this.memberService.readThirdData();
    //     });
    //   }
    // });
  }

  /** 讀取首頁資料 */
  readIndexData(): void {
    const request: Request_MemberIndex = {
      SelectMode: 4
    };

    this.appService.toApi('Member', '1501', request).subscribe((data: Response_MemberIndex) => {
      this.indexData = data;
    });
  }

  /** 前往設定（判斷登入與否） */
  goToSetting(): void {
    if (this.appService.loginState === false) {
      this.oauthService.loginPage(location.pathname);
    } else {
      this.router.navigate(['/Member/Setting']);
    }
  }

  /** 前往廣告
   * @param ADImg 廣告
   */
  adRouter(ADImg: AFP_ADImg): void {
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
   * @param pageCode 通知原生開啟頁面 0: 我的卡片 1: 我的車票 2: 我的點餐 3: 我的優惠券 4: 我的收藏 5: 我的訂單 6: M Point
   */
  pageRoute(page: string, pageCode: number): void {
    if (this.appService.loginState === false) {
      this.oauthService.loginPage(location.pathname);
    } else {
      if (page === '0') {
        this.modal.show('message',  { class: 'modal-dialog-centered',
        initialState: { success: true, message: '敬請期待!', showType: 1 } });
      } else {
        switch (pageCode) {
          case 3:
          case 4:
            this.appService.isApp !== null ?　this.appShowMemberPage(pageCode) : this.routerForApp(page);
            break;
          default:
            this.routerForApp(page);
            break;
        }
      }
    }
  }

  /** 通知會員中心打開原生頁 0: 我的卡片 1: 我的車票 2: 我的點餐 3: 我的優惠券 4: 我的收藏 5: 我的訂單 6: M Point */
  appShowMemberPage(pageCode: number): void {
    if (navigator.userAgent.match(/android/i)) {
      //  Android
      AppJSInterface.goAppPage(pageCode);
    } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
      //  IOS
      (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'goAppPage', page: pageCode });
    }
  }

  /** App 特例處理router */
  routerForApp(page: string): void {
    this.router.navigate([page], {
      queryParams: {
        showBack: true
      }
    });
  }

}

/** 會員中心首頁 - RequestModel */
interface Request_MemberIndex extends Model_ShareData {
}

/** 會員中心首頁 - ResponseModel */
class Response_MemberIndex extends Model_ShareData {
  /** 會員點數 */
  UserInfo_Point: number;
  /** 廣告列表 11001 */
  ADImg_Mid: AFP_ADImg[];
  /** 廣告列表 11002 */
  ADImg_Btm: AFP_ADImg[];
}
