import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionAliveGuard } from '../../shared/auth/session-alive.guard';
import { EntranceComponent } from './entrance.component';

const routes: Routes = [
  { path: '',
    canActivate: [SessionAliveGuard],
    component: EntranceComponent,
    data: {animation: 'Entrance'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntranceRoutingModule {}
