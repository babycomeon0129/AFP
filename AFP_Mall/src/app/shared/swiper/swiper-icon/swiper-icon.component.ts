import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '@app/app.service';
import { Router } from '@angular/router';
import { AFP_Function } from '@app/_models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from './../../modal/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-swiper-icon',
  templateUrl: './swiper-icon.component.html',
  styleUrls: ['./swiper-icon.component.scss']
})
export class SwiperIconComponent implements OnInit {
  modalRef: BsModalRef;
  message: string;
  /** swiper資料來源 */
  @Input() slides: any;
  /** swiper是否顯示點點分頁(true顯示,false隱藏) */
  @Input() arrows: boolean;
  /** swiper初始選項 */
  @Input() swiperOption: string ;

  constructor(public appService: AppService, private router: Router, private modalService: BsModalService) {}

  ngOnInit(): void {
  }

  /** 開啟服務連結 */
  FunctionLink(Link: AFP_Function, editFunction: boolean): void {
    if (!editFunction) {
      if (Link.Function_IsActive === 1) {
        if (Link.Function_URLTarget === '_app') {
          this.modalRef = this.modalService.show(ConfirmModalComponent, { initialState: { message: '請問是否要開啟Mobii App?' }});
          this.modalRef.content.actions.subscribe(res => {
          // this.modal.confirm({ initialState: { message: '請問是否要開啟Mobii App?' } }).subscribe(res => {
            if (res) {
              window.location.href = Link.Function_URL;
              setTimeout(() => { this.router.navigate(['/ForApp/AppDownload']); }, 25);
            }
          });
        } else {
          if (this.appService.isApp !== null) {
            this.router.navigate([Link.Function_URL], { queryParams: { isApp: this.appService.isApp } });
          } else {
            window.open(Link.Function_URL, Link.Function_URLTarget);
          }
        }
      }
    }
  }
}
