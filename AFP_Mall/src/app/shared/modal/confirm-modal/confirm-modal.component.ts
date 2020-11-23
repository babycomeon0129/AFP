import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent implements OnInit {
  title: string;
  message: string;
  showCancel = true;
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
