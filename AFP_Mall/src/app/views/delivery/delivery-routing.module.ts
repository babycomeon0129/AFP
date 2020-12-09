import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';

const route: Routes = [
  { path: 'DeliveryInfo/:ECStore_Code', component: DeliveryInfoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule {}
