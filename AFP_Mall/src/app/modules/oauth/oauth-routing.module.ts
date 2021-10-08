import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionAliveGuard } from 'src/app/shared/guard/session-alive-guard/session-alive.guard';
import { OauthLoginComponent } from './oauth-login/oauth-login.component';
import { OauthComponent } from './oauth/oauth.component';

const routes: Routes = [
  { path: '', component: OauthLoginComponent },
  { path: 'Oauth', component: OauthComponent },
  // { path: '', canActivate: [SessionAliveGuard], component: OauthLoginComponent },
  // { path: 'Oauth', canActivate: [SessionAliveGuard], component: OauthComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OauthRoutingModule { }
