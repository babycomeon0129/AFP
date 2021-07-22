import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from './event-routing.module';
import { ChannelComponent } from './channel/channel.component';


@NgModule({
  declarations: [ChannelComponent],
  imports: [
    CommonModule,
    EventRoutingModule
  ]
})
export class EventModule { }
