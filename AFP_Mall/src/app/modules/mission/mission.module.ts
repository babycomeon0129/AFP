import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { MissionRoutingModule } from './mission-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForAppModule } from '../for-app/for-app.module';

import { MissionComponent } from './mission.component';

@NgModule({
  declarations: [
    MissionComponent
  ],
  exports: [
    MissionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MissionRoutingModule,
    LazyLoadImageModule,
    SharedModule,
    ForAppModule,
    NgCircleProgressModule
  ]
})
export class MissionModule {}
