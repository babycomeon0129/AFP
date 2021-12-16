import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../member.scss']
})
export class SettingComponent implements OnInit {

  constructor(public appService: AppService, public route: ActivatedRoute, public location: Location,
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
    this.oauthService.onLogout(this.appService.isApp);
  }

  /** 「艾斯身份識別_變更密碼1」 */
  passwordUpdate() {
    this.oauthService.toModifyEyes(this.appService.isApp, this.oauthService.cookiesGet('idToken').cookieVal)
    .subscribe((data: string) => {
      if (data !== undefined && data.indexOf('https') === 0) {
        location.href = data;
      } else {
        if (data !== '996600001') {
          this.appService.logoutModal('變更密碼失敗');
        }
      }
    });
  }

}
