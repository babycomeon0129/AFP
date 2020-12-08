import { FunctionModule } from './../function/function.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EntranceRoutingModule } from './entrance-routing.module';
import { ShredModule } from '../../shared/shared.module';

import { QRCodeModule } from 'angularx-qrcode';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { SortablejsModule } from 'ngx-sortablejs';

import { EntranceComponent } from './entrance.component';

@NgModule({
  declarations: [
    EntranceComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    EntranceRoutingModule,
    QRCodeModule,
    LazyLoadImageModule,
    NgxUsefulSwiperModule,
    ShredModule,
    SortablejsModule,
    FunctionModule
  ],
  exports: [
    EntranceComponent
  ]
})
export class EntranceModule {}
