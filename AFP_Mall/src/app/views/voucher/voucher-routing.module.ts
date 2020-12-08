import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SessionAliveGuard } from 'src/app/shared/auth/session-alive.guard';

import { EventComponent } from './event/event.component';
import { OffersComponent } from './offers/offers.component';
import { SalesComponent } from './sales/sales.component';
import { ShoppingOffersComponent } from './shopping-offers/shopping-offers.component';
import { VoucherDetailComponent } from './voucher-detail/voucher-detail.component';

const routes: Routes = [
    { path: 'Event', component: EventComponent },
    { path: 'Offers', component: OffersComponent },
    { path: 'Sales', component: SalesComponent },
    { path: 'ShoppingOffers', component: ShoppingOffersComponent },
    { path: 'VoucherDetail/:Voucher_Code', canActivate: [SessionAliveGuard], component: VoucherDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoucherRoutingModule {}
