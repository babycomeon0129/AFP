// Module
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule, BsModalRef } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';
// import { AfpModalModule } from './shared/modal/afp-modal.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMasonryModule } from 'ngx-masonry';
import { CookieService } from 'ngx-cookie-service';
// import { SharedPipeModule } from './shared/pipe/shared-pipe.module';
import { ShredModule } from './shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { TextMaskModule } from 'angular2-text-mask';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MemberRoutingModule } from './views/member/member-routing.module';
import { AngularResizedEventModule } from 'angular-resize-event';
// 我的檔案-生日datepicker
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { zhCnLocale } from 'ngx-bootstrap/locale';
import { LazyLoadImageModule } from 'ng-lazyload-image';

// SortablejsModule
import { SortablejsModule } from 'ngx-sortablejs';

// Component
import { AppComponent } from './app.component';
// import { EntranceComponent } from './views/entrance/entrance.component';
// import { TravelComponent } from './views/travel/travel.component';
// import { ExploreMapComponent } from './views/explore-map/explore-map.component';
// import { ShoppingComponent } from './views/shopping/shopping.component';
// import { ExploreListComponent } from './views/explore-list/explore-list.component';
// import { ExploreDetailComponent } from './views/explore-detail/explore-detail.component';
import { environment } from './../environments/environment';
import { MemberComponent } from './views/member/member.component';
import { MemberCardComponent } from './views/member-card/member-card.component';
import { MemberTicketComponent } from './views/member-ticket/member-ticket.component';
import { MemberCoinComponent } from './views/member-coin/member-coin.component';
import { MemberDiscountComponent } from './views/member-discount/member-discount.component';
import { MemberFavoriteComponent } from './views/member-favorite/member-favorite.component';
import { MemberOrderComponent } from './views/member-order/member-order.component';
import { MessageModalComponent } from './shared/modal/message-modal/message-modal.component';
// import { TermsComponent } from './views/terms/terms.component';
// import { PrivacyComponent } from './views/privacy/privacy.component';
// import { TrafficComponent } from './views/traffic/traffic.component';
// import { ProductListComponent } from './views/product-list/product-list.component';
// import { ProductDetailComponent } from './views/product-detail/product-detail.component';
// import { ShoppingCartComponent } from './views/shopping-cart/shopping-cart.component';
// import { ShoppingOrderComponent } from './views/shopping-order/shopping-order.component';
// import { ShoppingOffersComponent } from './views/shopping-offers/shopping-offers.component';
// import { VoucherDetailComponent } from './views/voucher-detail/voucher-detail.component';
import { MyOrderDetailComponent } from './views/my-order-detail/my-order-detail.component';
// import { ReturnComponent } from './views/return/return.component';
// import { ReturnDetailComponent } from './views/return-detail/return-detail.component';
// import { ReturnDialogComponent } from './views/return-dialog/return-dialog.component';
// import { OrderCompleteComponent } from './views/order-complete/order-complete.component';
// import { ShoppingPaymentComponent } from './views/shopping-payment/shopping-payment.component';
// import { OffersComponent } from './views/offers/offers.component';
// import { SalesComponent } from './views/sales/sales.component';
// import { MissionComponent } from './views/mission/mission.component';
// import { GameComponent } from './views/game/game.component';
// import { LuckyspinComponent } from './views/game/luckyspin/luckyspin.component';
// import { ScratchComponent } from './views/game/scratch/scratch.component';

