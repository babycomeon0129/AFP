import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { BsDatepickerModule } from 'ngx-bootstrap';

import { MemberRoutingModule } from './member-routing.module';
import { ShredModule } from 'src/app/shared/shared.module';
import { MemberService } from '../member.service';
import { ForAppModule } from '../../for-app/for-app.module';

import { MemberComponent } from './member.component';
import { HomeComponent } from './home/home.component';
import { SettingComponent } from './setting/setting.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CellVerificationComponent } from './cell-verification/cell-verification.component';
import { MyAddressComponent } from './my-address/my-address.component';
import { MyPaymentComponent } from './my-payment/my-payment.component';
import { ThirdBindingComponent } from './third-binding/third-binding.component';
import { PasswordUpdateComponent } from './password-update/password-update.component';


@NgModule({
  declarations: [
    MemberComponent,
    HomeComponent,
    SettingComponent,
    MyProfileComponent,
    CellVerificationComponent,
    MyAddressComponent,
    PasswordUpdateComponent,
    MyPaymentComponent,
    ThirdBindingComponent,
  ],
  exports: [
    HomeComponent,
    SettingComponent,
    MyProfileComponent,
    CellVerificationComponent,
    MyAddressComponent,
    PasswordUpdateComponent,
    MyPaymentComponent,
    ThirdBindingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MemberRoutingModule,
    FormsModule,
    LazyLoadImageModule,
    NgxUsefulSwiperModule,
    ShredModule,
    ForAppModule,
    BsDatepickerModule
  ],
  providers: [
    MemberService
  ]
})
export class MemeberModule {}
