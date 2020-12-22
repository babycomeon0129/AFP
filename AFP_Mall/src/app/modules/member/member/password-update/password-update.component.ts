import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Model_ShareData } from '@app/_models';
import { NgForm } from '@angular/forms';
import { ModalService } from '../../../../shared/modal/modal.service';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['../../../../../styles/member.min.css']
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

  constructor(public appService: AppService, public modal: ModalService, private location: Location,
              private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('變更密碼 - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: '變更密碼 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});
  }

  ngOnInit() {
  }

  /** 變更密碼
   * @param form 表單
   */
  onUpdatePwd(form: NgForm): void {
    this.requestUpdatePwd.SelectMode = 3;
    this.requestUpdatePwd.User_Code = sessionStorage.getItem('userCode');
    this.appService.toApi('Member', '1505', this.requestUpdatePwd).subscribe(() => {
      // 變更成功訊息
      this.modal.show('message', { initialState: { success: true, message: '密碼變更成功!', showType: 1 } });
      // 回到上一頁
      this.location.back();
      form.resetForm();
    });
  }

}

export class Request_MemberPwd extends Model_ShareData {
  OldPwd: string;
  NewPwd: string;
  /** 二次輸入密碼(前端加上驗證用) */
  NewPwd2?: string;
}
