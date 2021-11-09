import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SessionAliveGuard } from 'src/app/shared/guard/session-alive-guard/session-alive.guard';

import { GameCenterComponent } from './game-center/game-center.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: '', component: GameCenterComponent },
  { path: 'Game/:Game_Code', component: GameComponent }
  // { path: '', canActivate: [SessionAliveGuard], component: GameCenterComponent },
  // { path: 'Game/:Game_Code', canActivate: [SessionAliveGuard], component: GameComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameCenterRoutingModule {}
