import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OauthLoginComponent } from './oauth-login/oauth-login.component';

const routes: Routes = [
  { path: '', component: OauthLoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OauthRoutingModule { }
