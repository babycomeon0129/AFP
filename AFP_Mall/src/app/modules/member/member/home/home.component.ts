import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';
import { AppService } from '@app/app.service';
import { AFP_ADImg, Model_ShareData } from '@app/modules/member/_module-member';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { SwiperOptions } from 'swiper';

declare var AppJSInterface: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../member.scss', './home.scss']
})
export class HomeComponent implements OnInit {
  // 第三方登入 User容器
  // thirdUser: SocialUser;
  thirdClick = false;
  /** 登入後返回頁面 */
  public backUri: string;
  /** 首頁資訊（廣告列表） */
  public indexData: Response_MemberIndex;
  /** 首頁下方廣告 swiper */
  public bottomAd: SwiperOptions = {
    scrollbar: {
      el: '.swiper-container .swiper-scrollbar',
      hide: true
    }
  };
  /** 會員頭貼 */
  public userAvatar = 'https://picsum.photos/300/300';

  constructor(public appService: AppService, public oauthService: OauthService, private callApp: AppJSInterfaceService,
              public router: Router, private modal: ModalService, private route: ActivatedRoute, public location: Location) {
  }

  ngOnInit() {
    this.backUri = encodeURI(location.href.replace(location.origin, ''));
    if (this.oauthService.cookiesGet('idToken').cookieVal !== '' && this.oauthService.cookiesGet('idToken').cookieVal !== 'undefined') {
      this.appService.loginState = true;
      this.readIndexData();
    }
    if (this.appService.isApp === 1 || this.oauthService.cookiesGet('deviceType').cookieVal > '0') {
      this.callApp.appShowMobileFooter(true);
    }
  }

  /** 讀取首頁資料 */
  readIndexData(): void {
    if (this.oauthService.cookiesGet('idToken').cookieVal !== '' && this.oauthService.cookiesGet('idToken').cookieVal !== 'undefined') {
      const request: Model_ShareData = {
        SelectMode: 4
      };

      this.appService.toApi('Member', '1501', request).subscribe((data: Response_MemberIndex) => {
        this.indexData = JSON.parse(JSON.stringify(data));
        if (this.indexData.User_Avatar !== null && this.indexData.User_Avatar !== 'null') {
          if (this.indexData.User_Avatar === undefined) { return; }
          if (this.indexData.User_Avatar.indexOf('http') > -1) {
            this.userAvatar = this.indexData.User_Avatar;
          }
        }
      });
    }
  }

  /** 前往設定（判斷登入與否） */
  goToSetting(): void {
    if (!this.appService.loginState) {
      this.appService.logoutModal();
    } else {
      this.router.navigate(['/Member/Setting'],
      { queryParams: { isApp: this.appService.isApp }});
    }
  }

  /** 前往主頁面(依是否登入判定)
   * @param page 頁面相對路徑（「敬請期待」傳'0'）
   * @param pageCode 通知原生開啟頁面 0: 我的卡片 1: 我的車票 2: 我的點餐 3: 我的優惠券 4: 我的收藏 5: 我的訂單 6: M Point
   */
  pageRoute(page: string, pageCode: number): void {
    // 未登入(跳提示)
    if (!this.appService.loginState) {
      this.oauthService.msgModal(this.appService.isApp, '請先登入');
      return;
    }
    // 已登入
    if (page === '0') {
      this.modal.show('message', {
        class: 'modal-dialog-centered',
        initialState: { success: true, message: '敬請期待!', showType: 1 }
      });
    } else {
      switch (pageCode) {
        case 3:
        case 4:
          // 3: 我的優惠券 4: 我的收藏 皆為原生
          this.appService.isApp === 1 ? this.appShowMemberPage(pageCode) : this.routerForApp(page);
          break;
        default:
          this.routerForApp(page);
          break;
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
      relativeTo: this.route,
      queryParams: {
        showBack: true
      }
    });
  }

}


/** 會員中心首頁 - ResponseModel */
class Response_MemberIndex extends Model_ShareData {
  /** 會員點數 */
  UserInfo_Point: number;
  /** 會員手機國碼 */
  User_Country: string;
  /** 會員姓名 */
  User_NickName: string;
  /** 會員頭貼 */
  User_Avatar: string;
  /** 廣告列表 11001 */
  ADImg_Mid: AFP_ADImg[];
  /** 廣告列表 11002 */
  ADImg_Btm: AFP_ADImg[];
}
