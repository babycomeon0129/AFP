import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AppService } from '@app/app.service';
import { AFP_VerifiedInfo } from '@app/_models';
import { MessageModalComponent } from '../message-modal/message-modal.component';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html'
})
export class PasswordModalComponent {
  /** 由外部Modal傳入的VerifiedInfo(詳忘記密碼流程)，API的resetpwd必須有(如無外部傳入請另外設置) */
  VerifiedInfo: AFP_VerifiedInfo;
  /** 設定密碼用 */
  public pwdModel = {
    UserInfo_Code: 0,
    AFPPassword: '',
    AFPPasswordRe: '',
    AFPVerify: ''
  };
  /** 密碼可見用 */
  public pwdEyes = false;
  /** 二次密碼可見用 */
  public repwdEyes = false;

  constructor(public bsModalRef: BsModalRef, private appService: AppService, private bsModal: BsModalService) { }

  /** 註冊送出 */
  onSubmit(): void {
    if (this.pwdModel.AFPPassword === this.pwdModel.AFPPasswordRe) {
      this.appService.openBlock();
      const resetpwd: Request_AFPPassword = {
        AFPPassword: this.pwdModel.AFPPassword,
        VerifiedInfo: this.VerifiedInfo
      };
      this.appService.toApi('Home', '1103', resetpwd).subscribe((data: any) => {
        if (data !== null) {
            this.bsModal.show(MessageModalComponent, { initialState: { success: true, message: '密碼已設定完成，請重新登入', showType: 4, checkBtnMsg: `重新登入` } });
            this.bsModalRef.hide();
        }
      });
    }
  }

}


/** 忘記密碼 RequestModel */
interface Request_AFPPassword {
  /** 密碼 */
  AFPPassword: string;
  /** 驗證資訊 */
  VerifiedInfo?: AFP_VerifiedInfo;
}
