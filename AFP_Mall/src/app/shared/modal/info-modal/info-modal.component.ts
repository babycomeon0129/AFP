import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit {
  /** 視窗標題 */
  title: string;
  /** 視窗內容 */
  message: string;
  constructor(public bsModalRef: BsModalRef, private modal: ModalService) { }

  ngOnInit(): void {
  }

}
