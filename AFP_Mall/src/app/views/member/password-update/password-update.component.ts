import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Model_ShareData } from '../../../_models';
import { NgForm } from '@angular/forms';
import { ModalService } from 'src/app/service/modal.service';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['../../../../dist/style/member.min.css']
})
export class PasswordUpdateComponent implements OnInit, AfterViewInit {
  /** 變更密碼 ngForm request */
  public requestUpdatePwd: Request_MemberPwd = new Request_MemberPwd();
  /** 新密碼的兩次輸入是否相同 */
  public pwdMatch: boolean;

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
   * @param newPassword2 新密碼第二次輸入
   */
  onUpdatePwd(form: NgForm, newPassword2: HTMLInputElement): void {
    // 若新密碼兩次輸入值相等
    if (this.requestUpdatePwd.NewPwd === newPassword2.value) {
      this.requestUpdatePwd.SelectMode = 3;
      this.requestUpdatePwd.User_Code = sessionStorage.getItem('userCode');
      this.pwdMatch = true;
      this.appService.toApi('Member', '1505', this.requestUpdatePwd).subscribe(() => {
        // 變更成功訊息
        this.modal.show('message', { initialState: { success: true, message: '密碼變更成功!', showType: 1 } });
        // 回到上一頁
        this.location.back();
        form.resetForm();
        newPassword2.value = null;
      });
    } else {
      this.pwdMatch = false;
    }
  }

  ngAfterViewInit() {
    $('.toggle-password').on('click', (e) => {
      const target = $('.toggle-password').index(e.currentTarget);
      $('.toggle-password').eq(target).find('i.visibility').toggleClass('d-inline-block');
      $('.toggle-password').eq(target).find('i.visibility-off').toggleClass('d-none');
      if ($('.toggle-password').eq(target).siblings('input').attr('type') === 'password') {
        $('.toggle-password').eq(target).siblings('input').attr('type', 'text');
      } else {
        $('.toggle-password').eq(target).siblings('input').attr('type', 'password');
      }
    });
  }

}

export class Request_MemberPwd extends Model_ShareData {
  OldPwd: string;
  NewPwd: string;
}
