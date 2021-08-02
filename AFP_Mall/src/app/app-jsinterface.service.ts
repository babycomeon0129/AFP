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
}
