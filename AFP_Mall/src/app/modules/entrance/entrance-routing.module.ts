import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntranceResolver } from './entrance-resolver.service';
import { SessionAliveGuard } from 'src/app/shared/guard/session-alive-guard/session-alive.guard';
import { EntranceComponent } from './entrance.component';

const routes: Routes = [
  { path: '',
    canActivate: [SessionAliveGuard],
    component: EntranceComponent, data: {animation: 'Entrance'},
    // resolve: {homeData: EntranceResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntranceRoutingModule {}
