import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { ForgetModalComponent } from './forget-modal/forget-modal.component';
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { VcodeModalComponent } from './vcode-modal/vcode-modal.component';
import { PasswordModalComponent } from './password-modal/password-modal.component';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { FavoriteModalComponent } from './favorite-modal/favorite-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { CouponModalComponent } from './coupon-modal/coupon-modal.component';
import { JustkaModalComponent } from './justka-modal/justka-modal.component';
import { SharedPipeModule } from '../../pipe/shared-pipe.module';
import { MissionModalComponent } from './mission-modal/mission-modal.component';
import { ReceiptModalComponent } from './receipt-modal/receipt-modal.component';
import { MsgShareModalComponent } from './msg-share-modal/msg-share-modal.component';
import { AppleModalComponent } from './apple-modal/apple-modal.component';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
  declarations: [
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
    AppleModalComponent
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
    AppleModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPipeModule,
    AppRoutingModule
  ]
})
export class AfpModalModule { }
