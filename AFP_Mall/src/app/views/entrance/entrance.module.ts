import { FunctionModule } from './../function/function.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EntranceComponent } from './entrance.component';
import { EntranceRoutingModule } from './entrance-routing.module';

import { QRCodeModule } from 'angularx-qrcode';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
// import { SharedPipeModule } from '../../shared/pipe/shared-pipe.module';
import { ShredModule } from '../../shared/shared.module';
import { SortablejsModule } from 'ngx-sortablejs';
// import { DirectiveModuleModule } from '../../shared/directive/directive-module.module';


@NgModule({
  declarations: [
    EntranceComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    QRCodeModule,
    LazyLoadImageModule,
    NgxUsefulSwiperModule,
    // SharedPipeModule,
    ShredModule,
    SortablejsModule,
    // DirectiveModuleModule,
    EntranceRoutingModule,
    FunctionModule
  ],
  exports: [
    EntranceComponent
  ]
})
export class EntranceModule {}
