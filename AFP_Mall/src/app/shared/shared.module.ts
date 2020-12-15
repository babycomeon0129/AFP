import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Modal
import { AppleModalComponent } from './modal/apple-modal/apple-modal.component';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { CouponModalComponent } from './modal/coupon-modal/coupon-modal.component';
import { FavoriteModalComponent } from './modal/favorite-modal/favorite-modal.component';
import { ForgetModalComponent } from './modal/forget-modal/forget-modal.component';
import { JustkaModalComponent } from './modal/justka-modal/justka-modal.component';
import { LoginRegisterModalComponent } from './modal/login-register-modal/login-register-modal.component';
import { MessageModalComponent } from './modal/message-modal/message-modal.component';
import { MissionModalComponent } from './modal/mission-modal/mission-modal.component';
import { MsgShareModalComponent } from './modal/msg-share-modal/msg-share-modal.component';
import { PasswordModalComponent } from './modal/password-modal/password-modal.component';
import { ReceiptModalComponent } from './modal/receipt-modal/receipt-modal.component';
import { VcodeModalComponent } from './modal/vcode-modal/vcode-modal.component';
import { VerifyMobileModalComponent } from './modal/verify-mobile-modal/verify-mobile-modal.component';
// Pipe
import { ConvertPipe } from './pipe/convert-pipe/convert.pipe';
import { SafePipe } from './pipe/safe-pipe/safe.pipe';
import { TextFilterPipe } from './pipe/text-filter-pipe/text-filter.pipe';
// Directive
import { DigitOnlyDirective } from './directive/digitonly-directive/digit-only.directive';
import { KeyControllerDirective } from './directive/keycontroller-directive/key-controller.directive';
// Widget
import { PCFooterComponent } from './widget/pc-footer/pc-footer.component';
import { MobileFooterComponent } from './widget/mobile-footer/mobile-footer.component';
// imported Plugin
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    SafePipe,
    ConvertPipe,
    TextFilterPipe,
    ForgetModalComponent,
    VcodeModalComponent,
    PasswordModalComponent,
    MessageModalComponent,
    FavoriteModalComponent,
    ConfirmModalComponent,
    CouponModalComponent,
    JustkaModalComponent,
    MissionModalComponent,
    ReceiptModalComponent,
    MsgShareModalComponent,
    LoginRegisterModalComponent,
    VerifyMobileModalComponent,
    AppleModalComponent,
    DigitOnlyDirective,
    KeyControllerDirective,
    PCFooterComponent,
    MobileFooterComponent
  ],
  exports: [
    SafePipe,
    ConvertPipe,
    TextFilterPipe,
    ForgetModalComponent,
    VcodeModalComponent,
    PasswordModalComponent,
    MessageModalComponent,
    FavoriteModalComponent,
    ConfirmModalComponent,
    CouponModalComponent,
    JustkaModalComponent,
    MissionModalComponent,
    ReceiptModalComponent,
    MsgShareModalComponent,
    LoginRegisterModalComponent,
    VerifyMobileModalComponent,
    AppleModalComponent,
    DigitOnlyDirective,
    KeyControllerDirective,
    PCFooterComponent,
    MobileFooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LazyLoadImageModule
  ],
  entryComponents: [
    ForgetModalComponent,
    VcodeModalComponent,
    PasswordModalComponent,
    MessageModalComponent,
    FavoriteModalComponent,
    ConfirmModalComponent,
    CouponModalComponent,
    JustkaModalComponent,
    MissionModalComponent,
    ReceiptModalComponent,
    MsgShareModalComponent,
    LoginRegisterModalComponent,
    VerifyMobileModalComponent,
    AppleModalComponent,
  ]
})
export class SharedModule {}
