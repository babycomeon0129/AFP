import { Injectable } from '@angular/core';
import { AppService } from '@app/app.service';
declare var AppJSInterface: any;

@Injectable({
  providedIn: 'root'
})
/** Call APP所需的Interface都會在這裡 */
export class AppJSInterfaceService {
  AppJSInterface: any;

  private ua = navigator.userAgent.toLowerCase();

  constructor(private appService: AppService) { }

  /** 通知APP是否開啟BottomBar
   * @param isOpen true: 開 , false: 關
   */
   appShowMobileFooter(isOpen: boolean): void {
    if (this.appService.isApp === 1) {
      if (this.ua.match(/android/i)) {
        //  Android
        AppJSInterface.showBottomBar(isOpen);
      } else if (this.ua.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'showBottomBar', isShow: isOpen });
      }
    }
  }

  /** 通知APP是否開啟返回鍵
   * @param isShowBt true: 開 , false: 關
   */
   appShowBackButton(isShowBt: boolean): void {
    if (this.appService.isApp === 1) {
      if (this.ua.match(/android/i)) {
        // Android
        AppJSInterface.showBackButton(isShowBt);
      } else if (this.ua.match(/(iphone|ipad|ipod);?/i)) {
        // IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'showBackButton', isShow: isShowBt });
      }
    }
  }

  /** 通知App關閉Web view 的關閉按鈕
   * @param isOpen true: 關閉 false: 開啟
   */
  appWebViewbutton(isOpen: boolean): void {
    if (this.appService.isApp === 1) {
      if (this.ua.match(/android/i)) {
        //  Android
        AppJSInterface.showCloseButton(isOpen);
      } else if (this.ua.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'showCloseButton', isShow: isOpen });
      }
    }
  }

  /** 通知App關閉web view */
  appWebViewClose(): void {
    if (this.appService.isApp === 1) {
      if (this.ua.match(/android/i)) {
        //  Android
        AppJSInterface.back();
      } else if (this.ua.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'back' });
      }
    }
  }

  /** 如果是app，開啟商家詳細頁時導到原生商家詳細頁
   * @param code 商店code
   */
  goAppExploreDetail(code: number): void {
    if (this.appService.isApp === 1) {
      if (this.ua.match(/android/i)) {
        //  Android
        AppJSInterface.goAppExploreDetail(code);
      } else if (this.ua.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface
        .postMessage({ action: 'goAppExploreDetail', storeId: code });
      }
    }
  }

  /** 如果是app，開啟產品資訊頁時導到原生產品資訊頁 */
  goAppShoppingDetail(code: number, code1: number): void {
    if (this.appService.isApp === 1) {
      if (this.ua.match(/android/i)) {
        //  Android
        AppJSInterface.goAppShoppingDetail(code, code1);
      } else if (this.ua.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface
        .postMessage({ action: 'goAppShoppingDetail', productId: code, userDefineCode: code1 });
      }
    }
  }

  /** 通知APP登入idToken
   * https://bookstack.eyesmedia.com.tw/books/mobii-x/page/responseapimodel-api-mobii
   */
   getLoginData(userInfo: string, code: string, name: string): void {
    if (this.appService.isApp === 1) {
      if (this.ua.match(/android/i)) {
        //  Android
        AppJSInterface.getLoginData(userInfo, code, name);
      } else if (this.ua.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        if ((window as any).webkit) {
          if ((window as any).webkit.messageHandlers) {
            (window as any).webkit.messageHandlers.AppJSInterface.postMessage({
              action: 'getLoginData', idToken: userInfo, userCode: code, userName: name});
          }
        }
      }
    }
  }

}
