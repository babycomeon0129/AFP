import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Model_ShareData, Request_AFPVerifyCode, Response_AFPVerifyCode } from '../../../_models';
import { ModalService } from 'src/app/service/modal.service';
import { MemberService } from '../member.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  public requestMobileVerify: Request_AFPVerifyCode = {
    VerifiedAction: null,
    VerifiedInfo: {
      VerifiedPhone: null,
      CheckValue: null,
      VerifiedCode: null
    }
  };
  /** 重新發送驗證碼剩餘秒數 */
  public remainingSec = 0;
  /** 重新發送驗證碼倒數 */
  public vcodeTimer;
  /** 顯示區塊：0 進行驗證、1 已驗證 */
  public shownSection: number;
  /** 是否因強制驗證被導至此 */
  public toVerifyCell = false;

  constructor(public appService: AppService, public modal: ModalService, public memberService: MemberService, private route: ActivatedRoute,
              public router: Router, public location: Location, private meta: Meta, private title: Title) {
    this.title.setTitle('手機驗證 - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: '手機驗證 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});
  }

  ngOnInit() {
    if (this.route.snapshot.queryParams.toVerifyMobile !== undefined && this.route.snapshot.queryParams.toVerifyMobile === 'true') {
      // 第三方登入後因強制驗證被導至此
      this.toVerifyCell = true;
      this.shownSection = 0;
    } else {
      this.readCellNumber();
    }
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

  /** 送出驗證碼至手機 */
  sendVCode() {
    this.remainingSec = 60; // 開始倒數60秒
    this.requestMobileVerify.User_Code = sessionStorage.getItem('userCode'),
    this.requestMobileVerify.SelectMode = 11;
    this.requestMobileVerify.VerifiedAction = this.toVerifyCell ? 11 : 3;

    this.appService.toApi('Member', '1112', this.requestMobileVerify).subscribe((data: Response_AFPVerifyCode) => {
      this.requestMobileVerify.VerifiedInfo.CheckValue = data.VerifiedInfo.CheckValue;
      // 每秒更新剩餘秒數
      this.vcodeTimer = setInterval(() => {
        // 計算剩餘秒數
        this.remainingSec -= 1;
        // 剩餘0秒時結束倒數、顯示重新傳送、按下可再次發送
        if (this.remainingSec <= 0) {
          clearInterval(this.vcodeTimer);
        }
      }, 1000);
    });
  }

  /** 自動focus到驗證碼輸入欄位 */
  focusOnInput() {
    document.getElementById('vcode').focus();
  }

  /** 立即驗證-驗證驗證碼 */
  verifyMobile(form: NgForm) {
    this.requestMobileVerify.User_Code = sessionStorage.getItem('userCode'),
    this.requestMobileVerify.SelectMode = 21;
    this.requestMobileVerify.VerifiedAction = this.toVerifyCell ? 11 : 3;

    this.appService.toApi('Member', '1112', this.requestMobileVerify).subscribe((data: Response_AFPVerifyCode) => {
      this.router.navigate(['/']);
      const msg = `手機認證成功！歡迎您盡情享受 Mobii! 獨家優惠`;
      this.modal.show('message', { initialState: { success: true, message: msg, showType: 5 } });
      this.readCellNumber();
      // 清除重新傳送驗證碼倒數
      clearInterval(this.vcodeTimer);
      // 清空form
      form.resetForm();
    });
  }

  /** 離開輸入驗證碼頁面 */
  cancelVerify() {
    this.shownSection = 1;
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
