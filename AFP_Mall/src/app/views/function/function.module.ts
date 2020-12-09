import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { FunctionRoutingModule } from './function-routing.module';

import { AppDownloadComponent } from './app-download/app-download.component';
import { AppGoPaymentComponent } from './app-go-payment/app-go-payment.component';
import { AppLogoutComponent } from './app-logout/app-logout.component';
import { AppRedirectComponent } from './app-redirect/app-redirect.component';
import { Error500Component } from './error500/error500.component';
import { Error503Component } from './error503/error503.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    AppRedirectComponent,
    AppGoPaymentComponent,
    AppLogoutComponent,
    AppDownloadComponent,
    Error500Component,
    Error503Component
  ],
  imports: [
    FunctionRoutingModule,
    FormsModule,
    CommonModule,
    LazyLoadImageModule
  ],
  exports: [
    AppRedirectComponent,
    AppGoPaymentComponent,
    AppLogoutComponent,
    AppDownloadComponent,
    Error500Component,
    Error503Component
  ]
})
export class FunctionModule {}
