import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDigitOnly]'
})
export class DigitOnlyDirective {
  // Delete, Backspace, Tab, Escape, Enter, arrow left, arrow right NOTE: keycodes seem the same in Mac and Windows
  // private navigationKeys = [46, 8, 9, 27, 13, 37, 39];
  private navigationKeys = ['Delete', 'Backspace', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];
  public inputElement: HTMLElement;

  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (
      // Allow: Delete, Backspace, Tab, Escape, Enter, etc
      this.navigationKeys.indexOf(e.key) > -1 ||
      (e.key === 'a' && e.ctrlKey) || // Allow: Ctrl+A
      (e.key === 'c' && e.ctrlKey) || // Allow: Ctrl+C
      (e.key === 'v' && e.ctrlKey) || // Allow: Ctrl+V
      (e.key === 'x' && e.ctrlKey) || // Allow: Ctrl+X
      (e.key === 'a' && e.metaKey) || // Cmd+A (Mac)
      (e.key === 'c' && e.metaKey) || // Cmd+C (Mac)
      (e.key === 'v' && e.metaKey) || // Cmd+V (Mac)
      (e.key === 'x' && e.metaKey) // Cmd+X (Mac)
    ) {
      return;  // let it happen, don't do anything
    }
    // Ensure that it is a number and stop the keypress
    if (e.key === ' ' || isNaN(Number(e.key))) {
      e.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedInput: string = event.clipboardData
      .getData('text/plain')
      .replace(/\D/g, ''); // get a digit-only string
    document.execCommand('insertText', false, pastedInput);
  }

  // @HostListener('drop', ['$event'])
  // onDrop(event: DragEvent) {
  //   event.preventDefault();
  //   const textData = event.dataTransfer
  //     .getData('text').replace(/\D/g, '');
  //   // this.inputElement.focus();
  //   this.el.nativeElement.focus();
  //   document.execCommand('insertText', false, textData);
  // }

}
