import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { GameCenterRoutingModule } from './game-center-routing.module';
import { ShredModule } from 'src/app/shared/shared.module';
import { ForAppModule } from '../for-app/for-app.module';

import { GameComponent } from './game/game.component';
import { GameCenterComponent } from './game-center/game-center.component';
import { LuckyspinComponent } from './game/luckyspin/luckyspin.component';
import { ScratchComponent } from './game/scratch/scratch.component';

@NgModule({
  declarations: [
    GameCenterComponent,
    GameComponent,
    LuckyspinComponent,
    ScratchComponent
  ],
  exports: [
    GameCenterComponent,
    GameComponent,
    LuckyspinComponent,
    ScratchComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    GameCenterRoutingModule,
    LazyLoadImageModule,
    ShredModule,
    ForAppModule
  ]
})
export class GameCenterModule {}
