import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { ReturnRoutingModule } from './return-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReturnDetailComponent } from './return-detail/return-detail.component';
import { ReturnDialogComponent } from './return-dialog/return-dialog.component';
import { ReturnComponent } from './return/return.component';

@NgModule({
  declarations: [
    ReturnComponent,
    ReturnDetailComponent,
    ReturnDialogComponent
  ],
  exports: [
    ReturnComponent,
    ReturnDetailComponent,
    ReturnDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReturnRoutingModule,
    FormsModule,
    LazyLoadImageModule,
    SharedModule
  ]
})
export class ReturnModule {}
