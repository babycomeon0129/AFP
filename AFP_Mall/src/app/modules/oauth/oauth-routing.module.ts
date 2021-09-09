import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionAliveGuard } from 'src/app/shared/guard/session-alive-guard/session-alive.guard';
import { OauthComponent } from './oauth.component';

const routes: Routes = [
  { path: '',
    canActivate: [SessionAliveGuard],
    component: OauthComponent, data: {animation: 'Oauth'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OauthRoutingModule {}
