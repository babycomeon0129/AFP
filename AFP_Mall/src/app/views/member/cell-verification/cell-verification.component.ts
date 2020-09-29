import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Model_ShareData } from '../../../_models';
import { ModalService } from 'src/app/service/modal.service';
import { MemberService } from '../member.service';
import { Router } from '@angular/router';
import { layerAnimation } from '../../../animations';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cell-verification',
  templateUrl: './cell-verification.component.html',
  styleUrls: ['../../../../dist/style/member.min.css'],
  animations: [layerAnimation]
})
export class CellVerificationComponent implements OnInit, OnDestroy {
  /** 手機驗證 ngForm request */
  public requestMobileVerify: Request_MemberBindMobile = new Request_MemberBindMobile();
  /** 驗證碼6位數是否都有值（手機驗證） */
  public verCodeComplete = false;
  /** 重新發送驗證碼剩餘秒數 */
  public remainingSec = 60;
  /** 重新發送驗證碼倒數 */
  public vcodeTimer;
  /** 顯示區塊：0 未驗證、1 已驗證、2 輸入驗證碼 */
  public shownSection: number;
  /** 我的檔案資料 */
  // public userProfile: Response_MemberProfile = new Response_MemberProfile();

  constructor(public appService: AppService, public modal: ModalService, public memberService: MemberService,
              public router: Router, public location: Location, private meta: Meta, private title: Title) {
    this.title.setTitle('手機驗證 - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: '手機驗證 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});
  }

  ngOnInit() {
    this.readCellNumber();
  }

  /** 讀取會員手機號碼
   * （與memberService的readProfileData()相同，但為了要根據取得的資料判斷顯示畫面而獨立出來）
   */
  async readCellNumber() {
    const result = await this.memberService.readProfileData();
    if (result) {
      if (this.memberService.userProfile.UserProfile_Mobile === null) {
        this.shownSection = 0;
      } else {
        this.shownSection = 1;
      }
    }
  }

  /** 手機驗證-送出驗證碼至手機 */
  onSendMobile() {
    this.remainingSec = 60; // 開始倒數60秒
    this.requestMobileVerify.User_Code = sessionStorage.getItem('userCode'),
    this.requestMobileVerify.SelectMode = 1;
    this.requestMobileVerify.CountryCode = 886;

    this.appService.toApi('Member', '1514', this.requestMobileVerify).subscribe((data: Response_MemberBindMobile) => {
      // 若當前頁面不是在輸入驗證碼則開啟該頁
      if (this.shownSection !== 2) {
        this.shownSection = 2;
      }
      // 每秒更新剩餘秒數
      this.vcodeTimer = setInterval(() => {
        // 計算剩餘秒數
        this.remainingSec -= 1;
        // 顯示剩餘秒數
        document.getElementById('remainingSec').innerHTML = this.remainingSec.toString() + '秒後重新傳送';
        // 剩餘0秒時結束倒數、顯示重新傳送、按下可再次發送
        if (this.remainingSec <= 0) {
          clearInterval(this.vcodeTimer);
          document.getElementById('remainingSec').innerHTML = '重新傳送';
        }
      }, 1000);
    });
  }

  /** 驗證碼輸入自動focus */
  inputFocus(index: number, event) {
    if (index < 5 && event.data !== null) {
      (document.getElementsByClassName('_verCodeInput')[index + 1] as HTMLInputElement).focus();
    }
    // 檢查6個輸入是否都有值
    const inputArr = Array.from(document.getElementById('_verCodeGroup').children);
    if (inputArr.every(input => (input as HTMLInputElement).value !== '')) {
      this.verCodeComplete = true;
    } else {
      this.verCodeComplete = false;
    }
  }

  /** 手機驗證-驗證驗證碼 */
  onMobileVerify() {
    const inputArr = Array.from(document.getElementById('_verCodeGroup').children); // turn HTMLCollection to array
    const VCodeArr = [];
    let VCode = '';
    // 把6個輸入放入陣列
    for (const input of inputArr) {
      VCodeArr.push((input as HTMLInputElement).value);
    }
    // 檢查是否每個輸入都可轉換成數字或等於'0'
    if (VCodeArr.every(item => Number(item) || item === '0')) {
      // 組成字串
      for (const value of VCodeArr) {
        VCode += value;
      }
      const request: Request_MemberBindMobile = {
        User_Code: sessionStorage.getItem('userCode'),
        SelectMode: 2,
        CountryCode: 886,
        Mobile: this.requestMobileVerify.Mobile,
        CertificationCode: VCode
      };

      this.appService.toApi('Member', '1514', request).subscribe((data: Response_MemberBindMobile) => {
        this.modal.show('message', { initialState: { success: true, message: '手機認證成功!', showType: 1 } });
        this.readCellNumber();
        this.verCodeComplete = false;
        // 清除重新傳送驗證碼倒數
        clearInterval(this.vcodeTimer);
        // 清空手機
        this.requestMobileVerify.Mobile = null;
      });
    } else {
      this.modal.show('message', { initialState: { success: false, message: '驗證碼格式有誤', showType: 1 } });
    }
  }

  /** 離開輸入驗證碼頁面 */
  cancelVerify() {
    this.shownSection = 0;
    clearInterval(this.vcodeTimer);
  }

  ngOnDestroy() {
    clearInterval(this.vcodeTimer);
  }

}

export class Request_MemberBindMobile extends Model_ShareData {
  SelectMode: number;
  CountryCode: number;
  Mobile: string;
  CertificationCode: string;
}

export interface Response_MemberBindMobile extends Model_ShareData {
  Mobile: string;
}
