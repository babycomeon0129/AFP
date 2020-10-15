import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ModalService } from 'src/app/service/modal.service';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AFP_ADImg } from '../../../_models';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html'
})
export class MessageModalComponent implements OnInit {
  showType = 1; // 1-預設;2-前往登入; 3-前往重設密碼 999-核銷優惠券成功時(顯示一張廣告圖)
  success: boolean;
  message: string;
  target: string;
  note: string;
  adImgList: AFP_ADImg[];
  /** 重設密碼用 */
  UserInfoCode: number;
  verifyCode: string;

  constructor(public bsModalRef: BsModalRef, public modal: ModalService, private router: Router, public appService: AppService) { }

  ngOnInit() {
  }

  //  App關閉
  AppClose(): void {
    if (this.appService.isApp != null) {
      this.bsModalRef.hide();
    } else {
      this.modal.openModal('login', this.bsModalRef);
    }
  }

  closeModal(): void {
    this.bsModalRef.hide();
    if (this.target != null && this.target.replace(/(^s*)|(s*$)/g, '').length !== 0) {
      this.router.navigate([this.target]);
    }
  }

  doReset(): void {
    if (this.appService.isApp != null) {
      this.bsModalRef.hide();
    } else {
      const initialState = {
        UserInfoCode: this.UserInfoCode,
        verifyCode: this.verifyCode
      };
      this.modal.show('password', { initialState }, this.bsModalRef);
    }
  }
}
