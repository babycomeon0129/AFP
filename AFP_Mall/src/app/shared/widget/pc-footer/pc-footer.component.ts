import { Component, OnInit, HostListener } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AppService } from 'src/app/app.service';
import { ModalService } from '../../../shared/modal/modal.service';

@Component({
  selector: 'app-pc-footer',
  templateUrl: './pc-footer.component.html'
})
export class PCFooterComponent implements OnInit {

  public show = false;
  public justkaImg = 'img/index/icons/for-pc/icon_service.png';
  public justShow = false;

  constructor(public bsModalRef: BsModalRef, public appService: AppService, public modal: ModalService) { }

  ngOnInit() {
  }

  /** 滑動時對應區塊標籤 */
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (window.pageYOffset > 100) {
      this.justShow = true;
    }
  }

  toggle() {
    this.show = !this.show;
    if (this.show) {
      this.modal.show('justka',
      { initialState:
        { justkaUrl:
          'https://biz.eyesmedia.com.tw/webapp/?q=a2d422f6-b4bc-4e1d-9ca0-7b4db3258f35&a=d3f53a60-db70-11e9-8a34-2a2ae2dbcce4' }},
          this.bsModalRef);
    } else {
      this.modal.closeModal1();
      document.querySelector('body').classList.remove('modal-open');
    }
  }
}