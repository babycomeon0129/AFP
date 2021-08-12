import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from 'src/app/app.service';
import { Model_ShareData } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class SessionAliveGuard implements CanActivate {


  constructor(private appService: AppService, private cookieService: CookieService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean  {
      // 保持使用者登入狀態(除非主動登出)
      // 若session為空
        // cookie有值: 將cookie資訊塞入session
        // cookie無值: 無動作
        // return true(都可繼續訪問)
      if (sessionStorage.getItem('userCode') === null || sessionStorage.getItem('CustomerInfo') === null) {
        if (this.cookieService.get('userCode').length > 0 && this.cookieService.get('CustomerInfo').length > 0) {
          if (this.CheckUser(this.cookieService.get('userCode'), this.cookieService.get('CustomerInfo'))) {
            sessionStorage.setItem('userName', this.cookieService.get('userName'));
            sessionStorage.setItem('userCode', this.cookieService.get('userCode'));
            sessionStorage.setItem('CustomerInfo', this.cookieService.get('CustomerInfo'));
            // sessionStorage.setItem('userFavorites', '');
            this.appService.loginState = true;
            this.appService.userName = sessionStorage.getItem('userName');
          }
        }

      }

      return true;
  }

  /**
   * 驗證會員
   * @param userCode 會員編號
   * @param customerInfo 消費者包
   */
  CheckUser(userCode: string, customerInfo: string) {
    const request: Request_AuthUser = {
      SearchModel: {UserInfoCode: userCode, CustomerInfo: customerInfo }
    };
    console.log(`1500:${customerInfo}`);
    // 登入驗證是否正確
    return new Promise(resolve => {
      this.appService.toApi('Member', '1500', request).subscribe((data: Response_AuthUser) => {
        console.log(`1500 response`);
        console.log(data);
        if (!data.CheckState) {
          //  驗證失敗，清除Cookie
          this.cookieService.deleteAll();
        }
        resolve(data.CheckState);
      });
    });
  }
}

class Request_AuthUser extends Model_ShareData {
  SearchModel: {
    UserInfoCode: string;
    CustomerInfo: string;
  };
}

class Response_AuthUser extends Model_ShareData {
  CheckState: boolean;
}
