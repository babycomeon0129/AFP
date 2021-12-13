import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// QRCODE
import { QRCodeModule } from 'angularx-qrcode';
// Third-Party Plugin
import { LazyLoadImageModule } from 'ng-lazyload-image';
// swiper
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
// Directive
import { DigitOnlyDirective } from './directive/digitonly-directive/digit-only.directive';
import { KeyControllerDirective } from './directive/keycontroller-directive/key-controller.directive';
// Modal
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { CouponModalComponent } from './modal/coupon-modal/coupon-modal.component';
import { FavoriteModalComponent } from './modal/favorite-modal/favorite-modal.component';
import { ForgetModalComponent } from './modal/forget-modal/forget-modal.component';
import { JustkaModalComponent } from './modal/justka-modal/justka-modal.component';
import { MessageModalComponent } from './modal/message-modal/message-modal.component';
import { MsgShareModalComponent } from './modal/msg-share-modal/msg-share-modal.component';
import { PasswordModalComponent } from './modal/password-modal/password-modal.component';
import { ReceiptModalComponent } from './modal/receipt-modal/receipt-modal.component';
import { VerifyMobileModalComponent } from './modal/verify-mobile-modal/verify-mobile-modal.component';
// Pipe
import { ConvertPipe } from './pipe/convert-pipe/convert.pipe';
import { LinkifyPipe } from './pipe/linkify-pipe/linkify.pipe';
import { NullHrefPipe } from './pipe/null-href-pipe/null-href.pipe';
import { NullTargetPipe } from './pipe/null-target-pipe/null-target.pipe';
import { SafePipe } from './pipe/safe-pipe/safe.pipe';
import { SearchFilterPipe } from './pipe/search-filter-pipe/search-filter.pipe';
import { TextFilterPipe } from './pipe/text-filter-pipe/text-filter.pipe';
import { SwiperContentComponent } from './swiper/swiper-content/swiper-content.component';
import { SwiperNavComponent } from './swiper/swiper-nav/swiper-nav.component';
import { SwiperPanesComponent } from './swiper/swiper-panes/swiper-panes.component';
import { BackBtnComponent } from './widget/back-btn/back-btn.component';
import { GoTopComponent } from './widget/go-top/go-top.component';
import { IndexHeaderComponent } from './widget/index-header/index-header.component';
import { MPointComponent } from './widget/m-point/m-point.component';
import { MobileFooterComponent } from './widget/mobile-footer/mobile-footer.component';
// Widget
import { PCFooterComponent } from './widget/pc-footer/pc-footer.component';

@NgModule({
  declarations: [
    SafePipe,
    ConvertPipe,
    TextFilterPipe,
    NullHrefPipe,
    NullTargetPipe,
    ForgetModalComponent,
    PasswordModalComponent,
    MessageModalComponent,
    FavoriteModalComponent,
    ConfirmModalComponent,
    CouponModalComponent,
    JustkaModalComponent,
    ReceiptModalComponent,
    MsgShareModalComponent,
    VerifyMobileModalComponent,
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
    GoTopComponent,
    SearchFilterPipe
  ],
  exports: [
    SafePipe,
    ConvertPipe,
    TextFilterPipe,
    LinkifyPipe,
    NullHrefPipe,
    NullTargetPipe,
    ForgetModalComponent,
    PasswordModalComponent,
    MessageModalComponent,
    FavoriteModalComponent,
    ConfirmModalComponent,
    CouponModalComponent,
    JustkaModalComponent,
    ReceiptModalComponent,
    MsgShareModalComponent,
    VerifyMobileModalComponent,
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
    GoTopComponent,
    SearchFilterPipe
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
    VerifyMobileModalComponent
  ]
})
export class SharedModule {}
