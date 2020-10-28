import { Component, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ModalService } from 'src/app/service/modal.service';
import { AppService } from 'src/app/app.service';
import { Response_AFPVerifyCode, Request_AFPVerifyCode } from 'src/app/_models';

@Component({
  selector: 'app-forget-modal',
  templateUrl: './forget-modal.component.html'
})
export class ForgetModalComponent implements OnDestroy {
  /** 取得驗證碼用的request */
  public request: Request_AFPVerifyCode = {
    VerifiedAction: 2,
    SelectMode: 12,
    VerifiedInfo: {
      VerifiedPhone: null,
      CheckValue: null,
      VerifiedCode: null
    }
  };
  /** 發送驗證碼狀態 */
  public vcodeSet = false;
  /** 發送驗證碼後的倒數計時器 */
  public vcodeCount: any;
  /** 倒數秒數 */
  public vcodeSeconds = 0;


  constructor(public bsModalRef: BsModalRef, public modal: ModalService, private appService: AppService,
              private modalService: ModalService) { }

  /** 取得驗證碼 */
  setVcode(): void {
    this.appService.openBlock();
    this.appService.toApi('AFPAccount', '1112', this.request).subscribe((data: Response_AFPVerifyCode) => {
      this.request.VerifiedInfo.CheckValue = data.VerifiedInfo.CheckValue;
      this.vcodeSeconds = 59;
      this.vcodeCount = setInterval(() => {
        if (this.vcodeSeconds > 0) {
          this.vcodeSeconds--;
        } else {
          clearInterval(this.vcodeCount);
          this.vcodeSet = true;
        }
      }, 1000);
    });
  }

  /** 立即驗證  */
  onSubmit(): void {
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
        this.vcodeSet = false;
        clearInterval(this.vcodeCount);
      }
    });
  }

  closeModal(): void {
    this.bsModalRef.hide();
    clearInterval(this.vcodeCount);
  }

  stopVcodeCount(): void {
    clearInterval(this.vcodeCount);
  }

  ngOnDestroy(): void {
    clearInterval(this.vcodeCount);
  }

}
