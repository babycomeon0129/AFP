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
  /** 上傳檔案列表 */
  public fileUploadList = [];

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

    if (filesEvent.files.length > 0 && (filesEvent.files.length + this.fileUploadList.length <= 3) ) {

      if (filesEvent.files.length === 1) {
        // 上傳單一圖片，大小限制4MB
        if (filesEvent.files[0].size > 4194304) {
          this.modal.show('message', { initialState: { success: false, message: '圖片大小超過4MB，上傳失敗！', showType: 1 } });
        } else {
          this.fileUploadList.push(filesEvent.files[0].name);
        }
      } else {
        // 上傳多個圖片this.fileUploadList.push(element);
        for (const key in filesEvent.files) {
          if (Object.prototype.hasOwnProperty.call(filesEvent.files, key)) {
            const element = filesEvent.files[key];
            this.fileUploadList.push(element.name);
          }
        }
      }

      // const tempList = Array.from(new Set(this.fileUploadList));
      // this.fileUploadList = tempList;
      console.log(this.fileUploadList);
    } else {
      // 最多上傳三個檔案
      this.modal.show('message', { initialState: { success: false, message: '最多只能三個圖片', showType: 1 } });
    }
  }

  delFileUploadItem(itemIndex: number) {
    this.fileUploadList.splice(itemIndex, 1);
  }
}
