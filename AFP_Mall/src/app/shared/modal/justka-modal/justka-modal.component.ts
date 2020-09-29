import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-justka-modal',
  templateUrl: './justka-modal.component.html'
})
export class JustkaModalComponent implements OnInit {
  public justkaUrl: string;

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
  }

}
