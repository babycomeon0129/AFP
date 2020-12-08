import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SessionAliveGuard } from 'src/app/shared/auth/session-alive.guard';

import { GameCenterComponent } from './game-center/game-center.component';
import { GameComponent } from './game.component';

const routes: Routes = [
  { path: 'Game/:Game_Code', canActivate: [SessionAliveGuard], component: GameComponent },
  { path: 'GameCenter', canActivate: [SessionAliveGuard], component: GameCenterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule {}
