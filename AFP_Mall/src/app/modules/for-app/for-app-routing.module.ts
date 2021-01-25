import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppDownloadComponent } from './app-download/app-download.component';
import { AppGoPaymentComponent } from './app-go-payment/app-go-payment.component';
import { AppLogoutComponent } from './app-logout/app-logout.component';
import { AppRedirectComponent } from './app-redirect/app-redirect.component';

const routes: Routes = [
  { path: 'AppRedirect', component: AppRedirectComponent},
  { path: 'AppGoPayment', component: AppGoPaymentComponent },
  { path: 'AppLogout', component: AppLogoutComponent },
  { path: 'AppDownload', component: AppDownloadComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForAppRoutingModule {}
