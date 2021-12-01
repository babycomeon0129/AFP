import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullTarget'
})
export class NullTargetPipe implements PipeTransform {
  /** a連結的target
   * @param tag 開啟連結的target
   * @param url 連結路徑
   * @param page 當下所在頁面
   * @returns 過濾後開啟連結的target
   */
  transform(tag: string, url: string, page: string): any {
    // 無效網址時，target為_self
    if (url === '' || url === '#' || url === null) {
      return '_self';
    } else {
      // 在首頁且url設定為'/'，target為_self
      if (page === '/' && url === '/') {
        return '_self';
      }
      return tag;
    }
  }

}
