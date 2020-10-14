import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Request_AFPPassword } from 'src/app/_models';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html'
})
export class PasswordModalComponent implements OnInit {
  UserInfoCode: number;
  verifyCode: string;
  checkPwd = true;

  /** 設定密碼用 */
  public pwdModel: Request_AFPPassword = {
    UserInfo_Code: 0,
    AFPPassword: '',
    AFPPasswordRe: '',
    AFPVerify: ''
  };
  /** 密碼可見用 */
  public pwdEyes = false;
  /** 二次密碼可見用 */
  public repwdEyes = false;

  constructor(public bsModalRef: BsModalRef, private appService: AppService, private modalService: ModalService) { }

  /** 註冊送出 */
  onSubmit() {
    if (this.pwdModel.AFPPassword === this.pwdModel.AFPPasswordRe) {
      this.appService.openBlock();
      this.checkPwd = true;
      this.appService.toApi('AFPAccount', '1103', this.pwdModel).subscribe((data: any) => {
        this.modalService.show('message', { initialState: { success: true, message: '密碼已設定完成，請重新登入', showType: 2}}, this.bsModalRef);
      });
    } else {
      this.checkPwd = false;
    }
  }

  ngOnInit() {
    this.pwdModel.UserInfo_Code = this.UserInfoCode;
    this.pwdModel.AFPVerify = this.verifyCode;
  }

}
