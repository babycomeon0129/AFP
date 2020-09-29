import { Component, OnInit } from '@angular/core';
import { Request_MemberThird, Response_MemberThird } from '../member.component';
import { AuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { AppService } from 'src/app/app.service';
import { ModalService } from 'src/app/service/modal.service';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-third-binding',
  templateUrl: './third-binding.component.html',
  styleUrls: ['../../../../dist/style/member.min.css']
})
export class ThirdBindingComponent implements OnInit {
  // 第三方登入 User容器
  thirdUser: SocialUser;
  thirdClick = false;
  /** 第三方資訊類型 1 FB, 3 Google */
  public bindMode = 0;

  constructor(public appService: AppService, private authService: AuthService, public modal: ModalService,
              public memberService: MemberService) {
  }

  ngOnInit() {
    this.memberService.readThirdData();
  }

  /** 讀取社群帳號 */
  readThirdData() {
    // 初始化
    this.memberService.FBThird = null;
    this.memberService.GoogleThird = null;
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
              this.memberService.FBThird = value;
              break;
            case 3: //  Google
              this.memberService.GoogleThird = value;
              break;
          }
        });
      }
    });
  }

  /** FB登入按鈕 */
  public signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.bindMode = 1;
    this.thirdClick = true;
  }

  /** Google登入按鈕 */
  public signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.bindMode = 3;
    this.thirdClick = true;
  }

  /** 社群帳號解除 */
  onDelThird(mode: number) {
    this.modal.confirm({ initialState: { message: '是否確定要解除綁定?' } }).subscribe(res => {
      if (res) {
        this.appService.openBlock();
        const request: Request_MemberThird = {
          SelectMode: 2,
          User_Code: sessionStorage.getItem('userCode'),
          Mode: mode
        };

        this.appService.toApi('Member', '1506', request).subscribe((data: Response_MemberThird) => {
          this.memberService.readThirdData();
        });
      }
    });
  }

}
