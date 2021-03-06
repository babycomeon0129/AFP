import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { MessageModalComponent } from '@app/shared/modal/message-modal/message-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../member.scss']
})
export class SettingComponent implements OnInit {

  constructor(public appService: AppService, public route: ActivatedRoute, public location: Location,
              private meta: Meta, private title: Title, private oauthService: OauthService,
              public cookieService: CookieService, private bsModalService: BsModalService) {
    this.title.setTitle('帳號設定 - Mobii!');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ content: '帳號設定 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '', property: 'og:description' });
  }

  ngOnInit() {
  }

  toLogout(): void {
    // 清除session、cookie、我的收藏資料，重置登入狀態及通知數量
    this.appService.loginState = false;
    this.appService.userLoggedIn = false;
    this.appService.userFavCodes = [];
    this.appService.alertStatus = false;
    this.oauthService.onLogout(this.appService.isApp);
  }

  /** 「艾斯身份識別_變更密碼1」取得isApp及idToken */
  passwordUpdate() {
    this.oauthService.toModifyEyes(this.appService.isApp, this.oauthService.cookiesGet('idToken').cookieVal)
    .subscribe((data: string) => {
      /** 「艾斯身份識別_變更密碼3」變更密碼成功導址，失敗跳dialog */
      if (data !== null && data.includes('https')) {
        location.href = data;
      } else {
        if (data !== '996600001') {
          this.bsModalService.show(MessageModalComponent, {
            class: 'modal-dialog-centered',
            initialState: {
              success: false,
              message: '變更密碼失敗',
              showType: 5,
              leftBtnMsg: '我知道了',
              rightBtnMsg: '重新登入',
              rightBtnFn: () => {
                this.toLogout();
                if (!this.appService.isApp) {
                  this.oauthService.loginPage(this.appService.isApp, encodeURI(location.href.replace(location.origin, '')));
                }
              }
            }
          });
        }
      }
    });
  }

}
