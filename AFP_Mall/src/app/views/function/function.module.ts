import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { FunctionRoutingModule } from './function-routing.module';

import { AppDownloadComponent } from './app-download/app-download.component';
import { AppGoPaymentComponent } from './app-go-payment/app-go-payment.component';
import { AppLoginSuccessComponent } from './app-login-success/app-login-success.component';
import { AppLoginComponent } from './app-login/app-login.component';
import { AppLogoutComponent } from './app-logout/app-logout.component';
import { AppRedirectComponent } from './app-redirect/app-redirect.component';
import { BearServicesComponent } from './bearservices/bearservices.component';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { Error503Component } from './error503/error503.component';
import { FooterComponent } from './footer/footer.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    BearServicesComponent,
    AppLoginComponent,
    AppLoginSuccessComponent,
    AppRedirectComponent,
    AppGoPaymentComponent,
    AppLogoutComponent,
    AppDownloadComponent,
    FooterComponent,
    Error404Component,
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
    BearServicesComponent,
    AppLoginComponent,
    AppLoginSuccessComponent,
    AppRedirectComponent,
    AppGoPaymentComponent,
    AppLogoutComponent,
    AppDownloadComponent,
    FooterComponent,
    Error404Component,
    Error500Component,
    Error503Component
  ]
})
export class FunctionModule {}
