import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AppService } from 'src/app/app.service';
import { ModalService } from 'src/app/service/modal.service';
import { AuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { NgForm } from '@angular/forms';
import { Request_AFPThird, Model_ShareData, Model_CustomerInfo, AFP_UserFavourite } from 'src/app/_models';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
})
export class AppLoginComponent implements OnInit {

  // 第三方登入 User容器
  thirdUser: SocialUser;
  regClick = false;
  public request: Request_AFPLogin = new Request_AFPLogin();
  public thirdRequest: Request_AFPThird = new Request_AFPThird();

  /** 隱藏第三方登入 */
  public hideThird = false;
  constructor(
    // tslint:disable-next-line: max-line-length
    public bsModalRef: BsModalRef, private authService: AuthService, private appService: AppService,
    public modal: ModalService, private router: Router, private activatedRoute: ActivatedRoute, private cookieService: CookieService,
    private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('AppLogin - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: 'AppLogin - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});

    // App訪問
    this.activatedRoute.queryParams.subscribe(params => {

      if (typeof params.customerInfo !== 'undefined') {
        sessionStorage.setItem('CustomerInfo', encodeURIComponent(params.customerInfo));
      }

    });
  }

  // 登入表單送出
  onSubmit(form: NgForm): void {
    this.appService.openBlock();
    this.appService.toApi('AFPAccount', '1104', this.request).subscribe((data: Response_AFPLogin) => {
      sessionStorage.setItem('userName', data.Model_UserInfo.Customer_Name);
      sessionStorage.setItem('userCode', data.Model_UserInfo.Customer_Code);
      sessionStorage.setItem('CustomerInfo', data.Model_UserInfo.CustomerInfo);
      sessionStorage.setItem('userFavorites', JSON.stringify(data.List_UserFavourite));

      localStorage.setItem('userName', data.Model_UserInfo.Customer_Name);
      localStorage.setItem('userCode', data.Model_UserInfo.Customer_Code);
      localStorage.setItem('CustomerInfo', data.Model_UserInfo.CustomerInfo);

      this.cookieService.set('userName', data.Model_UserInfo.Customer_Name, 90);
      this.cookieService.set('userCode', data.Model_UserInfo.Customer_Code, 90);
      this.cookieService.set('CustomerInfo', data.Model_UserInfo.CustomerInfo, 90);
      this.appService.loginState = true;
      this.GoSuccess();
    });
  }

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

  public GoSuccess(): void {
    window.location.href = '/AppLoginSuccess';
    // this.router.navigate(['/AppLoginSuccess']);
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
        this.appService.toApi('AFPAccount', '1105', this.thirdRequest).subscribe((data: Response_AFPLogin) => {
          // 塞Session
          sessionStorage.setItem('userName', data.Model_UserInfo.Customer_Name);
          sessionStorage.setItem('userCode', data.Model_UserInfo.Customer_Code);
          sessionStorage.setItem('CustomerInfo', data.Model_UserInfo.CustomerInfo);
          sessionStorage.setItem('userFavorites', JSON.stringify(data.List_UserFavourite));
          this.appService.loginState = true;
          this.GoSuccess();
        });
      }
      this.regClick = false;
    });

    if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i) && this.appService.isApp != null) {
      //  IOS
      this.hideThird = true;
    }
  }
}

// tslint:disable-next-line: class-name
export class Request_AFPLogin extends Model_ShareData {
  AFPAccount: string;
  AFPPassword: string;
}

// tslint:disable-next-line: class-name
export class Response_AFPLogin extends Model_ShareData {
  // tslint:disable-next-line: variable-name
  Model_UserInfo?: Model_CustomerInfo;
  // tslint:disable-next-line: variable-name
  List_UserFavourite?: AFP_UserFavourite;
}
