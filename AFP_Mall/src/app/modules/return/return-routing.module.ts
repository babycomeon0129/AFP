import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnDetailComponent } from './return-detail/return-detail.component';
import { ReturnDialogComponent } from './return-dialog/return-dialog.component';
import { ReturnComponent } from './return/return.component';



const routes: Routes = [
  { path: 'ReturnDetail/:Services_TableNo', component: ReturnDetailComponent },
  { path: 'ReturnDialog/:Services_TableNo', component: ReturnDialogComponent },
  { path: ':Order_TableNo', component: ReturnComponent },
  { path: '', redirectTo: '/Member' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnRoutingModule {}
