import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DirectiveModuleModule } from './directive/directive-module.module';
// Modal
import { AppleModalComponent } from './modal/apple-modal/apple-modal.component';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { CouponModalComponent } from './modal/coupon-modal/coupon-modal.component';
import { FavoriteModalComponent } from './modal/favorite-modal/favorite-modal.component';
import { ForgetModalComponent } from './modal/forget-modal/forget-modal.component';
import { JustkaModalComponent } from './modal/justka-modal/justka-modal.component';
import { LoginModalComponent } from './modal/login-modal/login-modal.component';
import { LoginRegisterModalComponent } from './modal/login-register-modal/login-register-modal.component';
import { MessageModalComponent } from './modal/message-modal/message-modal.component';
import { MissionModalComponent } from './modal/mission-modal/mission-modal.component';
import { MsgShareModalComponent } from './modal/msg-share-modal/msg-share-modal.component';
import { PasswordModalComponent } from './modal/password-modal/password-modal.component';
import { ReceiptModalComponent } from './modal/receipt-modal/receipt-modal.component';
import { RegisterModalComponent } from './modal/register-modal/register-modal.component';
import { VcodeModalComponent } from './modal/vcode-modal/vcode-modal.component';
import { VerifyMobileModalComponent } from './modal/verify-mobile-modal/verify-mobile-modal.component';
// Pipe
import { ConvertPipe } from './pipe/convert.pipe';
import { SafePipe } from './pipe/safe.pipe';
import { TextFilterPipe } from './pipe/text-filter.pipe';
// Directive
import { DigitOnlyDirective } from './directive/digitonly-directive/digit-only.directive';
import { KeyControllerDirective } from './directive/keycontroller-directive/key-controller.directive';
// Routing
import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SafePipe,
    ConvertPipe,
    TextFilterPipe,
    LoginModalComponent,
    RegisterModalComponent,
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
    KeyControllerDirective
  ],
  exports: [
    SafePipe,
    ConvertPipe,
    TextFilterPipe,
    LoginModalComponent,
    RegisterModalComponent,
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
    KeyControllerDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // SharedPipeModule,
    // AppRoutingModule
  ],
  entryComponents: [
    LoginModalComponent,
    RegisterModalComponent,
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
export class ShredModule {}
