import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: 'a[appTargetController]'
})
export class TargetControllerDirective implements OnChanges {
  /** 是否要移除target */
  @Input() appTargetController = false;
  /** target開啟方式 */
  @Input() openWay = '_blank';

  constructor(private el: ElementRef) { }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    const key = 'target';
    const elem = this.el.nativeElement as HTMLAnchorElement;
    simpleChanges.appTargetController.currentValue ? elem.removeAttribute(key) : elem.setAttribute(key, this.openWay);

  }

}
