import { Component, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppService } from '@app/app.service';
import { Response_AFPVerifyCode, Request_AFPVerifyCode, Request_AFPReadMobile, Response_AFPReadMobile } from '@app/_models';
// import { LoginRegisterModalComponent } from '../login-register-modal/login-register-modal.component';
import { MessageModalComponent } from '../message-modal/message-modal.component';

@Component({
  selector: 'app-forget-modal',
  templateUrl: './forget-modal.component.html'
})
export class ForgetModalComponent implements OnDestroy {
  /** 取得驗證碼用的request */
  public request: Request_AFPVerifyCode = {
    VerifiedAction: 2,
    SelectMode: 12,
    VerifiedInfo: {
      VerifiedPhone: null,
      CheckValue: null,
      VerifiedCode: null
    }
  };
  /** 發送驗證碼後的倒數計時器 */
  public vcodeCount: number | undefined;
  /** 倒數秒數 */
  public vcodeSeconds = 0;
  /** 檢查輸入帳號是否已存在 */
  public existingAccount = true;


  constructor(public bsModalRef: BsModalRef, private appService: AppService, private bsModal: BsModalService) { }

  /** 檢查帳號是否已存在 */
  checkAccount(): void {
    if (this.request.VerifiedInfo.VerifiedPhone.length < 10) {
      this.existingAccount = true;
    } else {
      const request: Request_AFPReadMobile = {
        // User_Code: this.oauthService.cookiesGet('userCode').s,
        SelectMode: 2,
        UserAccount: this.request.VerifiedInfo.VerifiedPhone
      };
      this.appService.toApi('Member', '1111', request).subscribe((data: Response_AFPReadMobile) => {
        this.existingAccount = data.IsExist;
      });
    }
  }

  /** 取得驗證碼 */
  setVcode(): void {
    this.appService.openBlock();
    this.appService.toApi('Home', '1112', this.request).subscribe((data: Response_AFPVerifyCode) => {
      this.request.VerifiedInfo.CheckValue = data.VerifiedInfo.CheckValue;
      this.vcodeSeconds = 59;
      this.vcodeCount = window.setInterval(() => {
        if (this.vcodeSeconds > 0) {
          this.vcodeSeconds--;
        } else {
          clearInterval(this.vcodeCount);
        }
      }, 1000);
    });
  }

  /** 立即驗證  */
  onSubmit(): void {
    this.appService.openBlock();
    this.request.SelectMode = 21;
    this.appService.toApi('Home', '1112', this.request).subscribe((data: Response_AFPVerifyCode) => {
      if (data !== null) {
        const initialState = {
          success: true,
          message: '手機驗證成功！立即重設密碼',
          showType: 3,
          VerifiedInfo: data.VerifiedInfo,
          checkBtnMsg: `確認`,
          checkBtnUrl: location.pathname
        };
        // this.modalService.show('message', { initialState });
        this.bsModal.show(MessageModalComponent, { initialState });
        this.closeModal();
      }
    });
  }

  /** 點擊返回 */
  goBackBtn(): void {
    // this.bsModal.show(LoginRegisterModalComponent);
    this.bsModalRef.hide();
    clearInterval(this.vcodeCount);

  }

  /** 關閉視窗 */
  closeModal(): void {
    this.bsModalRef.hide();
    clearInterval(this.vcodeCount);
  }

  ngOnDestroy(): void {
    clearInterval(this.vcodeCount);
  }

}
