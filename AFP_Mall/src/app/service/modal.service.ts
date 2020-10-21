import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap';
import { LoginModalComponent } from '../shared/modal/login-modal/login-modal.component';
import { RegisterModalComponent } from '../shared/modal/register-modal/register-modal.component';
import { ForgetModalComponent } from '../shared/modal/forget-modal/forget-modal.component';
import { VcodeModalComponent } from '../shared/modal/vcode-modal/vcode-modal.component';
import { FavoriteModalComponent } from '../shared/modal/favorite-modal/favorite-modal.component';
import { MessageModalComponent } from '../shared/modal/message-modal/message-modal.component';
import { PasswordModalComponent } from '../shared/modal/password-modal/password-modal.component';
import { ConfirmModalComponent } from '../shared/modal/confirm-modal/confirm-modal.component';
import { CouponModalComponent } from '../shared/modal/coupon-modal/coupon-modal.component';
import { JustkaModalComponent } from '../shared/modal/justka-modal/justka-modal.component';
import { MissionModalComponent } from '../shared/modal/mission-modal/mission-modal.component';
import { ReceiptModalComponent } from '../shared/modal/receipt-modal/receipt-modal.component';
import { MsgShareModalComponent } from '../shared/modal/msg-share-modal/msg-share-modal.component';
import { AppleModalComponent } from '../shared/modal/apple-modal/apple-modal.component';
import { LoginRegisterModalComponent } from '../shared/modal/login-register-modal/login-register-modal.component';
import { VerifyMobileModalComponent } from '../shared/modal/verify-mobile-modal/verify-mobile-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public justkaUrl = new Subject();
  constructor(public bsModalService: BsModalService, public bsModalRef: BsModalRef) { }

  public openModal(show: string, bsModalRef: BsModalRef = null) {
    if (bsModalRef != null) { bsModalRef.hide(); }
    const config: ModalOptions = { class: 'modal-full' };
    switch (show) {
      case 'login':
        this.bsModalService.show(LoginModalComponent, config);
        break;
      case 'register':
        this.bsModalService.show(RegisterModalComponent, config);
        break;
      case 'forget':
        this.bsModalService.show(ForgetModalComponent, config);
        break;
      case 'vcode':
        this.bsModalService.show(VcodeModalComponent, config);
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
      case 'mission':
        this.bsModalService.show(MissionModalComponent, config);
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
      case 'login':
        this.bsModalService.show(LoginModalComponent, options);
        break;
      case 'register':
        this.bsModalService.show(RegisterModalComponent, options);
        break;
      case 'forget':
        this.bsModalService.show(ForgetModalComponent, options);
        break;
      case 'vcode':
        this.bsModalService.show(VcodeModalComponent, options);
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
      case 'mission':
        this.bsModalService.show(MissionModalComponent, options);
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
