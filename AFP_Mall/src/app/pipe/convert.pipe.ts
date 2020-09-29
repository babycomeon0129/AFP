import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convert'
})
export class ConvertPipe implements PipeTransform {
  /**
   * 轉換編碼為實際顯示資料
   * @param value 編碼
   * @param args 依轉換類型，變化定義
   * @returns 實際顯示資料
   */
  transform(value: any, ...args: any[]): any {
    // args[0] 轉換類型
    switch (args[0]) {
      case 'UR':
      case 'UserReport': {
        // args[1] 匹配資料集，不可為空
        if (args[1] === undefined) { return ''; }
        // args[2] 大類別編碼
        // args[3] 上級大類別編碼
        // args[4] 上級小類別編碼
        // args[5] 輸出資料欄位
        const item = args[1].find(x => (args[2] === undefined || x.UserReport_CategoryCode === args[2])
          && x.UserReport_ItemCode === value
          && (args[3] === undefined || x.UserReport_UpCategoryCode === args[3])
          && (args[4] === undefined || x.UserReport_UpItemCode === args[4]));
        return item === undefined ? '' : item[args[5] === undefined ? 'UserReport_ItemName' : args[5]];
      }
    }
    return '';
  }

}
