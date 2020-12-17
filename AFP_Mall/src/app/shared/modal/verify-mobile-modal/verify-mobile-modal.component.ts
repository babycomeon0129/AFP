import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-verify-mobile-modal',
  templateUrl: './verify-mobile-modal.component.html',
  styleUrls: ['./verify-mobile-modal.component.css']
})
export class VerifyMobileModalComponent implements OnInit {
  /** 是否強制手機驗證 */
  public forceVerify = true;

  constructor(public bsModalRef: BsModalRef, public modal: ModalService) { }

  ngOnInit() {
  }

  closeModal(): void {
    this.bsModalRef.hide();
    // if (this.target != null && this.target.replace(/(^s*)|(s*$)/g, '').length !== 0) {
    //   this.router.navigate([this.target]);
    // }
  }

}
