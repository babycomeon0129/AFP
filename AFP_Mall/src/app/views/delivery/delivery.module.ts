import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ShredModule } from 'src/app/shared/shared.module';
import { FunctionModule } from '../function/function.module';

import { DeliveryRoutingModule } from './delivery-routing.module';

import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';

@NgModule({
  declarations: [
    DeliveryInfoComponent
  ],
  exports: [
    DeliveryInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DeliveryRoutingModule,
    LazyLoadImageModule,
    ShredModule,
    FunctionModule,
    FormsModule,
  ]
})
export class DeliveryModule {}
