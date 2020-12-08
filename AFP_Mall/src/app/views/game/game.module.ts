import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';

import { GameRoutingModule } from './game-routing.module';
import { ShredModule } from 'src/app/shared/shared.module';
import { FunctionModule } from '../function/function.module';

import { GameComponent } from './game.component';
import { GameCenterComponent } from './game-center/game-center.component';
import { LuckyspinComponent } from './luckyspin/luckyspin.component';
import { ScratchComponent } from './scratch/scratch.component';

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
    GameRoutingModule,
    LazyLoadImageModule,
    ShredModule,
    FunctionModule
  ]
})
export class GameModule {}
