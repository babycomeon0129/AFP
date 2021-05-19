import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textFilter'
})
export class TextFilterPipe implements PipeTransform {
  /** 文字篩選
   * @param items 資料陣列
   * @param searchText 使用者輸入之搜尋關鍵字
   * @param pageCode 使用頁面代碼（1: MemberDiscount 2: MemberTicket）
   * @returns 篩選後含searchText的資料
   */
  transform(items: any[], searchText: string, pageCode: number): any[] {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(x => {
      switch (pageCode) {
        case 1:
          // 會員-我的優惠券（優惠券名稱、商家名搜尋）
          return x.Voucher_ExtName.toLocaleLowerCase().includes(searchText) || x.Voucher_Title.toLocaleLowerCase().includes(searchText);
        case 2:
          // 會員-我的車票（車票名稱、商家名搜尋）
          return x.UserTicket_ShowName.toLocaleLowerCase().includes(searchText) || x.UserTicket_Title.toLocaleLowerCase().includes(searchText);
      }
    });
  }

}
