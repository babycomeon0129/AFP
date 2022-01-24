import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';
import { AppService } from '@app/app.service';
import { OauthService, ResponseOauthApi, ViewConfig } from '@app/modules/oauth/oauth.service';
import { MessageModalComponent } from '@app/shared/modal/message-modal/message-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-oauth-login',
  templateUrl: './oauth-login.component.html',
  styleUrls: ['./oauth-login.component.scss',
    '../../../../styles/layer/shopping-footer.scss'],
})
export class OauthLoginComponent implements OnInit, AfterViewInit {

  /** 頁面切換 0:帳號升級公告 1:帳號整併 2:未登入(無idToken) 3:已登入(有idToken) */
  public viewType = '2';
  /** 升級公告頁標頭 */
  public viewTitle: string;
  /** 艾斯身份識別登入API uri */
  public AuthorizationUri: string;
  /** 艾斯身份識別登入 列表 */
  public viewData: ViewConfig[] = [];
  /** 艾斯身份識別登入 FormPost渲染 */
  public viewList = [];
  /** 多重帳號列表 */
  public List_MultipleUser = [];
  /** 使用者UserInfoId */
  public UserInfoId: number;
  /** 使用者grantCode */
  public grantCode = '';
  /** 登入憑證 */
  public M_idToken = this.oauthService.cookiesGet('idToken').cookieVal;
  /** 後端是否回傳資料 */
  public loginJsonHas = false;

  constructor(public appService: AppService, public oauthService: OauthService, private router: Router,
    public el: ElementRef, private activatedRoute: ActivatedRoute, public bsModalService: BsModalService,
    private callApp: AppJSInterfaceService, public cookieService: CookieService) {

    this.activatedRoute.queryParams.subscribe(params => {
      /** 「艾斯身份識別_登入1-1-2」接收queryParams */
      if (params.isApp === '1' && typeof params.deviceType !== 'undefined') {
        /** 「艾斯身份識別_登入1-1-1b」 App (接收App queryParams：isApp, deviceType, deviceCode) */
        this.oauthService.loginRequest.deviceType = Number(params.deviceType);
        this.appService.isApp = params.isApp;
        this.oauthService.loginRequest.deviceCode = params.deviceCode;
        this.oauthService.cookiesSet({
          deviceType: params.deviceType,
          page: location.href
        });
      } else {
        /** 「艾斯身份識別_登入1-1-1a」活動頁帶返回頁參數 */
        this.oauthService.loginRequest.deviceType = 0;
        if (typeof params.fromOriginUri !== 'undefined') {
          this.oauthService.loginRequest.fromOriginUri = params.fromOriginUri;
          this.oauthService.cookiesSet({
            deviceType: '0',
            fromOriginUri: (params.fromOriginUri !== '') ? params.fromOriginUri : '/',
            page: location.href
          });
        }
        this.oauthService.loginRequest.deviceCode = localStorage.getItem('M_DeviceCode');
      }

      if (typeof params.IdToken !== 'undefined' && params.IdToken !== null) {
        this.oauthService.cookiesSet({
          idToken: params.IdToken,
          page: location.href
        });
      }
      /** 「艾斯身份識別_登入2-1」 艾斯身份識別登入成功後，由Redirect API取得grantCode及List_MultipleUser
       * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/20001-redirect-api-mobii
       */
      if (!this.M_idToken) {
        if (typeof params.loginJson !== 'undefined') {
          const loginJson = JSON.parse(params.loginJson);
          this.viewType = '2';
          // 登入成功
          if (loginJson.errorCode.includes('996600001')) {
            this.appService.isApp = loginJson.data.isApp;
            this.loginJsonHas = true;
            // 只能打一次，否則errorCode:609830001
            if (loginJson.data.grantCode) {
              this.grantCode = loginJson.data.grantCode;
              /** 「艾斯身份識別_登入2-2」多重帳號頁面渲染
               * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/30001-token-api-mobii
               */
              if (loginJson.data.List_MultipleUser) {
                /** 「艾斯身份識別_登入2-2-1」有多重帳號時，使用者點擊取得idToken */
                this.viewType = '1';
                this.List_MultipleUser = loginJson.data.List_MultipleUser;
                this.UserInfoId = loginJson.data.List_MultipleUser[0].UserInfoId;
              } else {
                /** 「艾斯身份識別_登入2-2-2」無多重帳號時，用grantCode取得idToken */
                this.onGetToken(loginJson.data.grantCode, 0);
              }
            }
          }
          // 登入失敗
          if (this.viewType === '2' && (loginJson.errorCode.includes('609820003') ||
            loginJson.errorCode.includes('609820002') || loginJson.errorCode.includes('609820001'))) {
            this.bsModalService.show(MessageModalComponent, {
              class: 'modal-dialog-centered',
              backdrop: 'static',
              keyboard: false,
              initialState: {
                success: true,
                static: true,
                message: '請重新登入....',
                showType: 2,
                rightBtnMsg: '確定',
                rightBtnFn: () => {
                  const fromOriginUriCookie = this.oauthService.cookiesGet('fromOriginUri').cookieVal;
                  const prevUri = sessionStorage.getItem('prevUrl');
                  if (fromOriginUriCookie) {
                    // 返回前一頁，但不能返回Login頁，避免循環
                    (!prevUri.includes('Login')) ? location.href = prevUri : this.router.navigate(['/']);
                  } else {
                    // 返回頁為根目錄時，檢查前一頁是否非本站，若非本站則導回該網站
                    if (fromOriginUriCookie === '/' || fromOriginUriCookie === '') {
                      console.log(fromOriginUriCookie, prevUri);
                      location.href =
                        (prevUri.includes(location.origin)) ? fromOriginUriCookie : prevUri;
                    }
                  }
                  this.oauthService.onClearLogin();
                }
              }
            });
          }
        }
      }

      /** 「艾斯身份識別_忘記密碼」Redirect API由後端直接導至艾斯，忘記密碼操作完後，再以新密碼重新登入 */
      if (params.forgetPassword === 'true' && (this.M_idToken !== '' && this.M_idToken !== 'undefined')) {
        this.onLoginOK();
      }

    });
  }

