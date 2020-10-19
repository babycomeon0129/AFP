import { Component, OnInit, OnDestroy } from '@angular/core';
import { Request_MemberThird, Response_MemberThird } from '../member.component';
import { AuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { AppService } from 'src/app/app.service';
import { ModalService } from 'src/app/service/modal.service';
import { MemberService } from '../member.service';
import { Request_AFPThird } from 'src/app/_models';

@Component({
  selector: 'app-third-binding',
  templateUrl: './third-binding.component.html',
  styleUrls: ['../../../../dist/style/member.min.css']
})
export class ThirdBindingComponent implements OnInit, OnDestroy {
  // 第三方登入 User容器
  public thirdUser: SocialUser;
  // 第三方登入Request
  public thirdReques: Request_MemberThird = new Request_MemberThird();
  public thirdClick = false;
  /** 第三方資訊類型 1 FB, 3 Google */
  public bindMode = 0;

  constructor(public appService: AppService, private authService: AuthService, public modal: ModalService,
              public memberService: MemberService) {
  }

  ngOnInit() {
    this.memberService.readThirdData();
    this.authService.authState.subscribe((user: SocialUser) => {
      if (user !== null) {
        this.thirdUser = user;
        this.thirdReques = {
          SelectMode: 1,
          User_Code: sessionStorage.getItem('userCode'),
          Store_Note: '',
          Mode: this.bindMode,
          Token: this.thirdUser.id,
          JsonData: JSON.stringify(this.thirdUser)
        };
        console.log(this.thirdReques);
        // tslint:disable-next-line: no-shadowed-variable
        this.appService.toApi('Member', '1506', this.thirdReques).subscribe(( data: Response_MemberThird) => {
          console.log(data);
        });

      } else {
        console.log('data = null');
      }
  });
}

ngOnDestroy() {
  this.authService.signOut();
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
  this.thirdClick = true;
  //  this.thirdbind(1);
}

  /** Google登入按鈕 */
  public signInWithGoogle(): void {
  this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  this.bindMode = 3;
  this.thirdClick = true;
  //  this.thirdbind(3);
}

/** 社群帳號綁定
 * @param mode 1:FB 3:Google 5:Apple
 */
// thirdbind(mode: number) {

//     console.log(user);
//     const request: Request_MemberThird = {
//       SelectMode: 1,
//       User_Code: sessionStorage.getItem('userCode'),
//       Store_Note: '',
//       Mode: mode,
//       Token: user.id,
//       JsonData: JSON.stringify(user)
//     };
//     // SelectMode = 1 時沒有丟 List_UserThird
//     this.appService.toApi('Member', '1506', request).subscribe( (data: Response_MemberThird) => {
//       console.log(data);
//     });
//   });
// }

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
      // SelectMode = 2 時沒有丟 List_UserThird
      this.appService.toApi('Member', '1506', request).subscribe((data: Response_MemberThird) => {
        this.memberService.readThirdData();
      });
    }
  });
}

}
