import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Model_ShareData } from '@app/_models';
import { AppService } from '@app/app.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})

//TODO: 原欲切分service功能才設置，但再注入註冊登入模組時，因此service跟註冊登入有注入appservice，造成的循環依賴導致整個死掉無法渲染畫面
// 未來必需規劃如何切分＆解決循環依賴，即可啟用這個service
export class CloudMessagingService {
  /** 當前訊息 */
  public currentMessage = new BehaviorSubject(null);
  /** 推播訊息數量 */
  public pushCount = Number(this.cookieService.get('pushCount')) || 0;
  /** GUID (推播使用) */
  public deviceCode = sessionStorage.getItem('M_DeviceCode') || null ;


  constructor(private angularFireMessaging: AngularFireMessaging, private cookieService: CookieService, private appService: AppService) {
    // 這裡在幹嘛我也不是很懂
    this.angularFireMessaging.messages.subscribe(
      (_messaging: AngularFireMessaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      });
  }

  /** 向firebase message 請求token */
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        this.toPushApi(token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /** 接收推播訊息 */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
        this.pushCount ++ ;
        this.cookieService.set('pushCount', this.pushCount.toString(), 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
      });
  }

  /** 產生device code */
  guid(): string {
    let d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  /** 推播-取得含device code的新消費者包 */
  toPushApi(token: string): void {
    if (this.deviceCode === null) {
      this.deviceCode = this.guid();
      sessionStorage.setItem('M_DeviceCode', this.deviceCode);
    }
    const request: Request_AFPPushToken = {
      User_Code: sessionStorage.getItem('userCode'),
      Token: token
    };
    this.appService.toApi('Home', '1113', request, null, null, this.deviceCode).subscribe((data: Response_AFPPushToken) => {
      console.log(data);
      sessionStorage.setItem('CustomerInfo', data.CustomerInfo);
      this.cookieService.set('CustomerInfo', data.CustomerInfo, 90, '/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    });
  }


}

/** 推撥登記 RequestModel */
interface Request_AFPPushToken extends Model_ShareData {
  /** FireBase Token */
  Token: string;
}

/** 推撥登記 ResponseModel */
interface Response_AFPPushToken extends Model_ShareData {
  /** 消費者包 */
  CustomerInfo: string;
}
