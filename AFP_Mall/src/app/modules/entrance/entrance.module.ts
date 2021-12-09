import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxMasonryModule } from 'ngx-masonry';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { EntranceRoutingModule } from './entrance-routing.module';
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
    NgxMasonryModule
  ],
  exports: [
    EntranceComponent
  ]
})
export class EntranceModule {}
