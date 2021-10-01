import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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

  headers: string[] = [];
  constructor(public appService: AppService, public oauthService: OauthService,
              public router: Router, private cookieService: CookieService) { }

  ngOnInit() {
  }

}
