import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { QRCodeModule } from 'angularx-qrcode';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { SortablejsModule } from 'ngx-sortablejs';

import { EntranceRoutingModule } from './entrance-routing.module';
import { SharedModule } from '@app/shared/shared.module';

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
    SharedModule,
    SortablejsModule
  ],
  exports: [
    EntranceComponent
  ]
})
export class EntranceModule {}
