import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SessionAliveGuard } from 'src/app/shared/auth/session-alive.guard';

import { ReturnDetailComponent } from './return-detail/return-detail.component';
import { ReturnDialogComponent } from './return-dialog/return-dialog.component';
import { ReturnComponent } from './return/return.component';

const routes: Routes = [
  { path: ':Order_TableNo', canActivate: [SessionAliveGuard], component: ReturnComponent },
  { path: 'ReturnDetail/:Services_TableNo', component: ReturnDetailComponent },
  { path: 'ReturnDialog/:Services_TableNo', component: ReturnDialogComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnRoutingModule {}
