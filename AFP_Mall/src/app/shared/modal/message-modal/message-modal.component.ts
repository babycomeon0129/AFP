import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ModalService } from 'src/app/service/modal.service';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AFP_ADImg, AFP_VerifiedInfo } from '../../../_models';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html'
})
export class MessageModalComponent implements OnInit {
  /** 1: 預設 2: 前往登入 3: 前往重設密碼 4: 提示前往社群綁定 5: 手機驗證成功前往首頁 999: 核銷優惠券成功時(顯示一張廣告圖) */
  showType = 1;
  success: boolean;
  message: string;
  target: string;
  note: string;
  adImgList: AFP_ADImg[];
  /** 重設密碼用 */
  VerifiedInfo: AFP_VerifiedInfo;

  constructor(public bsModalRef: BsModalRef, public modal: ModalService, private router: Router, public appService: AppService) { }

  ngOnInit() {
  }

  /** App關閉  */
  AppClose(): void {
    if (this.appService.isApp != null) {
      this.bsModalRef.hide();
    } else {
      this.modal.openModal('login', this.bsModalRef);
    }
  }

  /** 關閉視窗 */
  closeModal(): void {
    this.bsModalRef.hide();
    if (this.target != null && this.target.replace(/(^s*)|(s*$)/g, '').length !== 0) {
      this.router.navigate([this.target]);
    }
  }

  /** 跳轉至忘記密碼 */
  doReset(): void {
    if (this.appService.isApp != null) {
      this.bsModalRef.hide();
    } else {
      // 將VerifiedInfot傳到password modal那裏
      const initialState = {
        VerifiedInfo: this.VerifiedInfo
      };
      this.modal.show('password', { initialState }, this.bsModalRef);
    }
  }
}
