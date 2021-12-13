import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameCenterComponent } from './game-center/game-center.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: '', component: GameCenterComponent },
  { path: 'Game/:Game_Code', component: GameComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameCenterRoutingModule {}
