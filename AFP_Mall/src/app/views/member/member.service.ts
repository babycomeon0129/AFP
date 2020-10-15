import { Injectable } from '@angular/core';
import { AppService } from '../../app.service';
import { Response_MemberProfile, Request_MemberProfile, Request_MemberThird, Response_MemberThird,
        AFP_UserThird } from './member.component';

@Injectable()
export class MemberService {
  /** 我的檔案資料 */
  public userProfile: Response_MemberProfile = new Response_MemberProfile();
  /** FB第三方資訊 */
  public FBThird: AFP_UserThird;
  /** Google第三方資訊 */
  public GoogleThird: AFP_UserThird;
  /** 第三方資訊類型：1 FB, 3 Google */
  public bindMode = 0;

  constructor(private appService: AppService) { }

  /** 讀取我的檔案（會員首頁、我的檔案、手機驗證皆會使用） */
  readProfileData() {
    const request: Request_MemberProfile = {
      SelectMode: 4,
      User_Code: sessionStorage.getItem('userCode')
    };
    return new Promise(resolve => {
      this.appService.toApi('Member', '1502', request).subscribe((data: Response_MemberProfile) => {
        this.userProfile = data;
        console.log(this.userProfile);
        if (this.userProfile.UserProfile_Birthday !== null) {
          this.userProfile.UserProfile_Birthday = new Date(this.userProfile.UserProfile_Birthday); // 解決ngx-bootstrap 套件日期減一天問題
        }
        resolve(true);
      });
    });
  }

  /** 讀取社群帳號（會員首頁、社群帳號綁定皆會使用） */
  readThirdData() {
    // 初始化
    this.FBThird = null;
    this.GoogleThird = null;
    const request: Request_MemberThird = {
      SelectMode: 3,
      User_Code: sessionStorage.getItem('userCode'),
      Store_Note: ''
    };
    this.appService.toApi('Member', '1506', request).subscribe((data: Response_MemberThird) => {
      if (data.List_UserThird.length > 0) {
        data.List_UserThird.forEach((value) => {
          switch (value.UserThird_Mode) {
            case 1: //  FB
              this.FBThird = value;
              break;
            case 3: //  Google
              this.GoogleThird = value;
              break;
          }
        });
      }
    });
  }
}
