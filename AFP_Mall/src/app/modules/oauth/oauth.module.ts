import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OauthRoutingModule } from './oauth-routing.module';
import { OauthComponent } from './oauth/oauth.component';
import { OauthLoginComponent } from './oauth-login/oauth-login.component';

@NgModule({
  declarations: [
    OauthComponent,
    OauthLoginComponent
  ],
  exports: [
    OauthComponent,
    OauthLoginComponent
  ],
  imports: [
    CommonModule,
    OauthRoutingModule
  ]
})
export class OauthModule { }
