import { Injectable } from '@angular/core';
import { AppService } from './app.service';
declare var AppJSInterface: any;

@Injectable({
  providedIn: 'root'
})
/** Call APP所需的Interface都會在這裡 */
export class AppJSInterfaceService {


  constructor(private appService: AppService) { }

  /** 通知APP是否開啟BottomBar
   * @param isOpen true: 開 , false: 關
   */
   appShowMobileFooter(isOpen: boolean): void {
    if (this.appService.isApp !== null) {
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        AppJSInterface.showBottomBar(isOpen);
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'showBottomBar', isShow: isOpen });
      }
    }
  }

  /** 通知APP是否開啟showBackButton
   * @param isShowBt true: 開 , false: 關
   */
   appShowBackButton(isShowBt: boolean): void {
    if (this.appService.isApp !== null) {
      if (navigator.userAgent.match(/android/i)) {
        // Android
        AppJSInterface.showBackButton(isShowBt);
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        // IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'showBackButton', isShow: isShowBt });
      }
    }
  }

  /** 通知App關閉Web view 的關閉按鈕 (true : 關閉) */
  appWebViewbutton(isOpen: boolean): void {
    if (this.appService.isApp !== null) {
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        AppJSInterface.showCloseButton(isOpen);
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'showCloseButton', isShow: isOpen });
      }
    }
  }

  /** 通知App關閉web view */
  appWebViewClose(): void {
    if (navigator.userAgent.match(/android/i)) {
      //  Android
      AppJSInterface.back();
    } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
      //  IOS
      (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'back' });
    }
  }

  /** 如果是app，開啟商家詳細頁時導到原生商家詳細頁 */
  goAppExploreDetail(code: number): void {
    if (navigator.userAgent.match(/android/i)) {
      //  Android
      AppJSInterface.goAppExploreDetail(code);
    } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
      //  IOS
      (window as any).webkit.messageHandlers.AppJSInterface
      .postMessage({ action: 'goAppExploreDetail', storeId: code });
    }
  }

  /** 如果是app，開啟產品資訊頁時導到原生產品資訊頁 */
  goAppShoppingDetail(code: number, code1: number): void {
    if (navigator.userAgent.match(/android/i)) {
      //  Android
      AppJSInterface.goAppShoppingDetail(code, code1);
    } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
      //  IOS
      (window as any).webkit.messageHandlers.AppJSInterface
      .postMessage({ action: 'goAppShoppingDetail', productId: code, userDefineCode: code1 });
    }
  }
}
