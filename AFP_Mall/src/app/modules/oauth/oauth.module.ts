import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { OauthRoutingModule } from './oauth-routing.module';
import { SharedModule } from '@app/shared/shared.module';

import { OauthComponent } from './oauth.component';

@NgModule({
  declarations: [
    OauthComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    OauthRoutingModule,
    SharedModule,
  ],
  exports: [
    OauthComponent
  ]
})
export class OauthModule {}
