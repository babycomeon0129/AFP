import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { environment } from '@env/environment';
import { BsModalRef } from 'ngx-bootstrap';
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

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.appleSigninState = this.appleState();
    // Apple 登入初始化 (會將按鈕樣式改為Apple設定的)
    AppleID.auth.init({
      clientId: 'com.eyesmedia.mobii',
      scope: 'email name',
      redirectURI: environment.AppleSignInURI,
      state: this.appleSigninState,
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

  /** Apple 登入初始化需帶入的 state
  * @description unix timestamp 前後相反後前4碼+ 10碼隨機英文字母 (大小寫不同)
  * @returns state 的值
  */
  appleState(): string {
    // 取得 unix
    const dateTime = Date.now();
    const timestampStr = Math.floor(dateTime / 1000).toString();
    // 前後相反
    let reverseTimestamp = '';
    for (var i = timestampStr.length - 1; i >= 0; i--) {
      reverseTimestamp += timestampStr[i];
    }
    // 取前4碼
    const timestampFirst4 = reverseTimestamp.substring(0, 4);
    // 取得10個隨機英文字母，組成字串
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    };
    const engLettersArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    let randomEngLetter = '';
    for (let x = 0; x < 10; x++) {
      const randomInt = getRandomInt(engLettersArr.length);
      randomEngLetter += engLettersArr[randomInt];
    }
    // 組成 state
    return timestampFirst4 + randomEngLetter;
  }

  ngOnDestroy() {
    document.removeEventListener('AppleIDSignInOnSuccess', (authData: any) => { });
  }

}
