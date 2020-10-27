import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitOnlyDirective } from './digit-only.directive';
import { TargetControllerDirective } from './target-controller.directive';

@NgModule({
  declarations: [
    DigitOnlyDirective,
    TargetControllerDirective
  ],
  exports: [
    DigitOnlyDirective,
    TargetControllerDirective
  ],
  imports: [
    CommonModule
  ]
})
export class DirectiveModuleModule { }
