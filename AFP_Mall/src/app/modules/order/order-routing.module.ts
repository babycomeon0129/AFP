import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ETicketOrderComponent } from './eticket-order/eticket-order.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';
import { ShoppingOrderComponent } from './shopping-order/shopping-order.component';
import { ShoppingPaymentComponent } from './shopping-payment/shopping-payment.component';



const routes: Routes = [
  { path: 'ShoppingOrder', component: ShoppingOrderComponent },
  { path: 'ShoppingPayment', component: ShoppingPaymentComponent },
  { path: 'ETicketOrder', component: ETicketOrderComponent},
  { path: 'OrderComplete', component: OrderCompleteComponent },
  { path: '', redirectTo: '/Shopping' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {}
