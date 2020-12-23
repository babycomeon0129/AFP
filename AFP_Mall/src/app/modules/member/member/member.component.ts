import { Component, AfterViewInit, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Model_ShareData } from '@app/_models';
import { ModalService } from '../../../shared/modal/modal.service';
import { Router, RouterOutlet } from '@angular/router';
import { slideInAnimation } from '../../../animations';
import { MemberService } from '../member.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.scss'],
  animations: [slideInAnimation]
})
export class MemberComponent implements OnInit, AfterViewInit {

  constructor(public appService: AppService, public modal: ModalService, public router: Router, public memberService: MemberService,
              private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('我的 - Mobii!');
    this.meta.updateTag({name : 'description', content: '我的Mobii! - 註冊登入Mobii 會員。Mobii! 讓你的移動總是驚喜，使用就享點數回饋，天天登入再領 M Points。'});
    this.meta.updateTag({content: '我的 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '我的Mobii! - 註冊登入Mobii 會員。Mobii! 讓你的移動總是驚喜，使用就享點數回饋，天天登入再領 M Points。', property: 'og:description'});
  }

  ngOnInit() {

  }

  /** 獲取這個 outlet 指令的值（透過 #outlet="outlet"），並根據當前活動路由的自訂資料返回一個表示動畫狀態的字串值。用此資料來控制各個路由之間該執行哪個轉場 */
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  ngAfterViewInit(): void {
    /** 避免灰屏 */
    // $('.modal-backdrop').on('click', () => {
    //   this.appService.backLayer();
    //   this.appService.backsortLayer();
    //   $('.modal-backdrop').remove();
    // });

    // footer.pc
    // tslint:disable-next-line: max-line-length
    (($('.wrap').height()) < ($(window).height())) ? ($('footer.for-pc').css('position', 'absolute')) : ($('footer.for-pc').css('position', 'relative'));

  }
}

// 會員中心會共用的Model
// for MemberService & MyProfile
export class Request_MemberProfile extends Model_ShareData {
  User_NickName?: string;
  UserProfile_Name?: string;
  UserProfile_Birthday?: Date;
  UserProfile_Email?: string;
}

export class Response_MemberProfile extends Model_ShareData {
  UserAccount: string;
  User_NickName: string;
  UserProfile_Name: string;
  UserProfile_Birthday: Date;
  UserProfile_Email: string;
  UserProfile_Mobile: string;
  UserProfile_PassPort: boolean;
  UserProfile_MTPs: boolean;
  UserProfile_StudentID: boolean;
  UserProfile_TeacherID: boolean;
  UserProfile_Sex: number;
  UserPoint: number;
}

// for Home & ThirdBinding
export class Request_MemberThird extends Model_ShareData {
  Mode?: number;
  Token?: string;
  JsonData?: string;
}

export class Response_MemberThird extends Model_ShareData {
  List_UserThird: AFP_UserThird[];
  Done: boolean;
}

// for MemberService & ThirdBinding
export class AFP_UserThird {
  UserThird_Mode: number;
  UserThird_Token: string;
  UserThird_JsonData: string;
}
