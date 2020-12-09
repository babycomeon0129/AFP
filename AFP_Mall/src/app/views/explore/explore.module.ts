import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { AgmCoreModule } from '@agm/core';

import { ExploreRoutingModule } from './explore-routing.module';
import { ShredModule } from 'src/app/shared/shared.module';
import { FunctionModule } from './../function/function.module';

import { ExploreDetailComponent } from './explore-detail/explore-detail.component';
import { ExploreListComponent } from './explore-list/explore-list.component';
import { ExploreMapComponent } from './explore-map/explore-map.component';

@NgModule({
  declarations: [
    ExploreListComponent,
    ExploreDetailComponent,
    ExploreMapComponent
  ],
  exports: [
    ExploreListComponent,
    ExploreDetailComponent,
    ExploreMapComponent
  ],
  entryComponents: [
    ExploreMapComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ExploreRoutingModule,
    LazyLoadImageModule,
    NgxUsefulSwiperModule,
    ShredModule,
    FunctionModule,
    FormsModule,
    AgmCoreModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExploreModule {}
