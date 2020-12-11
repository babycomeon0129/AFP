import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';

import { TravelRoutingModule } from './travel-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForAppModule } from '../for-app/for-app.module';

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
    SharedModule,
    ForAppModule
  ]
})
export class TravelModule {}
