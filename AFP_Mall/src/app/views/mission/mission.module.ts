import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { MissionRoutingModule } from './mission-routing.module';
import { ShredModule } from 'src/app/shared/shared.module';
import { FunctionModule } from '../function/function.module';

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
    ShredModule,
    FunctionModule,
    NgCircleProgressModule
  ]
})
export class MissionModule {}
