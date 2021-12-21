import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeedbackComponent } from './feedback/feedback.component';
import { MissionRoutingModule } from './mission-routing.module';
import { MissionComponent } from './mission.component';




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
    FormsModule,
    RouterModule,
    MissionRoutingModule,
    LazyLoadImageModule,
    SharedModule,
    NgCircleProgressModule
  ]
})
export class MissionModule {}