  ngOnInit() {
    sessionStorage.setItem('prevUrl', document.referrer);
    this.appService.openBlock();
    if (this.oauthService.cookiesGet('upgrade').cookieVal === '') {
      this.viewType = '0';
    }
    switch (this.viewType) {
      case '0':
        this.viewTitle = '帳號升級公告';
        this.getViewData();
        break;
      case '1':
        this.viewTitle = '帳號整併';
        break;
      case '2':
        if (this.M_idToken !== '' && this.M_idToken !== 'undefined') {
          this.onLoginOK();
        } else {
          this.getViewData();
        }
        break;
      case '3':
        if (this.M_idToken !== '' && this.M_idToken !== 'undefined') {
          this.onLoginOK();
        } else {
          this.getViewData();
        }
        break;
      default:
        this.viewTitle = '';
        this.getViewData();
        break;
    }
  }

  getViewData() {
    /** 「艾斯身份識別_登入1-2-1」AJAX提供登入所需Request給後端，以便response取得後端提供的資料 */
    this.oauthService.toOauthRequest(this.oauthService.loginRequest).subscribe((data: ViewConfig) => {
      /** 「艾斯身份識別_登入1-2-3」取得Response資料，讓Form渲染 */
      this.viewData = Object.assign(data);
      this.AuthorizationUri = data.AuthorizationUri;
      this.viewList = Object.entries(data).map(([key, val]) => {
        return { name: key, value: val };
      });
      /** 「艾斯身份識別_登入4-1-1」曾經登入成功過(沒有idToken)，需等待form渲染後，再至艾斯登入 */
      if (this.viewList.length > 0 &&
        !this.M_idToken &&
        this.viewType === '2' &&
        this.loginJsonHas === false &&
        this.oauthService.cookiesGet('upgrade').cookieVal === '1' &&
        this.oauthService.cookiesGet('fromOriginUri').cookieVal &&
        location.pathname !== '/null') {
        this.delaySubmit().then(() => {
          this.appService.blockUI.stop();
        });
      }
    });
  }

