import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
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
  constructor(public appService: AppService, public oauthService: OauthService, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
  }
  signInWithOauth(form: NgForm): void {
    (document.getElementById('postOauthlogin') as HTMLFormElement).submit();
    this.appService.openBlock();
  }

}
