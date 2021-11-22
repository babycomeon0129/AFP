import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-modal',
  templateUrl: './favorite-modal.component.html'
})
export class FavoriteModalComponent implements OnInit {
  success: boolean;
  message: string;
  target: string;

  constructor(public bsModalRef: BsModalRef, private router: Router) { }

  ngOnInit() {
  }

  closeModal(): void {
    this.bsModalRef.hide();
    if (this.target != null && this.target.replace(/(^s*)|(s*$)/g, '').length !== 0) {
      this.router.navigate([this.target]);
    }
  }

}
