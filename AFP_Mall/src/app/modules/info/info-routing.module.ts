import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QAComponent } from './qa/qa.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TrafficComponent } from './traffic/traffic.component';
import { ReturnComponent } from './return/return.component';
import { MPointsComponent } from "./mpoints/mpoints.component";

const routes: Routes = [
  { path: 'QA', component: QAComponent, data: {animation: 'QA'} },
  { path: 'Terms', component: TermsComponent, data: {animation: 'Terms'}  },
  { path: 'Privacy', component: PrivacyComponent, data: {animation: 'Privacy'}  },
  { path: 'Traffic', component: TrafficComponent, data: {animation: 'Traffic'}  },
  { path: 'Return', component: ReturnComponent, data: {animation: 'Return'}  },
  { path: 'MPoints', component: MPointsComponent, data: {animation: 'MPoints'}  },
  { path: '', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule {}
