import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { OauthService, ResponseOauthApi } from '@app/modules/oauth/oauth.service';
import { MessageModalComponent } from '@app/shared/modal/message-modal/message-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
// APP的Interface
declare var BindingSocialJSInterface: any;

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../member.scss']
})
export class SettingComponent implements OnInit {

  constructor(public appService: AppService, public route: ActivatedRoute, public location: Location, private router: Router,
              private meta: Meta, private title: Title, private oauthService: OauthService, public cookieService: CookieService) {
    this.title.setTitle('帳號設定 - Mobii!');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ content: '帳號設定 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '', property: 'og:description' });
  }

  ngOnInit() {
  }

  /** 前往關於我 */
  goToAbout(): void {
    window.open('https://mobii.ai/Official/about.html?utm_source=MobiiWeb&utm_medium=Footer', '_self');
  }

  toLogout(): void {
    // 清除session、cookie、我的收藏資料，重置登入狀態及通知數量
    this.appService.loginState = false;
    this.appService.userLoggedIn = false;
    this.appService.userFavCodes = [];
    this.appService.pushCount = 0;
    this.oauthService.onLogout();
    if (this.appService.isApp === null || this.appService.isApp === 0) {
      this.location.back();
    }
  }

  /** 「艾斯身份識別_密碼修改1」 */
  passwordUpdate() {
    this.oauthService.toModifyEyes(this.appService.isApp, this.oauthService.cookiesGet('idToken').cookieVal)
    .subscribe((data: string) => {
      if (data.indexOf('https') === 0) {
        location.href = data;
      }
    });
  }
  /** 判斷是否為App，如果是則跳到App原生  */
  // MOB-3425 前端隱藏
  // goIf(): void {
  //   if (this.appService.isApp === null) {
  //     this.router.navigate(['/Member/ThirdBinding']);
  //   } else {
  //     if (navigator.userAgent.match(/android/i)) {
  //       //  Android
  //       BindingSocialJSInterface.goAppBindingSocialPage();
  //     } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
  //       //  IOS
  //       (window as any).webkit.messageHandlers.BindingSocialJSInterface.postMessage({ action: 'goAppBindingSocialPage' });
  //     }
  //   }
  // }
}
