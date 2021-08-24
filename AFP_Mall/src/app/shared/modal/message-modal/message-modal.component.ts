import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AFP_ADImg, AFP_VerifiedInfo } from '@app/_models';
import { PasswordModalComponent } from '../password-modal/password-modal.component';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html'
})
export class MessageModalComponent implements OnInit {
  /** 1: 預設 2: 前往登入 3: 前往重設密碼 6: 左右按鈕內容、連結全客製化(視窗需要兩顆按鈕) 999: 核銷優惠券成功時(顯示一張廣告圖) */
  showType = 1;
  /** 成功及錯誤顯示切換 */
  success: boolean;
  /** 視窗內容 */
  message: string;
  /** 前往連結。單顆按鈕的情況下，如果需要頁面跳轉，需設置。 如設定'GoBack'，則為「返回上一頁」。 */
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
  /** 網址傳參 (連結跳轉須加上參數時使用，預設為單顆按鈕/ 雙顆按鈕左邊按鈕的傳參) */
  queryParams1: object;
  /** 網址傳參2 (連結跳轉須加上參數時使用，預設為雙顆按鈕時右邊按鈕的傳參) */
  queryParams2: object;


  constructor(public bsModalRef: BsModalRef, private bsModal: BsModalService, private router: Router, public appService: AppService, private location: Location) { }

  ngOnInit() {
  }

  /** 點擊按鈕 (視窗只有單一按鈕的情況) */
  clickSingleBtn(): void {
    switch (this.showType) {
      case 1:
        this.goToUrl(this.target, this.queryParams1);
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


  /** 前往連結並關閉視窗
   * @param url 前往連結
   * @param params 連結傳參
   */
  goToUrl(url: string, params: object): void {
    this.bsModalRef.hide();
    // 先判斷按下確定鍵後是否需要返回上一頁
    if (url === 'GoBack') {
      this.location.back();
    }  else if (url !== null && url !== undefined && url.replace(/(^s*)|(s*$)/g, '').length !== 0) {  // 判斷是否需要前往特定連結
       // 再判斷該連結是否需要傳參
      params === null ? this.router.navigate([url]) : this.router.navigate([url], {queryParams: params});
    }
  }

  /** 跳轉至忘記密碼 */
  doReset(): void {
    if (this.appService.isApp !== null) {
      this.bsModalRef.hide();
    } else {
      // 將VerifiedInfot傳到password modal那裏
      const initialState = {
        VerifiedInfo: this.VerifiedInfo
      };
      this.bsModal.show(PasswordModalComponent, { initialState });
      this.bsModalRef.hide();
      // this.modal.show('password', { initialState }, this.bsModalRef);
    }
  }


}
