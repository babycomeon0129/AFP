import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ModalService } from 'src/app/service/modal.service';
import { AppService } from 'src/app/app.service';
import {
  Model_ShareData, Request_AFPVerify, Response_AFPVerifyCode,
  Request_AFPVerifyCode
} from 'src/app/_models';

@Component({
  selector: 'app-forget-modal',
  templateUrl: './forget-modal.component.html'
})
export class ForgetModalComponent implements OnInit {
  /** 取得驗證碼用的request */
  public request: Request_AFPVerifyCode = {
    VerifiedAction: 2,
    SelectMode: 12,
    VerifiedInfo: {
      VerifiedPhone: null,
      CheckValue: null
    }
  };
  /** 驗證碼用 */
  public verify: Request_AFPVerify = {
    UserInfo_Code: 0,
    AFPVerify: ''
  };
  /** 發送驗證碼後的倒數計時器 */
  public vcodeCount: any;
  /** 倒數秒數 */
  public vcodeSeconds = 0;


  constructor(public bsModalRef: BsModalRef, public modal: ModalService, private appService: AppService,
              private modalService: ModalService) { }

  /** 取得驗證碼 */
  setVcode() {
    this.appService.openBlock();
    this.appService.toApi('AFPAccount', '1112', this.request).subscribe((data: Response_AFPVerifyCode) => {
      this.request.VerifiedInfo.CheckValue = data.VerifiedInfo.CheckValue;
      this.request.VerifiedInfo.VerifiedCode = data.VerifiedInfo.VerifiedCode;
      this.vcodeSeconds = 59;
      this.vcodeCount = setInterval(() => {
        if (this.vcodeSeconds > 0) {
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
    this.request.SelectMode = 21;
    this.appService.toApi('Home', '1112', this.request).subscribe((data: Response_AFPVerifyCode) => {
      if (data !== null) {
        const initialState = {
          success: true,
          message: '手機驗證成功！立即重設密碼',
          showType: 3,
          VerifiedInfo: data.VerifiedInfo
        };
        this.modalService.show('message', { initialState }, this.bsModalRef);
      }
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
