import { environment } from './../../../../environments/environment';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { AppService } from 'src/app/app.service';
import { ModalService } from 'src/app/service/modal.service';
import { Request_AFPThird, Request_AFPAccount, Response_AFPAccount, Response_AFPLogin } from 'src/app/_models';
import { AuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
declare var $: any;

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html'
})
export class RegisterModalComponent implements OnInit, AfterViewInit {

  // 第三方登入 User容器
  thirdUser: SocialUser;
  regClick = false;
  public thirdRequest: Request_AFPThird = new Request_AFPThird();

  // 註冊用
  public register: Request_AFPAccount = {
    AFPType: 1,
    AFPAccountCTY: 886,
    AFPAccount: '',
    AFPPassword: ''
  };
  registerForm: FormGroup;

  /** 隱藏第三方登入 */
  public hideThird = false;

  constructor(
    public bsModalRef: BsModalRef, public modalService: ModalService, private authService: AuthService,
    public appService: AppService, private fb: FormBuilder, private cookieService: CookieService) { }

  // FB登入按鈕
  public signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.thirdRequest.Mode = 1;
    this.regClick = true;
  }

  // Google登入按鈕
  public signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.thirdRequest.Mode = 3;
    this.regClick = true;
  }

  // 註冊送出
  onRegSubmit() {
    this.appService.openBlock();
    this.appService.toApi('AFPAccount', '1101', this.register).subscribe((data: Response_AFPAccount) => {
      this.register.AFPAccountCTY = 886;
      const initialState = {
        UserInfoCode: data.UserInfo_Code,
        Account: this.register.AFPAccount,
        Type: 1101
      };
      this.modalService.show('vcode', { initialState }, this.bsModalRef);
    });
  }

  //  前往登入
  GoLogin(): void {
    if (this.appService.isApp != null) {
      this.bsModalRef.hide();
    } else {
      this.modalService.openModal('login', this.bsModalRef);
    }
  }

  // 切換
  public SwitchRegType(value: number): void {
    this.register.AFPAccount = null;
    this.register.AFPType = value;
  }


  ngOnInit() {
    //  第三方登入取得資料
    this.authService.authState.subscribe((user) => {
      if (user != null && this.regClick) {
        this.appService.openBlock();
        this.thirdUser = user;
        this.thirdRequest.Account = this.thirdUser.email;
        this.thirdRequest.NickName = this.thirdUser.name;
        this.thirdRequest.Token = this.thirdUser.id;
        this.thirdRequest.JsonData = JSON.stringify(this.thirdUser);
        this.appService.toApi('Home', '1105', this.thirdRequest).subscribe((data: Response_AFPLogin) => {
          // 塞Session
          sessionStorage.setItem('userName', data.Model_UserInfo.Customer_Name);
          sessionStorage.setItem('userCode', data.Model_UserInfo.Customer_Code);
          sessionStorage.setItem('CustomerInfo', data.Model_UserInfo.CustomerInfo);
          // tslint:disable: max-line-length
          this.cookieService.set('userName', data.Model_UserInfo.Customer_Name, 90, '/', environment.cookieDomain, environment.cookieSecure);
          this.cookieService.set('userCode', data.Model_UserInfo.Customer_Code, 90, '/', environment.cookieDomain, environment.cookieSecure);
          this.cookieService.set('CustomerInfo', data.Model_UserInfo.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure);
          this.appService.loginState = true;
          // 關閉視窗
          this.bsModalRef.hide();
          this.appService.showFavorites();
          this.appService.readCart();
        });
      }
      this.regClick = false;
    });

    if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i) && this.appService.isApp != null) {
      //  IOS
      this.hideThird = true;
    }
  }

  ngAfterViewInit(): void {

    // 手機國碼選擇
    $('#registeredSelectState').editableSelect({ effects: 'default' });
  }

}
