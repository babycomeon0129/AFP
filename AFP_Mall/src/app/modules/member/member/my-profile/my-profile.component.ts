import { OauthService } from '@app/modules/oauth/oauth.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppService } from '@app/app.service';
import { Model_ShareData, AFP_UserFavourite } from '@app/_models';
import { ModalService } from '@app/shared/modal/modal.service';
import { MemberService } from '@app/modules/member/member.service';
import { layerAnimation, layerAnimationUp } from '@app/animations';
import { Meta, Title } from '@angular/platform-browser';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from '@env/environment';
import { Response_MemberProfile, Request_MemberThird, Response_MemberThird,
  AFP_UserThird } from '@app/modules/member/member/member.component';
import { AppJSInterfaceService } from '@app/app-jsinterface.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['../member.scss', './my-profile.scss'],
  animations: [layerAnimation, layerAnimationUp]
})
export class MyProfileComponent implements OnInit {
  /** 我的檔案編輯模式 */
  public editMode = false;
  /** 證件資料容器（護照/台胞證/學生證） */
  public userCertificate: AFP_UserFavourite = new AFP_UserFavourite();
  /** 檔案（證件）資訊 */
  public file: AFP_FileSettings = new AFP_FileSettings();
  /** 證件頁面標題（護照/台胞證/學生證） */
  public CertificateName: string;
  /** 證件頁面圖示（護照/台胞證/學生證） */
  public CertificatePic: string;
  /** 是否顯示證件詳細層 1 我的檔案層 2 證件詳細層 3 證件提示層 */
  public showFileDetail = 1;
  /** 判斷是否有上傳檔案 */
  public isUpload = false;
  /** 今日日期 */
  public today: Date = new Date();
  /** 同頁滑動切換 0:本頁 1:開啟瀏覽檔案上傳  */
  public layerTrigUp = 0;

  /** 我的檔案資料 */
  public userProfile: Response_MemberProfile = new Response_MemberProfile();
  /** 第三方資訊 */
  public FBThird: boolean;
  public GoogleThird: boolean;
  public AppleThird: boolean;
  public LineThird: boolean;

  constructor(public appService: AppService, public modal: ModalService, public memberService: MemberService,
              private meta: Meta, private title: Title, private localeService: BsLocaleService,
              private callApp: AppJSInterfaceService, private cookieService: CookieService, private oauthService: OauthService) {
    this.title.setTitle('我的檔案 - Mobii!');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ content: '我的檔案 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '', property: 'og:description' });
    this.localeService.use('zh-cn');
  }

  ngOnInit() {
    if (this.oauthService.cookiesGet('idToken').c !== '' && this.oauthService.cookiesGet('idToken').c !== 'undefined') {
      this.memberService.readProfileData();
      this.readThirdData();
    }
  }

  /** 讀取社群帳號（會員首頁、社群帳號綁定皆會使用） */
  readThirdData(): void {
    const request: Request_MemberThird = {
      SelectMode: 3,
    };
    this.appService.toApi('Member', '1506', request).subscribe((data: Response_MemberThird) => {
      if (data !== null) {
        /** 類型 1: Facebook 2: Line 3: Google 4: WeChat 5: Apple */
        data.List_UserThird.forEach((value) => {
          switch (value.UserThird_Mode) {
            case 1: //  FB
              this.FBThird = true;
              break;
            case 2: //  Line
              this.LineThird = true;
              break;
            case 3: //  Google
              this.GoogleThird = true;
              break;
            case 5: // Apple
              this.AppleThird = true;
              break;
            default:
              break;
          }
        });
      }
    });
  }

  /** 性別轉換  */
  sexTSstring(sex: number): string {
    switch (sex) {
      case null:
        return null;
      case 1:
        return '男';
      case 2:
        return '女';
      case 3:
        return '不透露';
    }
  }

  /** 更新我的檔案 */
  onProfileSubmit(form: NgForm): void {
    this.appService.openBlock();
    this.memberService.userProfile.SelectMode = 3;
    if (this.memberService.userProfile.UserProfile_Birthday !== null) {
        if (this.memberService.userProfile.UserProfile_Birthday.getMonth() < new Date().getMonth()) {
          this.memberService.userProfile.UserProfile_Birthday =
            new Date(this.memberService.userProfile.UserProfile_Birthday.getTime() -
            this.memberService.userProfile.UserProfile_Birthday.getTimezoneOffset() * 60 * 1000);
        }
    }
    this.appService.toApi('Member', '1502', this.memberService.userProfile).subscribe((data: Response_MemberProfile) => {
      // 取得並顯示我的檔案資料
      this.memberService.readProfileData().then(() => {
        // 更新session 和 app.service 中的 userName 讓其他頁面名稱同步
        this.oauthService.cookiesSet({
          userName: this.memberService.userProfile.User_NickName,
          page: location.href
        });
        this.appService.userName = this.memberService.userProfile.User_NickName;
      });
      this.editMode = false;
      form.resetForm();
    });
  }



