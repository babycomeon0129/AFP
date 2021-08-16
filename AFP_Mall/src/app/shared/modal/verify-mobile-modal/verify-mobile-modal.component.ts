import { AppService } from './../../../app.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-verify-mobile-modal',
  templateUrl: './verify-mobile-modal.component.html',
  styleUrls: ['./verify-mobile-modal.component.css']
})
export class VerifyMobileModalComponent implements OnInit {
  /** 是否強制手機驗證 */
  public forceVerify = false;

  constructor(public bsModalRef: BsModalRef, private router: Router, private appservice: AppService) { }

  ngOnInit() {
  }

  closeModal(): void {
    this.bsModalRef.hide();
    this.router.navigate(['/']);
    this.appservice.onLogout();
    // if (this.target != null && this.target.replace(/(^s*)|(s*$)/g, '').length !== 0) {
    //   this.router.navigate([this.target]);
    // }
  }

}
