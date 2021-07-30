import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap';
import { ForgetModalComponent } from './forget-modal/forget-modal.component';
import { FavoriteModalComponent } from './favorite-modal/favorite-modal.component';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { PasswordModalComponent } from './password-modal/password-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { CouponModalComponent } from './coupon-modal/coupon-modal.component';
import { JustkaModalComponent } from './justka-modal/justka-modal.component';
import { ReceiptModalComponent } from './receipt-modal/receipt-modal.component';
import { MsgShareModalComponent } from './msg-share-modal/msg-share-modal.component';
import { LoginRegisterModalComponent } from './login-register-modal/login-register-modal.component';
import { VerifyMobileModalComponent } from './verify-mobile-modal/verify-mobile-modal.component';
import { AppleModalComponent } from './apple-modal/apple-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(public bsModalService: BsModalService, public bsModalRef: BsModalRef) { }

  public openModal(show: string, bsModalRef: BsModalRef = null) {
    if (bsModalRef != null) { bsModalRef.hide(); }
    const config: ModalOptions = { class: 'modal-full' };
    switch (show) {
      case 'forget':
        this.bsModalService.show(ForgetModalComponent, config);
        break;
      case 'password':
        this.bsModalService.show(PasswordModalComponent, config);
        break;
      case 'message':
        const Msgconfig: ModalOptions = { class: 'modal-sm modal-smbox' };
        this.bsModalService.show(MessageModalComponent, Msgconfig);
        break;
      case 'favorite':
        this.bsModalService.show(FavoriteModalComponent, config);
        break;
      case 'justka':
        this.bsModalService.show(JustkaModalComponent, config);
        break;
      case 'receipt':
        this.bsModalService.show(ReceiptModalComponent, config);
        break;
      case 'msgShare':
        this.bsModalService.show(MsgShareModalComponent, config);
        break;
      case 'loginRegister':
        this.bsModalService.show(LoginRegisterModalComponent, config);
        break;
      case 'verifyMobile':
        const ignoreBackdropClick: ModalOptions = { ignoreBackdropClick: true }; // 點擊黑幕不消失
        this.bsModalService.show(VerifyMobileModalComponent, ignoreBackdropClick);
        break;
    }
  }

  public show(template: string, options: ModalOptions, hideTemplate?: BsModalRef): void {
    if (hideTemplate != null) { hideTemplate.hide(); }
    switch (template) {
      case 'forget':
        this.bsModalService.show(ForgetModalComponent, options);
        break;
      case 'password':
        this.bsModalService.show(PasswordModalComponent, options);
        break;
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
      case 'loginRegister':
        this.bsModalService.show(LoginRegisterModalComponent, options);
        break;
      case 'verifyMobile':
        this.bsModalService.show(VerifyMobileModalComponent, options);
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

  public showMsg(options?: ModalOptions): void {
    this.bsModalService.show(MessageModalComponent, options);
  }

  public addCoupon(options: ModalOptions): Observable<any> {
    const ModalRef =  this.bsModalService.show(CouponModalComponent, options);
    return ModalRef.content.couponResult;
  }

  public appleLogin(options: ModalOptions): Observable<any> {
    const ModalRef =  this.bsModalService.show(AppleModalComponent, options);
    return ModalRef.content.appleUser;
  }

}
