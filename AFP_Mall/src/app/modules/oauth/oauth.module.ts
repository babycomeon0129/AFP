import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

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
    FormsModule,
    OauthRoutingModule
  ]
})
export class OauthModule { }
