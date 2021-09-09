import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AppService } from '@app/app.service';
import { CookieService } from 'ngx-cookie-service';

declare var AppJSInterface: any;
@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.scss']
})
export class OauthComponent implements OnInit {
  /** Eyes登入裝置類型 0 : Web 1 : iOS 2 : Android */
  public loginDeviceType: string;
  constructor(public appService: AppService, private cookieService: CookieService) { }

  ngOnInit() {
    this.loginPage();
  }
  signInWithOauth(form: NgForm): void {
    (document.getElementById('postOauthlogin') as HTMLFormElement).submit();
    this.appService.openBlock();
  }
  onSubmit(form: NgForm): void {
    console.log(this);
  }

  /** 判斷跳出網頁或APP的登入頁 */
  loginPage(): void {
    if (this.appService.isApp == null) {
      this.loginDeviceType = '0';
    } else {
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        this.loginDeviceType = '2';
        AppJSInterface.login();
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        this.loginDeviceType = '1';
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'login' });
      }
    }
  }
}
