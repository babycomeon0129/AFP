import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ModalService } from 'src/app/service/modal.service';
import { AppService } from 'src/app/app.service';
import { Model_ShareData, Request_AFPVerify, Response_AFPVerify } from 'src/app/_models';

@Component({
  selector: 'app-forget-modal',
  templateUrl: './forget-modal.component.html'
})
export class ForgetModalComponent implements OnInit {
  public request: Request_AFPChangePwd = new Request_AFPChangePwd();
  /** 驗證那個驗證碼 */
  public verify: Request_AFPVerify = {
    UserInfo_Code: 0,
    AFPVerify: ''
  };
  /** 認證碼 */

  constructor(public bsModalRef: BsModalRef, public modal: ModalService, private appService: AppService) {}

  /** 忘記密碼驗證 */
  onSubmit() {
    this.appService.toApi('AFPAccount', '1102', this.verify).subscribe((data: Response_AFPVerify) => {
      const initialState = {
        UserInfoCode: data.UserInfo_Code,
        verifyCode: data.NoticeLog_CheckCode
      };
      console.log(data);
    });

    // this.appService.toApi('AFPAccount', '1106', this.request).subscribe((data: Response_AFPChangePwd) => {
    //   const initialState = {
    //     UserInfoCode: data.UserInfo_Code,
    //     Account: this.request.AFPAccount,
    //     Type: 1106
    //   };
    //   this.modal.show('vcode', { initialState }, this.bsModalRef);
    // });
  }

  /** 取得驗證碼 */
  setVcode() {
    this.appService.toApi('AFPAccount', '1106', this.request).subscribe((data: Response_AFPChangePwd) => {
      console.log(data);
    });
  }

  ngOnInit() {
  }

}

// tslint:disable-next-line: class-name
export class Request_AFPChangePwd extends Model_ShareData {
  AFPAccount: string;
}

// tslint:disable-next-line: class-name
export class Response_AFPChangePwd extends Model_ShareData {
  // tslint:disable-next-line: variable-name
  UserInfo_Code: number;
}
