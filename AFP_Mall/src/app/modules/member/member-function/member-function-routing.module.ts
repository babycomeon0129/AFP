import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MemberCardComponent } from './member-card/member-card.component';
import { MemberCardDetailComponent } from './member-card-detail/member-card-detail.component';
import { MemberTicketComponent } from './member-ticket/member-ticket.component';
import { MemberCoinComponent } from './member-coin/member-coin.component';
import { MemberDiscountComponent } from './member-discount/member-discount.component';
import { MemberFavoriteComponent } from './member-favorite/member-favorite.component';
import { MemberOrderComponent } from './member-order/member-order.component';
import { MemberFoodComponent } from './member-food/member-food.component';
import { MyOrderDetailComponent } from './my-order-detail/my-order-detail.component';
import { ETicketDetailComponent } from './eticket-detail/eticket-detail.component';
import { ETicketOrderDetailComponent } from './eticket-order-detail/eticket-order-detail.component';

const routes: Routes = [
  { path: 'MemberCard', component: MemberCardComponent, data: {animation: 'MemberCard'}},
  { path: 'MemberCardDetail/:UserFavourite_ID/:UserFavourite_TypeCode',
  component: MemberCardDetailComponent},
  { path: 'MemberTicket', component: MemberTicketComponent},
  { path: 'MemberCoin', component: MemberCoinComponent},
  { path: 'MemberDiscount', component: MemberDiscountComponent, data: {animation: 'MemberDiscount'}},
  { path: 'MemberFavorite', component: MemberFavoriteComponent, data: {animation: 'MemberFavorite'}},
  { path: 'MemberOrder', component: MemberOrderComponent, data: {animation: 'MemberOrder'}},
  { path: 'MemberFood', component: MemberFoodComponent, data: {animation: 'MemberFood'}},
  { path: 'MyOrderDetail/:Order_TableNo', component: MyOrderDetailComponent },
  { path: 'ETicketDetail/:UserTicket_Code', component: ETicketDetailComponent},
  { path: 'ETicketOrderDetail/:Order_TableNo', component: ETicketOrderDetailComponent},
  { path: '', redirectTo: '/Member'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberFunctionRoutingModule {}
