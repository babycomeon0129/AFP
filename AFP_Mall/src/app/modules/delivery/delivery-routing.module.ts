import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';

const route: Routes = [
  { path: 'DeliveryInfo/:ECStore_Code', component: DeliveryInfoComponent},
  { path: '', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule {}
