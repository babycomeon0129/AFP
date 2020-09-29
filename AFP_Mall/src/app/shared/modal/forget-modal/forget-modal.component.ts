import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ModalService } from 'src/app/service/modal.service';
import { AppService } from 'src/app/app.service';
import { Model_ShareData } from 'src/app/_models';

@Component({
  selector: 'app-forget-modal',
  templateUrl: './forget-modal.component.html'
})
export class ForgetModalComponent implements OnInit {
  public state: boolean;
  public request: Request_AFPChangePwd = new Request_AFPChangePwd();

  constructor(public bsModalRef: BsModalRef, public modal: ModalService, private appService: AppService) {}

  // 註冊送出
  onSubmit() {
    this.appService.openBlock();
    this.appService.toApi('AFPAccount', '1106', this.request).subscribe((data: Response_AFPChangePwd) => {
      this.state = true;
      const initialState = {
        UserInfoCode: data.UserInfo_Code,
        Account: this.request.AFPAccount,
        Type: 1106
      };
      this.modal.show('vcode', { initialState }, this.bsModalRef);
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
