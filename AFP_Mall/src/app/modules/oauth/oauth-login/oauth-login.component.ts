import { Router } from '@angular/router';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-oauth-login',
  templateUrl: './oauth-login.component.html',
  styleUrls: ['./oauth-login.component.scss']
})
export class OauthLoginComponent implements OnInit {

  constructor(private oauthService: OauthService, private router: Router) {}

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    localStorage.setItem('M_loginCheckBox', form.value.loginCheck);
  }
}
