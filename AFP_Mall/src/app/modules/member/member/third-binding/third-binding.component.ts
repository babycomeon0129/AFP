import { Component, OnInit, OnDestroy } from '@angular/core';
import { Request_MemberThird, Response_MemberThird } from '../member.component';
import { AuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { AppService } from 'src/app/app.service';
import { ModalService } from '../../../../shared/modal/modal.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-third-binding',
  templateUrl: './third-binding.component.html',
  styleUrls: ['../../../../../dist/style/member.min.css']
})
export class ThirdBindingComponent implements OnInit, OnDestroy {
  // 第三方登入 User容器
  public thirdUser: SocialUser;
  // 第三方登入Request
  public thirdReques: Request_MemberThird = new Request_MemberThird();
  /** 第三方資訊類型 1 FB, 3 Google 5 Apple */
  public bindMode = 0;
  /** 第三方綁定狀態 */
  public bindStatus: bindStatus = new bindStatus();
  /** 設備是否為Apple (是則不顯示Apple綁定) */
  public isApple: boolean;


  constructor(public appService: AppService, private authService: AuthService, public modal: ModalService) {
    this.detectApple();
  }

  ngOnInit() {

    this.readThirdData();
    this.authService.authState.subscribe((user: SocialUser) => {
      // 為了FB登入特例處理，多判斷 this.bindMode > 0 才呼叫API
      if (user !== null && this.bindMode > 0) {
        this.thirdUser = user;
        this.thirdReques = {
          SelectMode: 1,
          User_Code: sessionStorage.getItem('userCode'),
          Store_Note: '',
          Mode: this.bindMode,
          Token: this.thirdUser.id,
          JsonData: JSON.stringify(this.thirdUser)
        };
        this.thirdbind(this.thirdReques, this.bindMode);
      }
    });
  }


  /** 讀取社群帳號 */
  readThirdData(): void {
    const request: Request_MemberThird = {
      SelectMode: 3,
      User_Code: sessionStorage.getItem('userCode'),
      Store_Note: ''
    };
    this.appService.toApi('Member', '1506', request).subscribe((data: Response_MemberThird) => {
      if (data !== null) {
        data.List_UserThird.forEach((value) => {
          switch (value.UserThird_Mode) {
            case 1: //  FB
              this.bindStatus.fb = true;
              break;
            case 3: //  Google
              this.bindStatus.google = true;
              break;
            case 5: // Apple
              this.bindStatus.apple = true;
              break;
          }
        });
      }
    });

  }

  /** FB登入按鈕 */
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.bindMode = 1;
  }

  /** Google登入按鈕 */
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.bindMode = 3;
  }

  /** Apple登入按鈕 */
  signInWithApple(): void {
    this.bindMode = 5;
    this.modal.appleLogin({}).subscribe(appleUser => {
      if (appleUser !== null) {
        const idTokenModel = jwt_decode(appleUser.authorization.id_token);
        const appleToken = idTokenModel.sub;
        this.thirdReques = {
          SelectMode: 1,
          User_Code: sessionStorage.getItem('userCode'),
          Store_Note: '',
          Mode: this.bindMode,
          Token: appleToken,
          JsonData: JSON.stringify(appleUser)
        };
        this.thirdbind(this.thirdReques, this.bindMode);
      }
    });
  }

  /** 判斷是否為Apple設備 */
  detectApple(): void {
    const iOSDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'];
    if (iOSDevices.includes(navigator.platform) || (navigator.userAgent.includes('Mac'))) {
      this.isApple = true;
    } else {
      this.isApple = false;
    }
  }




  /** 社群帳號綁定
   * @param mode 1:FB 3:Google 5:Apple
   */
  thirdbind(request:　Request_MemberThird, mode: number): void {
    this.appService.toApi('Member', '1506', request).subscribe((data: Response_MemberThird) => {
      if (data !== null) {
        switch (mode) {
          case 1: //  FB
            this.bindStatus.fb = true;
            break;
          case 3: // Google
            this.bindStatus.google = true;
            break;
          case 5: // Apple
            this.bindStatus.apple = true;
            break;
        }
        this.authService.signOut();
      }
    });
  }

  /** 社群帳號解除 */
  onDelThird(mode: number): void {
    this.modal.confirm({ initialState: { message: '是否確定要解除綁定?' } }).subscribe(res => {
      if (res) {
        this.appService.openBlock();
        const request: Request_MemberThird = {
          SelectMode: 2,
          User_Code: sessionStorage.getItem('userCode'),
          Mode: mode
        };

        this.appService.toApi('Member', '1506', request).subscribe((data: Response_MemberThird) => {
          //    this.memberService.readThirdData();
        });
      }
    });
  }

  ngOnDestroy() {
    this.bindMode = 0;
  }

}

class bindStatus {
  fb?: boolean;
  google?: boolean;
  apple?: boolean;
}