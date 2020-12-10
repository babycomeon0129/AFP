import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ShredModule } from 'src/app/shared/shared.module';

import { DeliveryRoutingModule } from './delivery-routing.module';
import { ForAppModule } from '../for-app/for-app.module';

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
    ForAppModule,
    FormsModule,
  ]
})
export class DeliveryModule {}
