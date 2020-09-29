import { NgModule } from '@angular/core';
import { SafePipe } from './safe.pipe';
import { ConvertPipe } from './convert.pipe';
import { TextFilterPipe } from './text-filter.pipe';

@NgModule({
  imports: [
  ],
  declarations: [
    SafePipe,
    ConvertPipe,
    TextFilterPipe
  ],
  exports: [
    SafePipe,
    ConvertPipe,
    TextFilterPipe
  ]
})
export class SharedPipeModule { }
