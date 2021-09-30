import { async } from '@angular/core/testing';
import { style } from '@angular/animations';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService, RequestOauthLogin } from '@app/modules/oauth/oauth.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-oauth-login',
  templateUrl: './oauth-login.component.html',
  styleUrls: ['./oauth-login.component.scss',
    '../../../../styles/layer/shopping-footer.scss'],
})
export class OauthLoginComponent implements OnInit {
  /** 頁面切換 0:帳號升級公告 1:帳號整併 */
  public viewType: number;

  constructor(public appService: AppService, public oauthService: OauthService, private router: Router,
              public el: ElementRef) {}

  ngOnInit() {
    this.viewType = 0;
  }
  async onLoginEyes() {
    /** 「登入1-2-1」AJAX提供登入所需Request給後端，以便response取得後端提供的資料，再FORM POST給艾斯識別 */
    console.log('1-2-1:ajax request to BE', this.oauthService.loginRequest);
    (await ((this.oauthService.toOauthRequest(this.oauthService.loginRequest)))).subscribe((data: RequestOauthLogin) => {});

  }
  // onSubmit(form: NgForm) {
  //   localStorage.setItem('M_loginCheckBox', form.value.loginCheck);
  // }
  checkUUID(uid: string, e: any) {
    console.log(uid, e);
    e.target.checked = true;
  }
}
