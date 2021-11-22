import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent implements OnInit {
  /** 標題 */
  title: string;
  /** 訊息 */
  message: string;
  /** 是否顯示取消 */
  showCancel = true;
  /** 確定按鈕文字內容 */
  checkBtnTxt = '確定';
  @Output() action = new EventEmitter();
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  btnOk(): void {
    this.action.emit(true);
    this.bsModalRef.hide();
  }

  closeModal(): void {
    this.action.emit(false);
    this.bsModalRef.hide();
  }
}
