import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { CouponModalComponent } from './coupon-modal/coupon-modal.component';
import { FavoriteModalComponent } from './favorite-modal/favorite-modal.component';
import { JustkaModalComponent } from './justka-modal/justka-modal.component';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { MsgShareModalComponent } from './msg-share-modal/msg-share-modal.component';
import { ReceiptModalComponent } from './receipt-modal/receipt-modal.component';
// import { PasswordModalComponent } from './password-modal/password-modal.component';
// import { ForgetModalComponent } from './forget-modal/forget-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(public bsModalService: BsModalService, public bsModalRef: BsModalRef) { }

  public show(template: string, options: ModalOptions, hideTemplate?: BsModalRef): void {
    if (hideTemplate != null) { hideTemplate.hide(); }
    switch (template) {
      // case 'forget':
      //   this.bsModalService.show(ForgetModalComponent, options);
      //   break;
      // case 'password':
      //   this.bsModalService.show(PasswordModalComponent, options);
      //   break;
      case 'message':
        this.bsModalService.show(MessageModalComponent, options);
        break;
      case 'favorite':
        this.bsModalService.show(FavoriteModalComponent, options);
        break;
      case 'justka':
        this.bsModalService.show(JustkaModalComponent, options);
        break;
      case 'receipt':
        this.bsModalService.show(ReceiptModalComponent, options);
        break;
      case 'msgShare':
        this.bsModalService.show(MsgShareModalComponent, options);
        break;
    }
  }

  public closeModal(hideTemplate: BsModalRef) {
    hideTemplate.hide();
  }

  public closeModal1() {
    for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
      this.bsModalService.hide(i);
    }
  }

  public confirm(options: ModalOptions): Observable<any> {
    const ModalRef =  this.bsModalService.show(ConfirmModalComponent, options);
    return ModalRef.content.action;
  }

  public addCoupon(options: ModalOptions): Observable<any> {
    const ModalRef =  this.bsModalService.show(CouponModalComponent, options);
    return ModalRef.content.couponResult;
  }
}
