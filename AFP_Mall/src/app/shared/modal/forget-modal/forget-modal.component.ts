import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ModalService } from 'src/app/service/modal.service';
import { AppService } from 'src/app/app.service';
import { Model_ShareData, Request_AFPVerify, Response_AFPVerify } from 'src/app/_models';
import { promise } from 'protractor';

@Component({
  selector: 'app-forget-modal',
  templateUrl: './forget-modal.component.html'
})
export class ForgetModalComponent implements OnInit {
  /** 取得驗證碼用的request */
  public request: Request_AFPChangePwd = new Request_AFPChangePwd();
  /** 驗證碼用 */
  public verify: Request_AFPVerify = {
    UserInfo_Code: 0,
    AFPVerify: ''
  };
  /** 發送驗證碼狀態 */
  public vcodeSet = false;
  /** 發送驗證碼後的倒數計時器 */
  public vcodeCount: any;
  /** 倒數秒數 */
  public vcodeSeconds = 0;


  constructor(public bsModalRef: BsModalRef, public modal: ModalService, private appService: AppService,
              private modalService: ModalService ) { }

  /** 取得驗證碼 */
  setVcode() {
    this.appService.openBlock();
    this.appService.toApi('AFPAccount', '1106', this.request).subscribe((data: Response_AFPChangePwd) => {
      this.verify.UserInfo_Code = data.UserInfo_Code;
      this.vcodeSeconds = 59;
      this.vcodeSet = true;
      this.vcodeCount = setInterval(() => {
        if ( this.vcodeSeconds > 0 ) {
          this.vcodeSeconds--;
        } else {
          clearInterval(this.vcodeCount);
        }
      }, 1000);
    });
  }

  /** 立即驗證  */
  onSubmit() {
    this.appService.openBlock();
    this.vcodeSet = false;
    this.appService.toApi('AFPAccount', '1102', this.verify).subscribe((data: Response_AFPVerify) => {
      const initialState = {
        UserInfoCode: data.UserInfo_Code,
        verifyCode: data.NoticeLog_CheckCode
      };
      this.modalService.confirm({ initialState: { message: '手機驗證成功！立即重設密碼' } }).subscribe( (res: boolean) => {
        if (res) {
          this.modalService.show('password', { initialState });
        }
        clearInterval(this.vcodeCount);
      });
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
