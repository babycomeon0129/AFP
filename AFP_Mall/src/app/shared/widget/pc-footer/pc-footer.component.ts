import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppService } from '@app/app.service';
import { ModalService } from '@app/shared/modal/modal.service';

@Component({
  selector: 'app-pc-footer',
  templateUrl: './pc-footer.component.html'
})
export class PCFooterComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, public appService: AppService, public modal: ModalService) { }

  ngOnInit() {
  }
}
