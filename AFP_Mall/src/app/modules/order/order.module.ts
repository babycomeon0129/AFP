import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { TextMaskModule } from 'angular2-text-mask';

import { OrderRoutingModule } from './order-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { ShoppingOrderComponent } from './shopping-order/shopping-order.component';
import { ETicketOrderComponent } from './eticket-order/eticket-order.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';
import { ShoppingPaymentComponent } from './shopping-payment/shopping-payment.component';

@NgModule({
  declarations: [
    ShoppingOrderComponent,
    ETicketOrderComponent,
    ShoppingPaymentComponent,
    OrderCompleteComponent
  ],
  exports: [
    ShoppingOrderComponent,
    ETicketOrderComponent,
    ShoppingPaymentComponent,
    OrderCompleteComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    OrderRoutingModule,
    FormsModule,
    LazyLoadImageModule,
    NgxUsefulSwiperModule,
    TextMaskModule,
    SharedModule
  ]
})
export class OrderModule {}
