import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { MissionRoutingModule } from './mission-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { MissionComponent } from './mission.component';
import { FeedbackComponent } from './feedback/feedback.component';

@NgModule({
  declarations: [
    MissionComponent,
    FeedbackComponent
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
    NgCircleProgressModule
  ]
})
export class MissionModule {}
