import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, from } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AppService } from '@app/app.service';
import { OauthService, eyesLoginAPI46111 } from '@app/modules/oauth/oauth.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@env/environment';
import { Router } from '@angular/router';

declare var AppJSInterface: any;
@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.scss']
})
export class OauthComponent implements OnInit {
  public loginApiUrl = 'https://login-uuat.mobii.ai/auth/api/v1/login';
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    })
  };
  public oauthRequest = {
    DeviceType: 0,
    DeviceCode: 170052617006867,
    fromOriginUri: 'Login/Oauth'
  };
  headers: string[] = [];
  config: eyesLoginAPI46111 | undefined;
  constructor(public appService: AppService, public oauthService: OauthService,
              public router: Router, private cookieService: CookieService,
              private http: HttpClient) { }

  ngOnInit() {
  }

  // onSubmit(form: NgForm) {
  //   (document.getElementById('postOauthlogin') as HTMLFormElement).submit();
  //   this.appService.openBlock();
  // }

  showConfigResponse() {
    this.oauthService.getConfigResponse(this.oauthRequest).subscribe((data: any) => { });
  }
  // signInWithOauth(form: NgForm): void {
  //   (document.getElementById('postOauthlogin') as HTMLFormElement).submit();
  //   this.appService.openBlock();
  // }
  // signInWithOauth(form: NgForm): void {
  //   this.http.post<OauthLoginRequest>(this.loginApiUrl, this.oauthRequest, this.httpOptions)
  //     .subscribe((data: OauthLoginRequest) => {
  //       console.log(data);
  //       console.log(this.oauthRequest);
  //     },
  //       err => console.log(err));
  // }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // 發生客戶端或網絡錯誤。 相應地處理它.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // 後端返回一個不成功的response code.
  //     // response body可能包含有關出錯的線索.
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
  //   }
  //   // 返回一個帶有面向用戶的錯誤消息的 observable
  //   return throwError(
  //     'Something bad happened; please try again later.' + error);
  // }
}

/** 登入 API Request interface
 * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/oauth2-api
 */
export interface OauthLoginRequest {
  deviceType: number;
  deviceCode: string;
  fromOriginUri: string;
}
