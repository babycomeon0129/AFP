import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionAliveGuard } from 'src/app/shared/auth/session-alive.guard';

import { MissionComponent } from './mission.component';


const routes: Routes = [
  { path: '', canActivate: [SessionAliveGuard],  component: MissionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionRoutingModule {}
