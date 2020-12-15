import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionAliveGuard } from 'src/app/shared/guard/session-alive-guard/session-alive.guard';

import { TravelComponent } from './travel.component';

const routes: Routes = [
  { path: '', canActivate: [SessionAliveGuard], component: TravelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelRoutingModule {}
