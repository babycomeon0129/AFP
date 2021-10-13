import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';

declare var AppJSInterface: any;
@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.scss']
})
export class OauthComponent implements OnInit {

  headers: string[] = [];
  constructor(public appService: AppService, public oauthService: OauthService,
              public router: Router, private cookieService: CookieService, private callApp: AppJSInterfaceService) { }

  ngOnInit() {
  }

  /** 帶假資料 */
  setIdToken() {
    this.appService.loginState = true;
    sessionStorage.setItem('userName', 'Chloe chung');
    this.appService.userName = sessionStorage.getItem('userName');
    this.cookieService.set('M_idToken', 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxN2IyYTg5NS1lNGZmLTQ4MjktYWQwMC00NmE1ZDI3MDEyYWIiLCJhdWQiOiI3YTE5OGE5OC04NzFkLTRkMzYtODY2ZC0zYjI0NjQ4OGEyY2MiLCJvcGVuSWRQcm92aWRlciI6eyJuYW1lIjoiR29vZ2xlIiwicmVmSWQiOiI5NDQ1Y2FmMzE0ZWY1MzFlZDdlZmNiOTkyMDY0ZjJiOCJ9LCJleHAiOjE2MzM2OTM3NTIsImlhdCI6MTYzMzY1Nzc1MiwidXNlciI6eyJhY2NvdW50SWQiOiJkM2Y1M2E2MC1kYjcwLTExZTktOGEzNC0yYTJhZTJkYmNjZTQiLCJuYW1lIjoiQ2hsb2UgY2h1bmciLCJtb2JpbGUiOiI5MTAqKio0ODEiLCJpZCI6IjE3YjJhODk1LWU0ZmYtNDgyOS1hZDAwLTQ2YTVkMjcwMTJhYiIsImF2YXRhciI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdnODkxVFhpYVNBa3BqSEN1d2JleUMtNHQtZVI4TVdhN0xsVi1vRGxIYz1zOTYtYyIsImNvdW50cnlNY29kZSI6Ijg4NiIsInJlZ2lzdGVyRGF0ZSI6IjE2MzM2MDM1OTYifSwiaXNzIjoiZXllc21lZGlhLmNvbS50dyJ9.M-hmEaU-UrIJd0aF2sM4S4R4i8xIoSOf8ov5W6du6SaKQytBlrUUr8bISm7ih_WeRi4vfh4baTkBlU55qPEFu5ti92R-ToZk9a2weTPSQfwUYZp_OkBQfV5nAH_925qRYx5Cx4ELSbMWzGVMjDGWRewvu9gq5PDNHxZqiOc9FrznHOVz5FZU2HXm_vHJIY5vmw7pLjv3nK8HlcVJjXyI7G4QQZf1mr2GCXMD3DKKK0Yp5Q7DEacS7D2GkVqYROSIunMeKNddiJXwq_3kQ6SmgFZUcsen3QEvpN7-_OL_dExsdpfZ4M6lHP9nx2KUDhe2FbHzOwBTfsCgDNV-UsEJwQ', 90, '/',
    environment.cookieDomain, environment.cookieSecure, 'Lax');
    sessionStorage.setItem('M_viewType', '1');
    localStorage.setItem('M_fromOriginUri', 'Member');
    const data = '{"idToken":"eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxN2IyYTg5NS1lNGZmLTQ4MjktYWQwMC00NmE1ZDI3MDEyYWIiLCJhdWQiOiI3YTE5OGE5OC04NzFkLTRkMzYtODY2ZC0zYjI0NjQ4OGEyY2MiLCJvcGVuSWRQcm92aWRlciI6eyJuYW1lIjoiR29vZ2xlIiwicmVmSWQiOiI5NDQ1Y2FmMzE0ZWY1MzFlZDdlZmNiOTkyMDY0ZjJiOCJ9LCJleHAiOjE2MzM2OTM3NTIsImlhdCI6MTYzMzY1Nzc1MiwidXNlciI6eyJhY2NvdW50SWQiOiJkM2Y1M2E2MC1kYjcwLTExZTktOGEzNC0yYTJhZTJkYmNjZTQiLCJuYW1lIjoiQ2hsb2UgY2h1bmciLCJtb2JpbGUiOiI5MTAqKio0ODEiLCJpZCI6IjE3YjJhODk1LWU0ZmYtNDgyOS1hZDAwLTQ2YTVkMjcwMTJhYiIsImF2YXRhciI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdnODkxVFhpYVNBa3BqSEN1d2JleUMtNHQtZVI4TVdhN0xsVi1vRGxIYz1zOTYtYyIsImNvdW50cnlNY29kZSI6Ijg4NiIsInJlZ2lzdGVyRGF0ZSI6IjE2MzM2MDM1OTYifSwiaXNzIjoiZXllc21lZGlhLmNvbS50dyJ9.M-hmEaU-UrIJd0aF2sM4S4R4i8xIoSOf8ov5W6du6SaKQytBlrUUr8bISm7ih_WeRi4vfh4baTkBlU55qPEFu5ti92R-ToZk9a2weTPSQfwUYZp_OkBQfV5nAH_925qRYx5Cx4ELSbMWzGVMjDGWRewvu9gq5PDNHxZqiOc9FrznHOVz5FZU2HXm_vHJIY5vmw7pLjv3nK8HlcVJjXyI7G4QQZf1mr2GCXMD3DKKK0Yp5Q7DEacS7D2GkVqYROSIunMeKNddiJXwq_3kQ6SmgFZUcsen3QEvpN7-_OL_dExsdpfZ4M6lHP9nx2KUDhe2FbHzOwBTfsCgDNV-UsEJwQ","Customer_Name":"MEIMEI","Customer_Code":"900053291372972","Customer_UUID":"dfa4s4","CustomerInfo":null,"List_UserFavourite":[]}}';
    this.callApp.getLoginData(JSON.stringify(data));
    setTimeout(() => {
      this.router.navigate(['/Member']);
    }, 1000);
  }
}
