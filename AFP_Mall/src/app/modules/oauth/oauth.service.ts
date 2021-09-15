import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare var AppJSInterface: any;
@Injectable({
  providedIn: 'root'
})
export class OauthService {

  /** Eyes登入裝置類型 0 : Web 1 : iOS 2 : Android */
  public loginDeviceType: string;

  constructor(private router: Router) {}
  /** 判斷跳出網頁或APP的登入頁 */
  loginPage(): void {
    if (navigator.userAgent.match(/android/i)) {
      //  Android
      this.loginDeviceType = '2';
      AppJSInterface.login();
    } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
      //  IOS
      this.loginDeviceType = '1';
      (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'login' });
    } else {
      this.router.navigate(['/Login']);
      this.loginDeviceType = '0';
    }
  }
}
