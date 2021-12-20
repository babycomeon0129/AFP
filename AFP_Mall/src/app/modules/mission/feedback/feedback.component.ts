import { Component, OnInit } from '@angular/core';
import { ModalService } from '@app/shared/modal/modal.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  /** 星星列表 */
  public star = [];
  /** 滑鼠移到的星星顆數值 */
  public starHover: number;
  /** 選擇的星星數值 */
  public starSelect: number;
  /** 意見回饋 */
  public textareaLen = 0;
  /** 上傳檔案列表(僅檔案名稱) */
  public fileUploadList = [];
  /** 上傳檔案列表(實際儲存資料) */
  private fileUploadSaveList = [];

  constructor(public modal: ModalService) {
  }

  ngOnInit() {
    this.star = Array(5).fill(5, 1, 5).map((x, i) => i);
  }

  /** 星星滑鼠移過動畫及選取
   * @param starIndex 星星索引(-1未選取)
   * @param event 滑鼠事件
   */
  selectStar(starIndex: number, event: string) {
    // 滑鼠移過星星時
    this.starHover = starIndex;
    // 滑鼠完全移開星星時
    if (event === 'mouseout' && starIndex === 0) {
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
    return this.textareaLen = el.value.length;
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
        if (filesEvent.files[0].size > 4194304) {
          // 大小限制4MB
          this.modal.show('message', { initialState: { success: false, message: '圖片大小超過4MB，上傳失敗！', showType: 1 } });
        } else {
          // 當上傳檔案裡已有待上傳檔案時，需先比對是否重覆
          if (this.fileUploadSaveList.length > 0) {
            const repeatFileUpload = this.fileUploadSaveList.filter(eachObj => eachObj.name === filesEvent.files[0].name);
            if (repeatFileUpload.length === 0) {
              this.fileUploadSaveList.push(filesEvent.files[0]);
            }
          } else {
            this.fileUploadSaveList.push(filesEvent.files[0]);
          }
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
      this.fileUploadList = this.fileUploadSaveList.map(function(e) { return e.name; });
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
}
