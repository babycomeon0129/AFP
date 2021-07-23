import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { EventRoutingModule } from './event-routing.module';
import { ChannelComponent } from './channel/channel.component';


@NgModule({
  declarations: [ChannelComponent],
  imports: [
    CommonModule,
    EventRoutingModule,
    SharedModule
  ]
})
export class EventModule { }
