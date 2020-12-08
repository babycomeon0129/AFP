import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';

import { TravelRoutingModule } from './travel-routing.module';
import { ShredModule } from 'src/app/shared/shared.module';
import { FunctionModule } from '../function/function.module';

import { TravelComponent } from './travel.component';

@NgModule({
  declarations: [
    TravelComponent
  ],
  exports: [
    TravelComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TravelRoutingModule,
    LazyLoadImageModule,
    NgxUsefulSwiperModule,
    ShredModule,
    FunctionModule,
  ]
})
export class TravelModule {}