// import { OrderResultComponent } from './views/order-result/order-result.component';
// import { EventComponent } from './views/event/event.component';
import { HomeComponent } from './views/member/home/home.component';
import { SettingComponent } from './views/member/setting/setting.component';
import { MyProfileComponent } from './views/member/my-profile/my-profile.component';
import { CellVerificationComponent } from './views/member/cell-verification/cell-verification.component';
import { MyAddressComponent } from './views/member/my-address/my-address.component';
import { PasswordUpdateComponent } from './views/member/password-update/password-update.component';
import { MyPaymentComponent } from './views/member/my-payment/my-payment.component';
import { ThirdBindingComponent } from './views/member/third-binding/third-binding.component';
import { MaintenanceComponent } from './views/maintenance/maintenance.component';
// import { ETicketOrderComponent } from './views/eticket-order/eticket-order.component';
import { ETicketDetailComponent } from './views/eticket-detail/eticket-detail.component';
import { ETicketOrderDetailComponent } from './views/eticket-order-detail/eticket-order-detail.component';
// import { DeliveryInfoComponent } from './views/delivery-info/delivery-info.component';
import { MemberFoodComponent } from './views/member-food/member-food.component';
// import { DirectiveModuleModule } from './shared/directive/directive-module.module';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';

export function provideConfig() {
  const config = new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.GoogleApiKey)
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider(environment.FBApiKey)
    }
  ]);

  return config;
}
defineLocale('zh-cn', zhCnLocale);

@NgModule({
  declarations: [
    AppComponent,
    // TravelComponent,
    // ExploreMapComponent,
    // ShoppingComponent,
    // ExploreListComponent,
    // ExploreDetailComponent,
    MemberComponent,
    MemberCardComponent,
    MemberTicketComponent,
    MemberCoinComponent,
    MemberDiscountComponent,
    MemberFavoriteComponent,
    MemberOrderComponent,
    // ProductListComponent,
    // ProductDetailComponent,
    // ShoppingCartComponent,
    // ShoppingOrderComponent,
    // ShoppingOffersComponent,
    // VoucherDetailComponent,
    MyOrderDetailComponent,
    // ReturnComponent,
    // ReturnDetailComponent,
    // ReturnDialogComponent,
    // OrderCompleteComponent,
    // ShoppingPaymentComponent,
    // OffersComponent,
    // SalesComponent,
    // MissionComponent,
    // GameComponent,
    // LuckyspinComponent,
    // ScratchComponent,
    // GameCenterComponent,
    // OrderResultComponent,
    // EventComponent,
    HomeComponent,
    SettingComponent,
    MyProfileComponent,
    CellVerificationComponent,
    MyAddressComponent,
    PasswordUpdateComponent,
    MyPaymentComponent,
    ThirdBindingComponent,
    MaintenanceComponent,
    // ETicketOrderComponent,
    ETicketDetailComponent,
    ETicketOrderDetailComponent,
    // DeliveryInfoComponent,
    MemberFoodComponent,
  ],
  entryComponents: [
    // ExploreMapComponent
  ],
  imports: [
    BrowserModule,
    // MaintenanceRoutingModule, // 系統維護或大更新時取消註解，並手動更新maintenance.html中的日期及時間
    ShredModule,
    // MemberRoutingModule,
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule,
    NgxUsefulSwiperModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB0XQBqNsHt-g1VJEqVCrW7uG0tpMMS9sc',
      language: 'zh-TW'
    }),
    BlockUIModule.forRoot(),
    NgxMasonryModule,
    QRCodeModule,
    TextMaskModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 22,
      space: -2,
      clockwise: true,
      showUnits: false,
      showSubtitle: false,
      titleFontSize: '18',
      outerStrokeWidth: 2,
      innerStrokeWidth: 2,
      backgroundPadding : 0,
      backgroundColor: '#fdebef',
      outerStrokeGradientStopColor: '#53a9ff',
      outerStrokeColor: '#FD5F00',
      innerStrokeColor: '#fdebef',
      titleColor: '#FD5F00',
      animation: true,
      animationDuration: 300,
      showZeroOuterStroke: false
    }),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    LazyLoadImageModule,
    AngularResizedEventModule,
    SortablejsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [
    AppComponent
  ],
  providers: [
    BsModalRef,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    MessageModalComponent,
    CookieService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(swUpdate: SwUpdate) {
    if (swUpdate.isEnabled) {
      swUpdate.available.subscribe((event) => {
        window.location.reload();
      });
    }
  }
}
