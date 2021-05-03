import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InfoRoutingModule } from './info-routing.module';
import { SharedModule } from '@app/shared/shared.module';

import { PrivacyComponent } from './privacy/privacy.component';
import { QAComponent } from './qa/qa.component';
import { TermsComponent } from './terms/terms.component';
import { TrafficComponent } from './traffic/traffic.component';

@NgModule({
  declarations: [
    QAComponent,
    TermsComponent,
    PrivacyComponent,
    TrafficComponent
  ],
  exports: [
    QAComponent,
    TermsComponent,
    PrivacyComponent,
    TrafficComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InfoRoutingModule,
    SharedModule
  ]
})
export class InfoModule {}
