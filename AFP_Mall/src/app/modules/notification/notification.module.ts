import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { NotificationRoutingModule } from './notification-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

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
    SharedModule
  ]
})

export class NotificationModule {}