  /** 讀取證件
   * @param CertificateType 1 護照, 2 台胞證, 11 學生證 12 教職員證
   */
  readCertificate(CertificateType: number): void {
    this.userCertificate = new AFP_UserFavourite(); // 初始化
    this.isUpload = false; // 初始化
    const request: Request_MemberCertificate = {
      /** 區別操作(通用) 1:新增 2:刪除 3:編輯 4:查詢列表 5:查詢詳細 */
      SelectMode: 4,
      AFP_UserFavourite: {
        UserFavourite_ID: 0,
        UserFavourite_Number1: CertificateType,
        UserFavourite_CountryCode: 886,
        UserFavourite_Type: 1,
        UserFavourite_UserInfoCode: 0,
        UserFavourite_TypeCode: 0,
        UserFavourite_IsDefault: 0,
        UserFavourite_State: 1,
        UserFavourite_SyncState: 0,
      }
    };
    this.appService.toApi('Member', '1513', request).subscribe((data: Response_MemberCertificate) => {
      this.userCertificate = data.AFP_UserFavourite;
      this.file = data.AFP_FileSettings;

      switch (CertificateType) {
        case 1: {
          this.CertificateName = '護照';
          this.CertificatePic = '../img/member/passport.svg';
          break;
        }
        case 2: {
          this.CertificateName = '台胞證';
          this.CertificatePic = '../img/member/mtps.svg';
          break;
        }
        case 11: {
          this.CertificateName = '學生證';
          this.CertificatePic = '../img/member/passport.svg';
          break;
        }
        case 12: {
          this.CertificateName = '教職員證';
          this.CertificatePic = '../img/member/passport.svg';
          break;
        }
      }

      // 新增塞預設
      if (this.userCertificate == null) {
        this.userCertificate = new AFP_UserFavourite();
        this.userCertificate.UserFavourite_CountryCode = 886;
        this.userCertificate.UserFavourite_Number1 = CertificateType;
      }
    });
  }

  /** 更新證件 */
  onUpdateCertificate(): void {
    // 調整日期顯示問題 (UTC -> TMC)
    if (this.userCertificate.UserFavourite_Date !== null && this.userCertificate.UserFavourite_Date !== undefined) {
      if (this.userCertificate.UserFavourite_Date.getMonth() < new Date().getMonth()) {
        this.userCertificate.UserFavourite_Date =
          new Date(this.userCertificate.UserFavourite_Date.getTime() - this.userCertificate.UserFavourite_Date.getTimezoneOffset() * 60 * 1000);
      }
    }
    // 如果有上傳檔案，才向後端傳送資料
    if (this.isUpload) {
      // 護照、學生證、教職員證不須驗證有效期限，故排除
      if ((this.userCertificate.UserFavourite_TypeCode > 0 && this.userCertificate.UserFavourite_Date !== null) || this.userCertificate.UserFavourite_Number1 !== 2) {
        this.appService.openBlock();
        const request: Request_MemberCertificate = {
          SelectMode: (this.userCertificate.UserFavourite_ID > 0) ? 3 : 1,
          AFP_UserFavourite: this.userCertificate
        };
        this.appService.toApi('Member', '1513', request).subscribe((data: Response_MemberCertificate) => {
          this.memberService.readProfileData();
          this.showFileDetail = 1;
        });
      } else {
        this.modal.show('message', { initialState: { success: false, message: '請一併上傳圖檔與輸入有效期限', showType: 1 } });
      }
    } else {
      this.showFileDetail = 1;
    }
  }

  /** 檔案上傳 */
  onFileSelected(event): void {
    // 避免部分瀏覽器沒有event.target選項(如IE6-8)
    const filesEvent  = event.target ? event.target : event.srcElement;
    const fd = new FormData();
    // 圖片大小限制4MB
    if (filesEvent.files.length > 0 ) {
      if (filesEvent.files[0].size > 4194304 ) {
        this.modal.show('message', { initialState: { success: false, message: '圖片大小超過4MB，上傳失敗！', showType: 1 } });
      } else {
        fd.append('WebFile', filesEvent.files[0], filesEvent.files[0].name);
        this.appService.tofile('Files/SingleFile', fd).subscribe((data: Response_Files) => {
          this.userCertificate.UserFavourite_TypeCode = data.List_FileSettings[0].FileSettings_ID;
          this.isUpload = true;
        });
        this.showFileDetail = 2;
        this.layerTrigUp = 0;
      }
    }
  }

}

/** 會員中心-我的證件 - RequestModel */
class Request_MemberCertificate extends Model_ShareData {
  /** 我的證件 */
  AFP_UserFavourite: AFP_UserFavourite;
}

/** 會員中心-我的證件 - ResponseModel */
class Response_MemberCertificate extends Model_ShareData {
  /** 我的證件 詳細 */
  AFP_UserFavourite: AFP_UserFavourite;
  /** 檔案 */
  AFP_FileSettings: AFP_FileSettings;
}

/** 檔案上傳 ResponseModel */
class Response_Files extends Model_ShareData {
  /** 檔案列表 */
  List_FileSettings: AFP_FileSettings[];
}

/** 前台檔案資訊表 */
class AFP_FileSettings {
  FileSettings_ID: number;
  /** 檔案類型 1 圖片, 2 影片, 3檔案 */
  FileSettings_Mode: number;
  /** 檔案名稱 */
  FileSettings_Name: string;
  /** 檔案路徑 */
  FileSettings_File: string;
  /** 順序 */
  FileSettings_Sort: number;
}
