import { Injectable } from '@angular/core';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import * as moment from 'moment';
import { Request_MemberProfile, Response_MemberProfile } from './member/member.component';

@Injectable()
export class MemberService {
  /** 我的檔案資料 */
  public userProfile: Response_MemberProfile = new Response_MemberProfile();
  /** 標籤切換 (目前用於我的訂單[MemberOrder]  21: 電子票券 1: 購物商城 */
  public tabSwitch = 1;
  /** 訂單狀態切換(目前用於我的訂單[MemberOrder]  1: 處理中 2: 待收貨 3:已完成 4:退貨 */
  public statusSwitch = 1;

  constructor(private appService: AppService, private oauthService: OauthService) { }

  /** 讀取我的檔案（會員首頁、我的檔案、手機驗證皆會使用） */
  readProfileData() {
    if (this.oauthService.cookiesGet('idToken').cookieVal !== '' && this.oauthService.cookiesGet('idToken').cookieVal !== 'undefined') {
      const request: Request_MemberProfile = {
        SelectMode: 4
      };
      return new Promise(resolve => {
        this.appService.toApi('Member', '1502', request).subscribe((data: Response_MemberProfile) => {
          this.userProfile = data;
          if (this.userProfile !== null) {
            this.appService.userName = this.userProfile.User_NickName;
            if (this.userProfile.UserProfile_Birthday !== null) {
              this.userProfile.UserProfile_Birthday = moment(data.UserProfile_Birthday).format('YYYY-MM-DD');
              // this.userProfile.UserProfile_Birthday = this.userProfile.UserProfile_Birthday;
            }
          }
          resolve(true);
        });
      });
    }
  }
}
