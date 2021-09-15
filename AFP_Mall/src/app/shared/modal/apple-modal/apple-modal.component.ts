import { AppService } from '@app/app.service';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { environment } from '@env/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MessageModalComponent } from '../message-modal/message-modal.component';
declare var AppleID: any;

@Component({
  selector: 'app-apple-modal',
  templateUrl: './apple-modal.component.html',
  styleUrls: ['./apple-modal.component.css']
})
export class AppleModalComponent implements OnInit, OnDestroy {

  /** Apple 第三方登入 User容器 */
  @Output() appleUser = new EventEmitter();
  /** Apple 登入 state */
  public appleSigninState: string;

  constructor(public bsModalRef: BsModalRef, private appService: AppService, private bsModal: BsModalService) { }

  ngOnInit() {
    this.appleSigninState = this.appService.getState();
    // Apple 登入初始化 (會將按鈕樣式改為Apple設定的)
    AppleID.auth.init({
      clientId: 'com.eyesmedia.mobii',
      scope: 'email name',
      redirectURI: environment.AppleSignInURI,
      state: this.appleSigninState,
      usePopup: true
    });

    // Apple 登入授權成功，第三方登入取得資料
    document.addEventListener('AppleIDSignInOnSuccess', (authData: CustomEvent) => {
      if (authData.detail.state === this.appleSigninState) {
        this.stopListeningApple();
        this.appleUser.emit(authData.detail);
        this.bsModalRef.hide();
      } else {
        this.bsModal.show(MessageModalComponent, { initialState: { success: false, message: 'Apple登入出現錯誤', showType: 1 } });
      }
    });

    // Apple 登入授權失敗，顯示失敗原因
    document.addEventListener('AppleIDSignInOnFailure', (error: any) => {
      this.stopListeningApple();
      this.bsModalRef.hide(); // 關閉視窗
      // 如果錯誤並非用戶直接關掉POPUP視窗，則跳錯誤訊息
      if (error.detail.error !== 'popup_closed_by_user') {
        this.bsModal.show(MessageModalComponent, { initialState: { success: false, message: 'Apple登入失敗', note: error.detail.error, showType: 1 } });
      }
    });

  }

  /** 停止聽取Apple登入的DOM event */
  stopListeningApple(): void {
    document.removeEventListener('AppleIDSignInOnSuccess', (authData: any) => { });
    document.removeEventListener('AppleIDSignInOnFailure', (error: any) => { });
  }

  ngOnDestroy() {
    this.stopListeningApple();
  }

}
