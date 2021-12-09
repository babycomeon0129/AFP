import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
// Module
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
// Service Worker
// import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
// fireBase
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@env/environment';
import { TextMaskModule } from 'angular2-text-mask';
import { QRCodeModule } from 'angularx-qrcode';
import { BlockUIModule } from 'ng-block-ui';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { defineLocale } from 'ngx-bootstrap/chronos';
// Collapse
import { CollapseModule } from 'ngx-bootstrap/collapse';
// Member-MyProfile birthday datepicker
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { zhCnLocale } from 'ngx-bootstrap/locale';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { NgxMasonryModule } from 'ngx-masonry';
import { SortablejsModule } from 'ngx-sortablejs';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { AppRoutingModule } from './app-routing.module';
// Component
import { AppComponent } from './app.component';
// import { MessageModalComponent } from './shared/modal/message-modal/message-modal.component';
import { Error404Component } from './modules/error404/error404.component';
import { SharedModule } from './shared/shared.module';

defineLocale('zh-cn', zhCnLocale);




@NgModule({
  declarations: [
    AppComponent,
    Error404Component
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    // SocialLoginModule,
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
      CollapseModule.forRoot()
  ],
  exports: [
    AppComponent
  ],
  providers: [
    BsModalRef,
    // {
    //   provide: AuthServiceConfig,
    //   useFactory: provideConfig
    // },
    // MessageModalComponent,
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
