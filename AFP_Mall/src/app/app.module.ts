import { environment } from './../environments/environment';
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
import { BlockUIModule } from 'ng-block-ui';
import { NgxMasonryModule } from 'ngx-masonry';
import { CookieService } from 'ngx-cookie-service';
import { ShredModule } from './shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { TextMaskModule } from 'angular2-text-mask';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularResizedEventModule } from 'angular-resize-event';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SortablejsModule } from 'ngx-sortablejs';

// Member-MyProfile birthday datepicker
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { zhCnLocale } from 'ngx-bootstrap/locale';
defineLocale('zh-cn', zhCnLocale);

// Component
import { AppComponent } from './app.component';
import { MessageModalComponent } from './shared/modal/message-modal/message-modal.component';
import { MaintenanceComponent } from './views/maintenance/maintenance.component';
import { Error404Component } from './views/error404/error404.component';
import { Error500Component } from './views/error500/error500.component';
import { Error503Component } from './views/error503/error503.component';

// Service Worker
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';

// 維護頁
// import { MaintenanceRoutingModule } from './views/maintenance/maintenance-routing.module';

// 第三方登入 config
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

@NgModule({
  declarations: [
    AppComponent,
    Error404Component,
    Error500Component,
    Error503Component,
    MaintenanceComponent,
  ],
  imports: [
    BrowserModule,
    // MaintenanceRoutingModule, // 系統維護或大更新時取消「這裡」及「此routing中」的註解，並手動更新maintenance.html中的日期及時間
    ShredModule,
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
