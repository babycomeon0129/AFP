import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ForAppRoutingModule } from './for-app-routing.module';

import { AppDownloadComponent } from './app-download/app-download.component';
import { AppGoPaymentComponent } from './app-go-payment/app-go-payment.component';
import { AppLogoutComponent } from './app-logout/app-logout.component';
import { AppRedirectComponent } from './app-redirect/app-redirect.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    AppRedirectComponent,
    AppGoPaymentComponent,
    AppLogoutComponent,
    AppDownloadComponent
  ],
  imports: [
    ForAppRoutingModule,
    FormsModule,
    CommonModule,
    LazyLoadImageModule
  ],
  exports: [
    AppRedirectComponent,
    AppGoPaymentComponent,
    AppLogoutComponent,
    AppDownloadComponent
  ]
})
export class ForAppModule {}
