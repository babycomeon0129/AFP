import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Router, NavigationExtras } from '@angular/router';
import { Model_MissionDetail } from '../../../_models';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-mission-modal',
  templateUrl: './mission-modal.component.html'
})
export class MissionModalComponent  {
  currentPage = this.router.url;
  missionArr: Model_MissionDetail[];

  constructor(private bsModalRef: BsModalRef, private router: Router, private appService: AppService) {}


  /** 關閉Modal */
  closeModal(): void {
    this.bsModalRef.hide();
  }

  claimNow(): void {
    if (this.currentPage === '/Mission') {
      this.closeModal();
    } else {
      this.closeModal();
      // 帶離當前頁面前先確認有關閉已打開的uplayer (e.g.遊戲頁: 若按馬上領的當下有開獎的黑幕時)
      if (this.appService.tLayerUp.length > 0) {
        this.appService.backLayerUp();
      }
      this.router.navigate(['/Mission']);
    }
  }

}
