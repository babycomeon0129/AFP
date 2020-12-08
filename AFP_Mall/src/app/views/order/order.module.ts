import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { TextMaskModule } from 'angular2-text-mask';

import { OrderRoutingModule } from './order-routing.module';
import { ShredModule } from 'src/app/shared/shared.module';
import { FunctionModule } from '../function/function.module';

import { ShoppingOrderComponent } from './shopping-order/shopping-order.component';
import { ETicketOrderComponent } from './eticket-order/eticket-order.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';
import { ShoppingPaymentComponent } from './shopping-payment/shopping-payment.component';
import { OrderResultComponent } from './order-result/order-result.component';

@NgModule({
  declarations: [
    ShoppingOrderComponent,
    ETicketOrderComponent,
    ShoppingPaymentComponent,
    OrderCompleteComponent,
    OrderResultComponent
  ],
  exports: [
    ShoppingOrderComponent,
    ETicketOrderComponent,
    ShoppingPaymentComponent,
    OrderCompleteComponent,
    OrderResultComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    OrderRoutingModule,
    FormsModule,
    LazyLoadImageModule,
    NgxUsefulSwiperModule,
    TextMaskModule,
    ShredModule,
    FunctionModule
  ]
})
export class OrderModule {}
