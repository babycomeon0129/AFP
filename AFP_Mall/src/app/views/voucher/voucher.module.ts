import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { QRCodeModule } from 'angularx-qrcode';

import { VoucherRoutingModule } from './voucher-routing.module';
import { ShredModule } from 'src/app/shared/shared.module';
import { FunctionModule } from '../function/function.module';

import { EventComponent } from './event/event.component';
import { OffersComponent } from './offers/offers.component';
import { SalesComponent } from './sales/sales.component';
import { ShoppingOffersComponent } from './shopping-offers/shopping-offers.component';
import { VoucherDetailComponent } from './voucher-detail/voucher-detail.component';

@NgModule({
  declarations: [
    EventComponent,
    OffersComponent,
    SalesComponent,
    ShoppingOffersComponent,
    VoucherDetailComponent
  ],
  exports: [
    EventComponent,
    OffersComponent,
    SalesComponent,
    ShoppingOffersComponent,
    VoucherDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    VoucherRoutingModule,
    LazyLoadImageModule,
    NgxUsefulSwiperModule,
    ShredModule,
    FunctionModule,
    QRCodeModule
  ]
})
export class VoucherModule {}
