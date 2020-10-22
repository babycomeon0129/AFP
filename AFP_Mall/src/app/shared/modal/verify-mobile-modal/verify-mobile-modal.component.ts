import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ModalService } from 'src/app/service/modal.service';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-verify-mobile-modal',
  templateUrl: './verify-mobile-modal.component.html',
  styleUrls: ['./verify-mobile-modal.component.css']
})
export class VerifyMobileModalComponent implements OnInit {
  /** 是否強制手機驗證 */
  public forceVerify = true;

  constructor(public bsModalRef: BsModalRef, public modal: ModalService, private router: Router, public appService: AppService) { }

  ngOnInit() {
  }

  closeModal(): void {
    this.bsModalRef.hide();
    // if (this.target != null && this.target.replace(/(^s*)|(s*$)/g, '').length !== 0) {
    //   this.router.navigate([this.target]);
    // }
  }

}
