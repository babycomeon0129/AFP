import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { MemberRoutingModule } from './member-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MemberService } from '../member.service';

import { MemberComponent } from './member.component';
import { HomeComponent } from './home/home.component';
import { SettingComponent } from './setting/setting.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CellVerificationComponent } from './cell-verification/cell-verification.component';
import { MyAddressComponent } from './my-address/my-address.component';
import { MyPaymentComponent } from './my-payment/my-payment.component';
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
    MyPaymentComponent
  ],
  exports: [
    HomeComponent,
    SettingComponent,
    MyProfileComponent,
    CellVerificationComponent,
    MyAddressComponent,
    PasswordUpdateComponent,
    MyPaymentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MemberRoutingModule,
    FormsModule,
    LazyLoadImageModule,
    NgxUsefulSwiperModule,
    SharedModule,
    BsDatepickerModule
  ],
  providers: [
    MemberService
  ]
})
export class MemberModule {}
