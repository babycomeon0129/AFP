import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ModalService } from '../modal.service';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AFP_ADImg, AFP_VerifiedInfo } from '@app/_models';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html'
})
export class MessageModalComponent implements OnInit {
  /** 1: 預設 2: 前往登入 3: 前往重設密碼 6: 左右按鈕內容、連結全客製化(視窗需要兩顆按鈕) 999: 核銷優惠券成功時(顯示一張廣告圖) */
  showType = 1;
  success: boolean;
  /** 視窗內容 */
  message: string;
  /** 前往連結。單顆按鈕的情況下，如果需要頁面跳轉，需設置 */
  target: string;
  /** 視窗的小字提醒 */
  note: string;
  /** 廣告圖 */
  adImgList: AFP_ADImg[];
  /** 重設密碼用 */
  VerifiedInfo: AFP_VerifiedInfo;
  /** 優惠券名稱 */
  voucherName: string;
  /** 確認按鈕內容 (視窗只有1顆確認按鈕時使用)，預設內容為「確定」，如需更換內容，須設置 */
  singleBtnMsg = '確定';
  /** 左邊按鈕內容 (視窗需要2顆確認按鈕時使用) */
  leftBtnMsg: string;
  /** 左邊按鈕連結 (視窗需要2顆確認按鈕時使用) */
  leftBtnUrl: string;
  /** 右邊按鈕內容 (視窗需要2顆確認按鈕時使用) */
  rightBtnMsg: string;
  /** 右邊按鈕連結 (視窗需要2顆確認按鈕時使用) */
  rightBtnUrl: string;

  constructor(public bsModalRef: BsModalRef, public modal: ModalService, private router: Router, public appService: AppService) { }

  ngOnInit() {
  }

  clickSingleBtn(): void {
    switch (this.showType) {
      case 1:
        this.goToUrl(this.target);
        break;
      case 2:
        this.appService.loginPage();
        this.bsModalRef.hide();
        break;
      case 3:
        this.doReset();
        break;
    }
  }


  /** 前往連結並關閉視窗 */
  goToUrl(url: string): void {
    this.bsModalRef.hide();
    if (url != null && url.replace(/(^s*)|(s*$)/g, '').length !== 0) {
      this.router.navigate([url]);
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
