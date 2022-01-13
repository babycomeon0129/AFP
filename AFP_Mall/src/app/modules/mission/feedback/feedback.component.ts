import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { Model_MissionInfo } from '@app/_models';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  /** 星星列表 */
  public star = Array(5).fill(5, 1, 5).map((x, i) => i);
  /** 滑鼠移到的星星顆數值 */
  public starHover: number;
  /** 選擇的星星數值 */
  public starSelect = -1;
  /** 意見回饋長度 */
  public textareaLen = 0;
  /** 意見回饋值 */
  public textareaVal: string;
  /** 上傳檔案列表(僅檔案名稱) */
  public fileUploadList = [];
  /** 上傳檔案列表(實際儲存資料) */
  private fileUploadSaveList = [];
  /** 裝置代碼 0:Web 1:IOS 2:Android */
  private deviceType = '0';

  constructor(public modal: ModalService, private oauthService: OauthService,
              private router: Router, private appService: AppService) {
  }

  ngOnInit() {
    if (!this.appService.loginState) {
      this.appService.logoutModal();
    } else {
      if (history.state.data !== undefined) {
        // 取得Mobii版本號與裝置作業版本
        const stateData = JSON.parse(JSON.stringify(history.state.data));
        if (stateData.Mobii_version !== null) {
          sessionStorage.setItem('Mobii_version', stateData.Mobii_version);
        }
        if (stateData.Sdk_version !== null) {
          sessionStorage.setItem('Sdk_version', encodeURIComponent(stateData.Sdk_version));
          if (stateData.Sdk_version.indexOf('Aos') > -1) { this.deviceType = '2'; }
        }
        if (stateData.Mobile_device !== null) {
          sessionStorage.setItem('Mobile_device', stateData.Mobile_device);
          this.deviceType = '1';
        }
      }
    }
  }

  /** 星星滑鼠移過動畫及選取
   * @param starIndex 星星索引(-1未選取)
   * @param event 滑鼠事件
   * @param starSelect 選取星星數值
   */
  selectStar(starIndex: number, event: string) {
    // 滑鼠移過星星時
    this.starHover = starIndex;
    // 滑鼠移開星星時
    if (event === 'mouseout') {
      this.starHover = -1;
    }
    // 選取星星數值
    if (event === 'click' && starIndex > -1) {
      if (this.starSelect !== starIndex) {
        this.starSelect = starIndex;
      } else {
        // 釋放選取星星數值
        this.starSelect = -1;
        this.starHover = -1;
      }
    }
  }

  /** 文字框字數計算
   * @param event 事件目標textarea
   */
  onKeyEvent(event: any) {
    // 避免部分瀏覽器沒有event.target選項(如IE6-8)
    const el = event.target ? event.target : event.srcElement;
    this.textareaLen = el.value.length;
    this.textareaVal = el.value;
    return this.textareaLen;
  }

  /** 檔案上傳
   * @param event 事件目標
   */
  onFileUpload(event: any): void {
    // 避免部分瀏覽器沒有event.target選項(如IE6-8)
    const filesEvent = event.target ? event.target : event.srcElement;

    // 上傳檔案不為空且最多上傳三個檔案
    if (filesEvent.files.length > 0 && (filesEvent.files.length + this.fileUploadList.length <= 3) ) {

      if (filesEvent.files.length === 1) {
        // 上傳單一圖片
        // 當上傳檔案裡已有待上傳檔案時，需先比對是否重覆
        if (this.fileUploadSaveList.length > 0) {
          const repeatFileUpload = this.fileUploadSaveList.filter(eachObj => eachObj.name === filesEvent.files[0].name);
          if (repeatFileUpload.length === 0) {
            this.fileUploadSaveList.push(filesEvent.files[0]);
          }
        } else {
          this.fileUploadSaveList.push(filesEvent.files[0]);
        }
      } else {
        // 上傳多個圖片
        for (const key in filesEvent.files) {
          if (Object.prototype.hasOwnProperty.call(filesEvent.files, key)) {
            const element = filesEvent.files[key];
            // 當上傳檔案裡已有待上傳檔案時，需先比對是否重覆
            if (this.fileUploadSaveList.length > 0) {
              const repeatFileUpload = this.fileUploadSaveList.filter(eachObj => eachObj.name === element.name);
              if (repeatFileUpload.length === 0) {
                this.fileUploadSaveList.push(element);
              }
            } else {
              this.fileUploadSaveList.push(element);
            }
          }
        }
      }
      this.fileUploadList = this.fileUploadSaveList.map((e) => e.name);
    } else {
      // 最多上傳三個檔案
      this.modal.show('message', { initialState: { success: false, message: '最多只能三個圖片', showType: 1 } });
    }
  }

  /** 刪除上傳圖檔
   * @param itemIndex 選取刪除的圖檔索引
   */
  delFileUploadItem(itemIndex: number) {
    this.fileUploadList.splice(itemIndex, 1);
    this.fileUploadSaveList.splice(itemIndex, 1);
  }

  /** 意見回饋submit */
  onFeedbackSubmit(form: NgForm): void {
    /** 意見回饋request
     * @param idtoken 使用者識別
     * @param rating 星星評等
     * @param app_version ios,安卓 mobii 版本號
     * @param device 裝置型態 0:Web 1:iOS 2:Android
     * @param model_no ios 手機型號
     * @param os_version ios,安卓,web 手機作業系統版本
     * @param review 意見回饋文字框內容
     * @param photo 上傳圖檔(最多三個)
     */

    const headers = new HttpHeaders({
      Authorization:  'Bearer ' + this.oauthService.cookiesGet('idToken').cookieVal,
      xEyes_Command: '1901'
    });
    const formData = new FormData();
    formData.append('idtoken', this.oauthService.cookiesGet('idToken').cookieVal);
    formData.append('rating', JSON.stringify(this.starSelect + 1));
    formData.append('review', this.textareaVal);
    formData.append('app_version', sessionStorage.getItem('Mobii_version'));
    formData.append('device', this.deviceType);
    formData.append('os_version', decodeURIComponent(sessionStorage.getItem('Sdk_version')));
    // 無IOS版本時，不用傳送
    if (sessionStorage.getItem('Mobile_device')) {
      formData.append('model_no', sessionStorage.getItem('Mobile_device'));
    }
    for (const key in this.fileUploadSaveList) {
      if (Object.prototype.hasOwnProperty.call(this.fileUploadSaveList, key)) {
        const photoFile = this.fileUploadSaveList[key];
        formData.append('photo', photoFile);
      }
    }
    this.appService.toFormData('Feedback/CreateFeedbackAsync', headers, formData).subscribe((data: Model_MissionInfo) => {
      const reDirURL = data.List_MissionDetail[0].Mission_ReDirURL;
      if (reDirURL === null) {
        this.router.navigate(['/Mission']);
      } else if (reDirURL.indexOf('http') > -1) {
        // 外開
        window.open(reDirURL);
      } else {
        if (reDirURL.indexOf('?') === -1) {
          // 內連不帶參數
          this.router.navigate(['/Mission']);
        } else {
          // 內連帶參數
          const paramsItem = JSON.parse('{"' + decodeURI(reDirURL.split('?')[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
          this.router.navigate([reDirURL.split('?')[0]], { queryParams: paramsItem });
        }
      }
    });
  }
}
