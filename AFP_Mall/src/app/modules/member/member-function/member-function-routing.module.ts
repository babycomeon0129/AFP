import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionAliveGuard } from 'src/app/shared/guard/session-alive-guard/session-alive.guard';

import { MemberCardComponent } from './member-card/member-card.component';
import { MemberCardAddComponent } from './member-card-add/member-card-add.component';
import { MemberCardListComponent } from './member-card-list/member-card-list.component';
import { MemberCardDetailComponent } from './member-card-detail/member-card-detail.component';
import { MemberCardCertificateComponent } from './member-card-certificate/member-card-certificate.component';
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
  { path: 'MemberCard', canActivate: [SessionAliveGuard], component: MemberCardComponent, data: {animation: 'MemberCard'}},
  { path: 'MemberCardAdd', canActivate: [SessionAliveGuard], component: MemberCardAddComponent, data: {animation: 'MemberCardAdd'}},
  { path: 'MemberCardList', canActivate: [SessionAliveGuard], component: MemberCardListComponent, data: {animation: 'MemberCardList'}},
  { path: 'MemberCardDetail/:UserFavourite_ID/:UserFavourite_TypeCode',
  canActivate: [SessionAliveGuard], component: MemberCardDetailComponent},
  { path: 'MemberCardCertificate', canActivate: [SessionAliveGuard], component: MemberCardCertificateComponent},
  { path: 'MemberTicket', canActivate: [SessionAliveGuard], component: MemberTicketComponent},
  { path: 'MemberCoin', canActivate: [SessionAliveGuard], component: MemberCoinComponent},
  { path: 'MemberDiscount', canActivate: [SessionAliveGuard], component: MemberDiscountComponent, data: {animation: 'MemberDiscount'}},
  { path: 'MemberFavorite', canActivate: [SessionAliveGuard], component: MemberFavoriteComponent, data: {animation: 'MemberFavorite'}},
  { path: 'MemberOrder', component: MemberOrderComponent, data: {animation: 'MemberOrder'}},
  { path: 'MemberFood', component: MemberFoodComponent, data: {animation: 'MemberFood'}},
  { path: 'MyOrderDetail/:Order_TableNo', canActivate: [SessionAliveGuard], component: MyOrderDetailComponent },
  { path: 'ETicketDetail/:UserTicket_Code', component: ETicketDetailComponent},
  { path: 'ETicketOrderDetail/:Order_TableNo', component: ETicketOrderDetailComponent},
  { path: '', redirectTo: '/Member'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberFunctionRoutingModule {}
