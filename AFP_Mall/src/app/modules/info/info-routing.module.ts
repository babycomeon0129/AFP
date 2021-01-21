import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QAComponent } from './qa/qa.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TrafficComponent } from './traffic/traffic.component';

const routes: Routes = [
  { path: 'QA', component: QAComponent, data: {animation: 'QA'} },
  { path: 'Terms', component: TermsComponent, data: {animation: 'Terms'}  },
  { path: 'Privacy', component: PrivacyComponent, data: {animation: 'Privacy'}  },
  { path: 'Traffic', component: TrafficComponent, data: {animation: 'Traffic'}  },
  { path: '', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule {}
