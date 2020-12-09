import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionAliveGuard } from 'src/app/shared/auth/session-alive.guard';

import { ShoppingOrderComponent } from './shopping-order/shopping-order.component';
import { ETicketOrderComponent } from './eticket-order/eticket-order.component';
import { ShoppingPaymentComponent } from './shopping-payment/shopping-payment.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';

const routes: Routes = [
  { path: 'ShoppingOrder', component: ShoppingOrderComponent },
  { path: 'ShoppingPayment', component: ShoppingPaymentComponent },
  { path: 'ETicketOrder', component: ETicketOrderComponent},
  { path: 'OrderComplete', canActivate: [SessionAliveGuard], component: OrderCompleteComponent },
  { path: '', redirectTo: '/Shopping' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {}
