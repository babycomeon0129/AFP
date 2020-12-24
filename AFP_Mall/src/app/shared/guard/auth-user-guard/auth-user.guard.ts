import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { MessageModalComponent } from '../../../shared/modal/message-modal/message-modal.component';
import { AppService } from '../../../app.service';
import { Model_ShareData } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class AuthUserGuard implements CanActivate {
  constructor(private appService: AppService, private bsModal: BsModalService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (!this.appService.loginState) {
      // 未登入導回首頁
      this.bsModal.show(MessageModalComponent
        , { class: 'modal-sm modal-smbox', initialState: { success: false, message: '請先登入' } });
      this.router.navigate(['/']);
    } else {
      const request: Request_AuthUser = new Request_AuthUser();
      request.User_Code = sessionStorage.getItem('userCode');
      // 登入驗證是否正確
      this.appService.toApi('Member', '1500', request).subscribe((data: any) => {
      });
    }
    return true;
  }

}

// tslint:disable-next-line: class-name
export class Request_AuthUser extends Model_ShareData {
}
