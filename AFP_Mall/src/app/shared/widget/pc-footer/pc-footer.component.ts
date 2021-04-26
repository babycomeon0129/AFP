import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AppService } from 'src/app/app.service';
import { ModalService } from '../../../shared/modal/modal.service';

@Component({
  selector: 'app-pc-footer',
  templateUrl: './pc-footer.component.html'
})
export class PCFooterComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, public appService: AppService, public modal: ModalService) { }

  ngOnInit() {
  }
}
