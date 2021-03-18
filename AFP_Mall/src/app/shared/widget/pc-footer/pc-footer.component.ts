import { Component, OnInit, HostListener } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AppService } from 'src/app/app.service';
import { ModalService } from '../../../shared/modal/modal.service';

@Component({
  selector: 'app-pc-footer',
  templateUrl: './pc-footer.component.html'
})
export class PCFooterComponent implements OnInit {

  /** 判斷 modal 顯示與否 */
  public show = false;
  /** 關閉 justKa 對話框 */
  public closeMsg = false;
  /** 滑動觸發 justKa icon */
  // public justShow = false;

  constructor(public bsModalRef: BsModalRef, public appService: AppService, public modal: ModalService) { }

  ngOnInit() {
  }

  /** 滑動時對應區塊標籤 */
  // @HostListener('window:scroll', ['$event'])
  // onScroll(event: Event) {
  //   if (window.pageYOffset > 100) {
  //     this.justShow = true;
  //   }
  // }

  /** modal 顯示與否 */
  toggle() {
    this.show = !this.show;
    if (this.show) {
      this.modal.show('justka',
      { initialState:
        { justkaUrl:
          'https://biz.justka.ai/webapp/home?q=a2d422f6-b4bc-4e1d-9ca0-7b4db3258f35&a=d3f53a60-db70-11e9-8a34-2a2ae2dbcce4' }},
          this.bsModalRef);
    } else {
      this.modal.closeModal1();
      document.querySelector('body').classList.remove('modal-open');
    }
  }
}
