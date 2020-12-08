import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { NotificationRoutingModule } from './notification-routing.module';
import { ShredModule } from 'src/app/shared/shared.module';
import { FunctionModule } from '../function/function.module';

import { NotificationComponent } from './notification/notification.component';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';

@NgModule({
  declarations: [
    NotificationComponent,
    NotificationDetailComponent
  ],
  exports: [
    NotificationComponent,
    NotificationDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NotificationRoutingModule,
    FormsModule,
    LazyLoadImageModule,
    ShredModule,
    FunctionModule
  ]
})

export class NotificationModule {}
