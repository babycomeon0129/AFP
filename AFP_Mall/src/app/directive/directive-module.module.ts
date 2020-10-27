import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitOnlyDirective } from './digit-only.directive';

@NgModule({
  declarations: [
    DigitOnlyDirective
  ],
  exports: [
    DigitOnlyDirective
  ],
  imports: [
    CommonModule
  ]
})
export class DirectiveModuleModule { }
