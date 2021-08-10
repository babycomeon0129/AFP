import { environment } from '@env/environment';
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
import { SharedModule } from './shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { TextMaskModule } from 'angular2-text-mask';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { Error404Component } from './modules/error404/error404.component';
import { Error500Component } from './modules/error500/error500.component';
import { Error503Component } from './modules/error503/error503.component';

// Service Worker
// import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
// fireBase
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';


// 第三方登入 config
export function provideConfig() {
  const config = new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.GoogleApiKey),
      lazyLoad: true
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider(environment.FBApiKey),
      lazyLoad: true
    }
  ]);

  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    Error404Component,
    Error500Component,
    Error503Component
  ],
  imports: [
    BrowserModule,
    SharedModule,
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
    SortablejsModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.swActivate })
    AngularFireDatabaseModule,
      AngularFireAuthModule,
      AngularFireMessagingModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
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
  // constructor(swUpdate: SwUpdate) {
  //   if (swUpdate.isEnabled) {
  //     console.log('服務工作者被允許運作。');
  //     swUpdate.available.subscribe((event) => {
  //       console.log(`服務工作者偵測到有可供使用的新版本。目前版本：${event.current}，可供使用的新版本：${event.available}，頁面將自動重整。`);
  //       window.location.reload();
  //     });
  //   }
  // }
}
