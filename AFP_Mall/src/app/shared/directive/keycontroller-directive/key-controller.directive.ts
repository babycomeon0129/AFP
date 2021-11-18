import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appKeyController]'
})
export class KeyControllerDirective implements OnChanges {

  /** 是否刪除屬性 */
  @Input() appKeyController = false;
  /** 要刪除哪個屬性 */
  @Input() keyControl: string;
  /** 該屬性的內容 */
  @Input() keyValue: string;

  constructor(public el?: ElementRef) { }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    const elem = this.el.nativeElement as HTMLAnchorElement;
    simpleChanges.appKeyController.currentValue ? elem.removeAttribute(this.keyControl) : elem.setAttribute(this.keyControl, this.keyValue);

  }

}
