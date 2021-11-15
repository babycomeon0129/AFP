import { OauthService } from '@app/modules/oauth/oauth.service';
import { Injectable } from '@angular/core';
import { AppService } from '@app/app.service';
import { CookieService } from 'ngx-cookie-service';
import {
  Response_MemberProfile, Request_MemberProfile, Request_MemberThird, Response_MemberThird,
  AFP_UserThird
} from './member/member.component';

@Injectable()
export class MemberService {
  /** 我的檔案資料 */
  public userProfile: Response_MemberProfile = new Response_MemberProfile();
  /** FB第三方資訊 */
  public FBThird: AFP_UserThird;
  /** Google第三方資訊 */
  public GoogleThird: AFP_UserThird;
  /** Apple 第三方資訊 */
  public AppleThird: AFP_UserThird;
  /** 第三方資訊類型：1 FB, 3 Google */
  public bindMode = 0;
  /** 標籤切換 (目前用於我的訂單[MemberOrde]  21: 電子票券 1: 購物商城 */
  public tabSwitch = 1;
  /** 訂單狀態切換(目前用於我的訂單[MemberOrde]  1: 處理中 2: 待收貨 3:已完成 4:退貨 */
  public statusSwitch = 1;

  constructor(private appService: AppService, private oauthService: OauthService, private cookieService: CookieService) { }

  /** 讀取我的檔案（會員首頁、我的檔案、手機驗證皆會使用） */
  readProfileData() {
    if (this.oauthService.cookiesGet('idToken').c !== '' && this.oauthService.cookiesGet('idToken').c !== 'undefined') {
      const request: Request_MemberProfile = {
        SelectMode: 4
      };
      return new Promise(resolve => {
        this.appService.toApi('Member', '1502', request).subscribe((data: Response_MemberProfile) => {
          this.userProfile = data;

          if (this.userProfile !== null) {
            this.appService.userName = this.userProfile.User_NickName;
            // 解決ngx-bootstrap 套件日期減一天問題
            if (this.userProfile.UserProfile_Birthday !== null) {
              this.userProfile.UserProfile_Birthday = new Date(this.userProfile.UserProfile_Birthday);
            }
          }
          resolve(true);
        });
      });
    }
  }

  /** 讀取社群帳號（會員首頁、社群帳號綁定皆會使用） */
  readThirdData(): void {
    // 初始化
    this.FBThird = null;
    this.GoogleThird = null;
    this.AppleThird = null;
    const request: Request_MemberThird = {
      SelectMode: 3,
      Store_Note: ''
    };
    this.appService.toApi('Member', '1506', request).subscribe((data: Response_MemberThird) => {
      if (data !== null) {
        data.List_UserThird.forEach((value) => {
          switch (value.UserThird_Mode) {
            case 1: //  FB
              this.FBThird = value;
              break;
            case 3: //  Google
              this.GoogleThird = value;
              break;
            case 5: // Apple
              this.AppleThird = value;
              break;
          }
        });
      }
    });
  }
}
