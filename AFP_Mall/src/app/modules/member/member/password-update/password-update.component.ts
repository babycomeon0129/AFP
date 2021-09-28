import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { Model_ShareData } from '@app/_models';
import { NgForm } from '@angular/forms';
import { ModalService } from '@app/shared/modal/modal.service';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['../member.scss']
})
export class PasswordUpdateComponent implements OnInit {
  /** 變更密碼 ngForm request */
  public requestUpdatePwd: Request_MemberPwd = new Request_MemberPwd();
  /** 舊密碼是否可見 */
  public oldPswVisible = false;
  /** 新密碼是否可見 */
  public newPswVisible = false;
  /** 新密碼2是否可見 */
  public newPsw2Visible = false;

  constructor(public appService: AppService, private oauthService: OauthService, public modal: ModalService, private location: Location,
              private meta: Meta, private title: Title) {
    this.title.setTitle('變更密碼 - Mobii!');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ content: '變更密碼 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '', property: 'og:description' });
  }

  ngOnInit() {
  }

  /** 變更密碼
   * @param form 表單
   */
  onUpdatePwd(form: NgForm): void {
    if (this.appService.loginState) {
      this.requestUpdatePwd.SelectMode = 3;
      this.requestUpdatePwd.User_Code = sessionStorage.getItem('userCode');
      this.appService.toApi('Member', '1505', this.requestUpdatePwd).subscribe(() => {
        // 變更成功訊息
        this.modal.show('message', { initialState: { success: true, message: '密碼變更成功!', showType: 1 } });
        // 回到上一頁
        this.location.back();
        form.resetForm();
      });
    } else {
      this.oauthService.loginPage(this.appService.currentUri);
    }
  }

}

/** 會員中心-變更密碼 - RequestModel */
class Request_MemberPwd extends Model_ShareData {
  /** 舊密碼 */
  OldPwd: string;
  /** 新密碼 */
  NewPwd: string;
  /** 二次輸入密碼(前端加上驗證用) */
  NewPwd2?: string;
}
