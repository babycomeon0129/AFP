import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SessionAliveGuard } from 'src/app/shared/guard/session-alive-guard/session-alive.guard';
import { ChannelComponent } from './channel/channel.component'

const routes: Routes = [
  { path: '',
    canActivate: [SessionAliveGuard],
    component: ChannelComponent, data: {animation: 'Event'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
