import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Request_MemberThird, Response_MemberThird } from '../member.component';
import { AuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { ModalService } from '@app/shared/modal/modal.service';
import jwt_decode from 'jwt-decode';
import { environment } from '@env/environment';

@Component({
  selector: 'app-third-binding',
  templateUrl: './third-binding.component.html',
  styleUrls: ['../member.scss']
})
export class ThirdBindingComponent implements OnInit, OnDestroy {
  // 第三方登入 User容器
  // public thirdUser: SocialUser;
  // 第三方登入Request
  public thirdRequest: Request_MemberThird = new Request_MemberThird();
  /** 第三方資訊類型 1: FB 2: Line 3:Google 5:Apple */
  public bindMode = 0;
  /** 第三方綁定狀態 */
  public bindStatus: bindStatus = new bindStatus();
  /** 設備是否為Apple (是則不顯示Apple綁定) */
  public isApple: boolean;
  /** api 路徑 */
  public apiUrl = environment.apiUrl;
  /** 新版第三方request (目前LINE使用) */
  public newThirdRequest: NewThirdBindRequest = new NewThirdBindRequest();


  constructor(public appService: AppService, private oauthService: OauthService,
              public modal: ModalService, private router: ActivatedRoute) {
    this.detectApple();
  }

  ngOnInit() {

    this.readThirdData();
    // this.authService.authState.subscribe((user: SocialUser) => {
    //   this.thirdUser = user;
    //   // 為了FB登入特例處理，多判斷 this.bindMode > 0 才呼叫API
    //   if (this.thirdUser !== null && this.bindMode > 0) {
    //     this.thirdRequest = {
    //       SelectMode: 1,
    //       Store_Note: '',
    //       Mode: this.bindMode,
    //       Token: this.thirdUser.id,
    //       JsonData: JSON.stringify(this.thirdUser)
    //     };
    //     this.thirdbind(this.thirdRequest, this.bindMode);
    //   }
    // });

    // LINE 第三方社群綁定
    this.newThirdRequest.DeviceType = this.appService.isApp !== null ? '1' : '0';
    this.newThirdRequest.CustomerInfo = sessionStorage.getItem('CustomerInfo');
    this.newThirdRequest.mode = 2;

  }

  /** 讀取社群帳號 */
  readThirdData(): void {
    if (this.appService.loginState === false) {
      this.oauthService.loginPage(location.pathname);
    } else {
      const request: Request_MemberThird = {
        SelectMode: 3,
        Store_Note: ''
      };
      this.appService.toApi('Member', '1506', request).subscribe((data: Response_MemberThird) => {
        if (data !== null) {
          data.List_UserThird.forEach((value) => {
            switch (value.UserThird_Mode) {
              case 1: // FB
                this.bindStatus.fb = true;
                break;
              case 2: // Line
                this.bindStatus.line = true;
                break;
              case 3: // Google
                this.bindStatus.google = true;
                break;
              case 5: // Apple
                this.bindStatus.apple = true;
                break;
            }
          });

          // 判斷第三方是否綁定失敗（目前只有Line）
          // queryParams Error 1:LINE已被綁定 2:LINE 授權失敗
          if (this.router.snapshot.queryParams.Mobii_ThirdBind === 'false' && this.router.snapshot.queryParams.Mode !== undefined && this.router.snapshot.queryParams.Error !== undefined) {
            let msg = '';
            let mode = '';
            switch (this.router.snapshot.queryParams.Error) {
              case '1':
                msg = '帳號已被綁定';
                break;
              default:
                msg = '驗證失敗，請重新取得授權';
                break;
            }

            switch (this.router.snapshot.queryParams.Mode) {
              case '2':
                mode = 'Line@';
                break;
            }

            if (!this.bindStatus.line) {
              this.modal.show('message', { initialState: { success: false, message: `${mode}${msg}`, showType: 1 } });
            }
          }
        }
      });
    }
  }

  /** 進行第三方綁定
   * @param mode 綁定方式 1:FB 2:Line 3:Google 5:Apple
   */
  signInWiththirdBind(mode: number): void {
    if (this.appService.loginState === false) {
      this.oauthService.loginPage(location.pathname);
    } else {
      this.bindMode = mode;
      // switch (mode) {
      //   case 1:
      //     this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
      //     break;
      //   case 2:
      //     (document.getElementById('postLineBind') as HTMLFormElement).submit();
      //     // this.appService.openBlock();
      //     break;
      //   case 3:
      //     this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
      //     break;
      //   case 5:
      //     this.modal.appleLogin({}).subscribe(appleUser => {
      //       if (appleUser !== null) {
      //         const idTokenModel: any = jwt_decode(appleUser.authorization.id_token);
      //         const appleToken = idTokenModel.sub;
      //         this.thirdRequest = {
      //           SelectMode: 1,
      //           Store_Note: '',
      //           Mode: this.bindMode,
      //           Token: appleToken,
      //           JsonData: JSON.stringify(appleUser)
      //         };
      //         this.thirdbind(this.thirdRequest, this.bindMode);
      //       }
      //     });
      //     break;
      // }
    }
  }

  /** 登入初始化需帶入的 state，Apple、Line登入都需要用到
  * @description unix timestamp 前後相反後前4碼+ 10碼隨機英文字母 (大小寫不同)
  * @returns state 的值
  */
  getState(): string {
    // 取得 unix
    const dateTime = Date.now();
    const timestampStr = Math.floor(dateTime / 1000).toString();
    // 前後相反
    let reverseTimestamp = '';
    for (let i = timestampStr.length - 1; i >= 0; i--) {
      reverseTimestamp += timestampStr[i];
    }
    // 取前4碼
    const timestampFirst4 = reverseTimestamp.substring(0, 4);
    // 取得10個隨機英文字母，組成字串
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    };
    const engLettersArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let randomEngLetter = '';
    for (let x = 0; x < 10; x++) {
      const randomInt = getRandomInt(engLettersArr.length);
      randomEngLetter += engLettersArr[randomInt];
    }
    // 組成 state
    return timestampFirst4 + randomEngLetter;
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
  thirdbind(request: Request_MemberThird, mode: number): void {
    this.appService.toApi('Member', '1506', request).subscribe((data: Response_MemberThird) => {
      if (data !== null) {
        switch (mode) {
          case 1: //  FB
            this.bindStatus.fb = true;
            break;
          case 2: // Line
            this.bindStatus.line = true;
            break;
          case 3: // Google
            this.bindStatus.google = true;
            break;
          case 5: // Apple
            this.bindStatus.apple = true;
            break;
        }
        // this.authService.signOut();
      }
    });
  }

  /** 社群帳號解除 */
  onDelThird(mode: number): void {
    this.modal.confirm({ initialState: { message: '是否確定要解除綁定?' } }).subscribe(res => {
      if (res) {
        // this.appService.openBlock();
        const request: Request_MemberThird = {
          SelectMode: 2,
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

/** 第三方綁定狀態Model */
class bindStatus {
  fb?: boolean;
  line?: boolean;
  google?: boolean;
  apple?: boolean;
}

/** 新版第三方綁定Request */
class NewThirdBindRequest {
  /** 裝置類型 0: web 1:app */
  DeviceType: string;
  /** 第三方資訊類型 1: FB 2: Line 3:Google 5:Apple */
  mode: number;
  /** 消費者包 */
  CustomerInfo: string;
  /** 消費者編碼 */
  User_Code?: string;
}
