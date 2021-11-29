import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Pipe
import { ConvertPipe } from './pipe/convert-pipe/convert.pipe';
import { SafePipe } from './pipe/safe-pipe/safe.pipe';
import { TextFilterPipe } from './pipe/text-filter-pipe/text-filter.pipe';
import { LinkifyPipe } from './pipe/linkify-pipe/linkify.pipe';
import { NullHrefPipe } from './pipe/null-href-pipe/null-href.pipe';
// Directive
import { DigitOnlyDirective } from './directive/digitonly-directive/digit-only.directive';
import { KeyControllerDirective } from './directive/keycontroller-directive/key-controller.directive';
// Modal
import { AppleModalComponent } from './modal/apple-modal/apple-modal.component';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { CouponModalComponent } from './modal/coupon-modal/coupon-modal.component';
import { FavoriteModalComponent } from './modal/favorite-modal/favorite-modal.component';
import { ForgetModalComponent } from './modal/forget-modal/forget-modal.component';
import { JustkaModalComponent } from './modal/justka-modal/justka-modal.component';
import { LoginRegisterModalComponent } from './modal/login-register-modal/login-register-modal.component';
import { MessageModalComponent } from './modal/message-modal/message-modal.component';
import { MsgShareModalComponent } from './modal/msg-share-modal/msg-share-modal.component';
import { PasswordModalComponent } from './modal/password-modal/password-modal.component';
import { ReceiptModalComponent } from './modal/receipt-modal/receipt-modal.component';
import { VerifyMobileModalComponent } from './modal/verify-mobile-modal/verify-mobile-modal.component';
// Widget
import { PCFooterComponent } from './widget/pc-footer/pc-footer.component';
import { MobileFooterComponent } from './widget/mobile-footer/mobile-footer.component';
import { BackBtnComponent } from './widget/back-btn/back-btn.component';
import { IndexHeaderComponent } from './widget/index-header/index-header.component';
// Third-Party Plugin
import { LazyLoadImageModule } from 'ng-lazyload-image';
// swiper
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { SwiperContentComponent } from './swiper/swiper-content/swiper-content.component';
import { SwiperNavComponent } from './swiper/swiper-nav/swiper-nav.component';
import { SwiperPanesComponent } from './swiper/swiper-panes/swiper-panes.component';
// QRCODE
import { QRCodeModule } from 'angularx-qrcode';
import { MPointComponent } from './widget/m-point/m-point.component';
import { GoTopComponent } from './widget/go-top/go-top.component';

@NgModule({
  declarations: [
    SafePipe,
    ConvertPipe,
    TextFilterPipe,
    NullHrefPipe,
    ForgetModalComponent,
    PasswordModalComponent,
    MessageModalComponent,
    FavoriteModalComponent,
    ConfirmModalComponent,
    CouponModalComponent,
    JustkaModalComponent,
    ReceiptModalComponent,
    MsgShareModalComponent,
    LoginRegisterModalComponent,
    VerifyMobileModalComponent,
    AppleModalComponent,
    DigitOnlyDirective,
    KeyControllerDirective,
    PCFooterComponent,
    MobileFooterComponent,
    SwiperContentComponent,
    SwiperNavComponent,
    SwiperPanesComponent,
    BackBtnComponent,
    IndexHeaderComponent,
    MPointComponent,
    LinkifyPipe,
    GoTopComponent
  ],
  exports: [
    SafePipe,
    ConvertPipe,
    TextFilterPipe,
    LinkifyPipe,
    NullHrefPipe,
    ForgetModalComponent,
    PasswordModalComponent,
    MessageModalComponent,
    FavoriteModalComponent,
    ConfirmModalComponent,
    CouponModalComponent,
    JustkaModalComponent,
    ReceiptModalComponent,
    MsgShareModalComponent,
    LoginRegisterModalComponent,
    VerifyMobileModalComponent,
    AppleModalComponent,
    DigitOnlyDirective,
    KeyControllerDirective,
    PCFooterComponent,
    MobileFooterComponent,
    BackBtnComponent,
    IndexHeaderComponent,
    SwiperContentComponent,
    SwiperNavComponent,
    SwiperPanesComponent,
    MPointComponent,
    GoTopComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LazyLoadImageModule,
    NgxUsefulSwiperModule,
    QRCodeModule
  ],
  entryComponents: [
    ForgetModalComponent,
    PasswordModalComponent,
    MessageModalComponent,
    FavoriteModalComponent,
    ConfirmModalComponent,
    CouponModalComponent,
    JustkaModalComponent,
    ReceiptModalComponent,
    MsgShareModalComponent,
    LoginRegisterModalComponent,
    VerifyMobileModalComponent,
    AppleModalComponent,
  ]
})
export class SharedModule {}
