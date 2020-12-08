import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  { path: '', component: NotificationComponent },
  { path: 'Notification/:IMessage_Code', component: NotificationDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule {}
