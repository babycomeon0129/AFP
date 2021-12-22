import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { ModalService } from '@app/shared/modal/modal.service';
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
        if (stateData.Mobii_version !== undefined) { sessionStorage.setItem('Mobii_version', stateData.Mobii_version); }
        if (stateData.Sdk_version !== undefined) { sessionStorage.setItem('Sdk_version', stateData.Sdk_version); }
        if (stateData.Mobile_device !== undefined) { sessionStorage.setItem('Mobile_device', stateData.Mobile_device); }
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
    this.textareaLen = event.target.value.length;
    this.textareaVal = event.target.value;
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
    const request = {
      idtoken: this.oauthService.cookiesGet('idToken').cookieVal,
      rating: this.starSelect + 1,
      app_version: sessionStorage.getItem('Mobii_version'),
      device: this.oauthService.cookiesGet('deviceType').cookieVal,
      model_no: sessionStorage.getItem('Mobile_device'),
      os_version: sessionStorage.getItem('Sdk_version'),
      review: this.textareaVal,
      photo: this.fileUploadSaveList
    };
    console.log(request);
    this.appService.toApi('Feedback', '1901', request).subscribe((data) => {
      console.log(data);
      form.resetForm();
    });
  }
}
