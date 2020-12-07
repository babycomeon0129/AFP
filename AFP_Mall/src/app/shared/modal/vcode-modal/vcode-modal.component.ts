import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import {
  Request_AFPVerify, Response_AFPVerify, Request_AFPAccount, Response_AFPAccount
} from 'src/app/_models';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-vcode-modal',
  templateUrl: './vcode-modal.component.html'
})
export class VcodeModalComponent implements OnInit {
  UserInfoCode: number;
  Account: string;
  remainingSeconds = 60;
  vcodeTimer;
  Type: number;

  // 驗證用
  public verify: Request_AFPVerify = {
    UserInfo_Code: 0,
    AFPVerify: ''
  };

  // 註冊用（發送驗證碼）
  public registerData: Request_AFPAccount = {
    AFPType: 1,
    AFPAccountCTY: 886,
    AFPAccount: '',
    AFPPassword: ''
  };

  constructor(public bsModalRef: BsModalRef, private modalService: ModalService, private appService: AppService) {
    this.VCodeCountdown();
  }

  // 註冊送出
  onVfySubmit() {
    this.appService.toApi('AFPAccount', '1102', this.verify).subscribe((data: Response_AFPVerify) => {
      const initialState = {
        UserInfoCode: data.UserInfo_Code,
        verifyCode: data.NoticeLog_CheckCode
      };
      this.modalService.show('password', { initialState }, this.bsModalRef);
    });
    clearInterval(this.vcodeTimer);
  }

  // 重新發送驗證碼倒數
  VCodeCountdown() {
      // 每秒更新剩餘秒數
      this.vcodeTimer = setInterval(() => {
        // 計算秒數
        this.remainingSeconds -= 1;
        // 顯示剩餘秒數
        document.getElementById('remainingSeconds').innerHTML = this.remainingSeconds.toString() + '秒後重新傳送';
        // 剩餘0秒時結束倒數、顯示重新傳送
        if (this.remainingSeconds <= 0) {
          clearInterval(this.vcodeTimer);
          document.getElementById('remainingSeconds').innerHTML = '重新傳送';
        }
      }, 1000);
  }

  // 重新發送驗證碼
  reSendVCode() {
    this.remainingSeconds = 60;
    if (this.Type === 1101) {
      // 註冊
      this.appService.toApi('AFPAccount', '1101', this.registerData).subscribe((data: Response_AFPAccount) => {
        this.VCodeCountdown();
      });
    } else if (this.Type === 1106) {
      // 變更密碼
      this.appService.toApi('AFPAccount', '1106', this.registerData).subscribe((data: Response_AFPAccount) => {
        this.VCodeCountdown();
      });
    }
  }

  ngOnInit() {
    this.verify.UserInfo_Code = this.UserInfoCode;
    this.registerData.AFPAccount = this.Account;
  }

}
