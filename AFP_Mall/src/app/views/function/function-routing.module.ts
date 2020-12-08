import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionAliveGuard } from '../../shared/auth/session-alive.guard';

import { AppDownloadComponent } from './app-download/app-download.component';
import { AppGoPaymentComponent } from './app-go-payment/app-go-payment.component';
import { AppLoginSuccessComponent } from './app-login-success/app-login-success.component';
import { AppLoginComponent } from './app-login/app-login.component';
import { AppLogoutComponent } from './app-logout/app-logout.component';
import { AppRedirectComponent } from './app-redirect/app-redirect.component';
import { BearServicesComponent } from './bearservices/bearservices.component';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { Error503Component } from './error503/error503.component';

const routes: Routes = [
  { path: '',
    canActivate: [SessionAliveGuard],
    data: {animation: 'Function'},
    children: [
      { path: 'BearServices', component: BearServicesComponent },
      { path: 'AppLogin', component: AppLoginComponent },
      { path: 'AppLoginSuccess', component: AppLoginSuccessComponent },
      { path: 'AppRedirect', component: AppRedirectComponent},
      { path: 'AppGoPayment', component: AppGoPaymentComponent },
      { path: 'AppLogout', component: AppLogoutComponent },
      { path: 'AppDownload', component: AppDownloadComponent },
      { path: 'Error500', component: Error500Component},
      { path: 'Error503', component: Error503Component},
      // { path: '**', component: Error404Component }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunctionRoutingModule {}
