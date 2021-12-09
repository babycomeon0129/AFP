import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'nullHref'
})
export class NullHrefPipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) {}
  /** a連結
   * @param url 連結路徑
   * @param page 當下所在頁面
   * @returns 過濾後連結路徑
   */
  transform(url: string, page: string): any {
    switch (url) {
      case null:
      case '':
      case 'null':
        // 避免404，a連結需無反應
        return this.sanitizer.bypassSecurityTrustUrl('javascript:;');
      case '/':
        // 當前頁若為首頁，a連結需無反應
        return (page === '/') ? this.sanitizer.bypassSecurityTrustUrl('javascript:;') : '/';
      default:
        return url;
    }
  }

}
