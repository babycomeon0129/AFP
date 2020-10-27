import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitOnlyDirective } from './digitonly-directive/digit-only.directive';
import { KeyControllerDirective } from './keycontroller-directive/key-controller.directive';

@NgModule({
  declarations: [
    DigitOnlyDirective,
    KeyControllerDirective
  ],
  exports: [
    DigitOnlyDirective,
    KeyControllerDirective
  ],
  imports: [
    CommonModule
  ]
})
export class DirectiveModuleModule { }
