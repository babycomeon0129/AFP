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
  /** 驗證碼用 */
  public verify: Request_AFPVerify = {
    UserInfo_Code: 0,
    AFPVerify: ''
  };
  /** 發送驗證碼按鈕狀態 */
  public vcodeBtn = false;
  /** 發送驗證碼後的倒數計時器 */
  public vcodeCount;
  /** 倒數秒數 */
  public vcodeSeconds = 0;

  constructor(public bsModalRef: BsModalRef, public modal: ModalService, private appService: AppService) { }

  /** 取得驗證碼 */
  setVcode() {
    this.appService.toApi('AFPAccount', '1106', this.request).subscribe((data: Response_AFPChangePwd) => {
      this.verify.UserInfo_Code = data.UserInfo_Code;
      this.vcodeSeconds = 60;
      this.vcodeCount = setInterval( () => {
        if ( this.vcodeSeconds > 0 ) {
          this.vcodeSeconds--;
        } else {
          clearInterval(this.vcodeCount);
        }
      }, 1000);
    });
  }

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

  /** 1102回傳
   *
   {
     AppShareUrl: null
      Cart_Count: 0
      JustKaUrl: ""
      Model_BasePage: {Model_Page: 1, Model_Item: 0, ColumnsName: null, TableName: null, WhereString: null, …}
      Model_BaseResponse: {APPVerifyCode: null, Model_TotalItem: 0, Model_TotalPage: 0, Model_CurrentPage: 0}
      NoticeLog_CheckCode: "261651"
      SelectMode: 0
      Store_Note: null
      UUID: 0
      UserInfo_Code: 100056743441382
      User_Code: null
      proto__: Object
   }
   */


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
