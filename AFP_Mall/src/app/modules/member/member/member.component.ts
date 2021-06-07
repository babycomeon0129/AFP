import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { Model_ShareData } from '@app/_models';
import { ModalService } from '@app/shared/modal/modal.service';
import { Router, RouterOutlet } from '@angular/router';
import { slideInAnimation } from '@app/animations';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.scss'],
  animations: [slideInAnimation]
})
export class MemberComponent implements OnInit {

  constructor(public appService: AppService, public modal: ModalService, public router: Router,
              private meta: Meta, private title: Title) {
    this.title.setTitle('我的 - Mobii!');
    this.meta.updateTag({name : 'description', content: '我的Mobii! - 註冊登入Mobii 會員。Mobii! 讓你的移動總是驚喜，使用就享點數回饋，天天登入再領 M Points。'});
    this.meta.updateTag({content: '我的 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '我的Mobii! - 註冊登入Mobii 會員。Mobii! 讓你的移動總是驚喜，使用就享點數回饋，天天登入再領 M Points。', property: 'og:description'});
  }

  ngOnInit() {

  }

  /** 獲取這個 outlet 指令的值（透過 #outlet="outlet"），並根據當前活動路由的自訂資料返回一個表示動畫狀態的字串值。用此資料來控制各個路由之間該執行哪個轉場 */
  prepareRoute(outlet: RouterOutlet): void {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}

// 會員中心會共用的Model
// for MemberService & MyProfile
export class Request_MemberProfile extends Model_ShareData {
  /** 暱稱 */
  User_NickName?: string;
  /** 人員姓名 */
  UserProfile_Name?: string;
  /** 生日 */
  UserProfile_Birthday?: Date;
  /** E-Mail */
  UserProfile_Email?: string;
}

/** 會員中心我的檔案 - ResponseModel */
export class Response_MemberProfile extends Model_ShareData {
  /** 人員帳號 */
  UserAccount: string;
  /** 暱稱 */
  User_NickName: string;
  /** 人員姓名 */
  UserProfile_Name: string;
  /** 生日 */
  UserProfile_Birthday: Date;
  /** E-Mail */
  UserProfile_Email: string;
  /** 手機號碼 */
  UserProfile_Mobile: string;
  /** 是否有護照 */
  UserProfile_PassPort: boolean;
  /** 是否有台胞證 */
  UserProfile_MTPs: boolean;
  /** 是否有學生證 */
  UserProfile_StudentID: boolean;
  /** 是否有教師證 */
  UserProfile_TeacherID: boolean;
  /** 人員性別 */
  UserProfile_Sex: number;
  /** 會員點數 */
  UserPoint: number;
  /** UUID */
  UUID: string;
}

// 會員中心-社群帳號綁定 - RequestModel
export class Request_MemberThird extends Model_ShareData {
  /**  第三方登入類型 1 : Facebook 2 : Line 3 : Google 4 : WeChat */
  Mode?: number;
  /** 第三方Token */
  Token?: string;
  /** 回傳JSON */
  JsonData?: string;
}

/** 會員中心-社群帳號綁定 - ResponseModel */
export class Response_MemberThird extends Model_ShareData {
  /** 社群帳號綁定 */
  List_UserThird: AFP_UserThird[];
  /** 動作是否完成 */
  Done: boolean;
}

/** 使用者第三方登入資訊 */
export class AFP_UserThird {
  /** 類型 1: Facebook 2: Line 3: Google 4: WeChat 5: Apple */
  UserThird_Mode: number;
  /** 第三方Token */
  UserThird_Token: string;
  /** 回傳JSON */
  UserThird_JsonData: string;
}
