import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullHref'
})
export class NullHrefPipe implements PipeTransform {
  /** a連結
   * @param url 連結路徑
   * @param page 當下所在頁面
   * @returns 過濾後連結路徑
   */
  transform(url: string, page: string): any {
    console.log(page);
    switch (url) {
      case 'null':
        // 避免404，a連結需無反應
        return 'javascript:;';
      default:
        return url;
    }
  }

}
