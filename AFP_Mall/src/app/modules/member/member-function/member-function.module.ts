import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { QRCodeModule } from 'angularx-qrcode';

import { MemberFunctionRoutingModule } from './member-function-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MemberService } from '../member.service';

import { ETicketDetailComponent } from './eticket-detail/eticket-detail.component';
import { ETicketOrderDetailComponent } from './eticket-order-detail/eticket-order-detail.component';
import { MemberCardComponent } from './member-card/member-card.component';
import { MemberCoinComponent } from './member-coin/member-coin.component';
import { MemberDiscountComponent } from './member-discount/member-discount.component';
import { MemberFavoriteComponent } from './member-favorite/member-favorite.component';
import { MemberFoodComponent } from './member-food/member-food.component';
import { MemberOrderComponent } from './member-order/member-order.component';
import { MemberTicketComponent } from './member-ticket/member-ticket.component';
import { MyOrderDetailComponent } from './my-order-detail/my-order-detail.component';

@NgModule({
  declarations: [
    MemberCardComponent,
    MemberTicketComponent,
    MemberCoinComponent,
    MemberDiscountComponent,
    MemberFavoriteComponent,
    MemberOrderComponent,
    MyOrderDetailComponent,
    ETicketDetailComponent,
    ETicketOrderDetailComponent,
    MemberFoodComponent
  ],
  exports: [
    MemberCardComponent,
    MemberTicketComponent,
    MemberCoinComponent,
    MemberDiscountComponent,
    MemberFavoriteComponent,
    MemberOrderComponent,
    MyOrderDetailComponent,
    ETicketDetailComponent,
    ETicketOrderDetailComponent,
    MemberFoodComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MemberFunctionRoutingModule,
    FormsModule,
    LazyLoadImageModule,
    NgxUsefulSwiperModule,
    SharedModule,
    QRCodeModule
  ],
  providers: [
    MemberService
  ]
})
export class MemberFunctionModule {}
