import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'linkify'
})
export class LinkifyPipe implements PipeTransform {

  /** 幫內文的網址自動加上超連結。
   *  內文如需自動補上連結，該連結必須『前後都加上半形空白』才可順利判斷。
   *  不然會因為split(' ')斷錯導致<a>補到怪怪的地方 */
  constructor(private _domSanitizer: DomSanitizer) { }

  transform(value: any, args?: any): any {
    return this._domSanitizer.bypassSecurityTrustHtml(this.stylize(value));
  }

  private stylize(text: string): string {
    let stylizedText = '';
    if (text && text.length > 0) {
      for (let t of text.split(' ')) {
        if ((t.startsWith('https') || t.startsWith('http')) && t.length > 1)
          stylizedText += `<a href="${t}" target="_blank">${t}</a> `;
        else
          stylizedText += t + ' ';
      }
      return stylizedText;
    }
    else return text;
  }

}
