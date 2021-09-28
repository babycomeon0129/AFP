import { style } from '@angular/animations';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
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
  onLoginEyes() {
    if (this.oauthService.loginRequest.fromOriginUri === '' && localStorage.getItem('M_fromOriginUri') !== undefined) {
      this.oauthService.loginRequest.fromOriginUri = localStorage.getItem('M_fromOriginUri');
    } else if (this.oauthService.loginRequest.fromOriginUri === null) {
      this.oauthService.loginRequest.fromOriginUri = '/';
    }
    console.log('onLoginEyes', this.oauthService.loginRequest);
    this.oauthService.getConfigResponse(this.oauthService.loginRequest).subscribe((data: any) => { });
  }
  // onSubmit(form: NgForm) {
  //   localStorage.setItem('M_loginCheckBox', form.value.loginCheck);
  // }
  checkUUID(uid: string, e: any) {
    console.log(uid, e);
    e.target.checked = true;
  }
}
