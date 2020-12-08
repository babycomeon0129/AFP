import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QAComponent } from './qa/qa.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TrafficComponent } from './traffic/traffic.component';

const routes: Routes = [
  { path: 'QA', component: QAComponent },
  { path: 'Terms', component: TermsComponent },
  { path: 'Privacy', component: PrivacyComponent },
  { path: 'Traffic', component: TrafficComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule {}
