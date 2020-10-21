import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
declare var AppleID: any;

@Component({
  selector: 'app-apple-modal',
  templateUrl: './apple-modal.component.html',
  styleUrls: ['./apple-modal.component.css']
})
export class AppleModalComponent implements OnInit {

  /** Apple 第三方登入 User容器 */
  @Output() appleUser = new EventEmitter();

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    // Apple 登入初始化 (會將按鈕樣式改為Apple設定的)
    AppleID.auth.init({
      clientId: 'com.eyesmedia.mobii',
      scope: 'email name',
      redirectURI: 'https://www.mobii.ai', // TODO: 正式/測試站, 結尾無"/" + environment.sit的api url
      state: 'Mobii Apple Login',
      usePopup : true
    });

    // Apple 登入授權成功，第三方登入取得資料
    document.addEventListener('AppleIDSignInOnSuccess', (authData: any) => {
      this.appleUser.emit(authData.detail);
      this.bsModalRef.hide();
      // const idTokenModel = jwt_decode(this.appleUser.authorization.id_token);
      // const appleToken = idTokenModel.sub;
    });

  }

}