  /** 「艾斯身份識別_登入1-3」點擊登入註冊按鈕FORM POST給艾斯識別(M_upgrade:1 代表不再顯示公告頁) */
  onLoginEyes() {
    this.oauthService.cookiesSet({
      upgrade: '1',
      page: location.href
    });
    (document.getElementById('oauthLoginForm') as HTMLFormElement).submit();
  }

  /** 「艾斯身份識別_登入4-1-2」等待form渲染後，再至艾斯登入 */
  delaySubmit() {
    return new Promise(() => {
      setTimeout(() => {
        if (this.viewList.length > 0 && !this.M_idToken && this.viewType === '2' &&
          this.oauthService.cookiesGet('upgrade').cookieVal === '1') {
          (document.getElementById('oauthLoginForm') as HTMLFormElement).submit();
        }
      }, 1500);
    });
  }

  /** 「艾斯身份識別_登入3-1」已登入過艾斯(未有idToken)，點擊過公告頁登入註冊按鈕(M_upgrade=1)，可取得idToken，則否讓使用者選完再取得idToken
   * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/20001-redirect-api-mobii
   * @param code 後端驗證用grantCode
   * @param uid 使用者id
   */
  onGetToken(code: string, uid: number) {
    // 禁止回上一頁(上一頁為艾斯及後端Redirect，故禁止返回)
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', () => {
      history.pushState(null, null, document.URL);
    });
    // 有grantCode且無idToken
    if (code && code !== '') {
      if (!this.M_idToken) {
        // grantCode只能使用一次，註冊Mobii會員
        this.oauthService.grantRequest.grantCode = code;
        this.oauthService.grantRequest.UserInfoId = uid;
        /** 「艾斯身份識別_登入3-2-1」取得idToken */
        this.oauthService.toTokenApi(this.oauthService.grantRequest).subscribe((data: ResponseOauthApi) => {
          if (data) {
            const tokenData = Object.assign(data);
            if (tokenData.errorCode === '996600001') {
              this.oauthService.cookiesSet({
                idToken: tokenData.data.idToken,
                userName: tokenData.data.Customer_Name,
                userCode: tokenData.data.Customer_Code,
                userFavorites: JSON.stringify(tokenData.data.List_UserFavourite),
                page: location.href
              });
              this.appService.userName = tokenData.data.Customer_Name;
              this.appService.loginState = true;
              this.appService.userLoggedIn = true;
              this.appService.showFavorites();
              this.appService.readCart();
              this.viewType = '3';
              /** 「艾斯身份識別_登入3-2-3」裝置若為APP傳interface */
              if (this.appService.isApp === 1) {
                this.callApp.getLoginData(tokenData.data.idToken, tokenData.data.Customer_Code, tokenData.data.Customer_Name);
              } else {
                // web登入成功導址
                this.appService.jumpUrl(this.oauthService.cookiesGet('fromOriginUri').cookieVal);
              }
            }
          }
        });
      }
    }
  }

  /** 「艾斯身份識別_登入4-2」曾經登入成功過(有idToken)，登入狀態true，導回原頁 */
  onLoginOK() {
    this.appService.blockUI.stop();
    this.appService.loginState = true;
    this.appService.userLoggedIn = true;
    this.appService.showFavorites();
    this.appService.readCart();
    if (this.appService.isApp === 1 || this.oauthService.cookiesGet('deviceType').cookieVal > '0') {
      this.callApp.getLoginData(this.oauthService.cookiesGet('idToken').cookieVal,
        this.oauthService.cookiesGet('userCode').cookieVal, this.oauthService.cookiesGet('userName').cookieVal);
    } else {
      this.appService.jumpUrl(this.oauthService.cookiesGet('fromOriginUri').cookieVal);
    }
  }


  ngAfterViewInit() {
    this.appService.blockUI.stop();
  }

}

