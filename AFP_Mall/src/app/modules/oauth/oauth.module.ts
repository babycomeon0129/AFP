import { OauthService } from '@app/modules/oauth/oauth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
    HttpClientModule,
    OauthRoutingModule
  ],
  providers: [OauthService]
})
export class OauthModule { }
