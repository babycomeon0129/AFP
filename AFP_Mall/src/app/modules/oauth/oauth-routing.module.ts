import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionAliveGuard } from 'src/app/shared/guard/session-alive-guard/session-alive.guard';
import { OauthLoginComponent } from './oauth-login/oauth-login.component';

const routes: Routes = [
  { path: '', component: OauthLoginComponent },
  // { path: '', canActivate: [SessionAliveGuard], component: OauthLoginComponent },
  // { path: 'Oauth', canActivate: [SessionAliveGuard], component: OauthComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OauthRoutingModule { }