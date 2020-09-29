import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Model_ShareData, AFP_UserFavourite } from '../../../_models';
import { Response_MemberProfile, Request_MemberProfile } from '../member.component';
import { ModalService } from 'src/app/service/modal.service';
import { MemberService } from '../member.service';
import { layerAnimation } from '../../../animations';
import { Meta, Title } from '@angular/platform-browser';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['../../../../dist/style/member.min.css'],
  animations: [layerAnimation]
})
export class MyProfileComponent implements OnInit {
  /** 我的檔案編輯模式 */
  public editMode = false;
  /** 我的檔案 ngForm request */
  // public profileRequest: Request_MemberProfile;
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
  public today: Date = new Date();

  constructor(public appService: AppService, public modal: ModalService, public memberService: MemberService,
              private meta: Meta, private title: Title, private localeService: BsLocaleService) {
    // tslint:disable: max-line-length
    this.title.setTitle('我的檔案 - Mobii!');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ content: '我的檔案 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '', property: 'og:description' });
    this.localeService.use('zh-cn');
  }

  ngOnInit() {
    this.memberService.readProfileData();
  }

  /** 更新我的檔案 */
  onProfileSubmit(form: NgForm): void {
    this.appService.openBlock();
    this.memberService.userProfile.SelectMode = 3;
    this.memberService.userProfile.User_Code = sessionStorage.getItem('userCode');
    if (this.memberService.userProfile.UserProfile_Birthday !== null) {
      if (this.memberService.userProfile.UserProfile_Birthday.getMonth() < new Date().getMonth()) {
        this.memberService.userProfile.UserProfile_Birthday =
          new Date(this.memberService.userProfile.UserProfile_Birthday.getTime() - this.memberService.userProfile.UserProfile_Birthday.getTimezoneOffset() * 60 * 1000);
      }
    }
    this.appService.toApi('Member', '1502', this.memberService.userProfile).subscribe((data: Response_MemberProfile) => {
      // 取得並顯示我的檔案資料
      this.memberService.readProfileData();
      // 更新session中的userName讓其他頁面名稱同步
      sessionStorage.setItem('userName', this.memberService.userProfile.User_NickName);
      this.editMode = false;
      form.resetForm();
    });
  }

  /** 讀取證件
   * @param CertificateType 1 護照, 2 台胞證, 11 學生證 12 教職員證
   */
  readCertificate(CertificateType: number) {
    this.userCertificate = new AFP_UserFavourite(); // 初始化
    this.isUpload = false; // 初始化
    const request: Request_MemberCertificate = {
      SelectMode: 4,
      User_Code: sessionStorage.getItem('userCode'),
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
  onUpdateCertificate() {
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
          User_Code: sessionStorage.getItem('userCode'),
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

    const fd = new FormData();
    // 圖片大小限制2MB
    if (event.srcElement.files.length > 0) {
      if (event.srcElement.files[0].size > 2097152) {
        this.modal.show('message', { initialState: { success: false, message: '圖片大小超過2MB，上傳失敗！', showType: 1 } });
      } else {
        fd.append('WebFile', event.target.files[0], event.target.files[0].name);
        this.appService.tofile('Files/SingleFile', fd).subscribe((data: Response_Files) => {
          this.userCertificate.UserFavourite_TypeCode = data.List_FileSettings[0].FileSettings_ID;
          this.isUpload = true;
        });
        this.showFileDetail = 2;
        this.appService.backLayerUp();
      }
    }
  }


}

class Request_MemberCertificate extends Model_ShareData {
  AFP_UserFavourite: AFP_UserFavourite;
}

class Response_MemberCertificate extends Model_ShareData {
  AFP_UserFavourite: AFP_UserFavourite;
  AFP_FileSettings: AFP_FileSettings;
}

class Response_Files extends Model_ShareData {
  List_FileSettings: AFP_FileSettings[];
}

class AFP_FileSettings {
  FileSettings_ID: number;
  /** 檔案類型 1 圖片, 2 影片, 3檔案 */
  FileSettings_Mode: number;
  FileSettings_Name: string;
  /** 檔案路徑 */
  FileSettings_File: string;
  /** 順序 */
  FileSettings_Sort: number;
}
