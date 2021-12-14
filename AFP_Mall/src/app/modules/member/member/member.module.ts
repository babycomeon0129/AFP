import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { SharedModule } from 'src/app/shared/shared.module';
import { MemberService } from '../member.service';
import { CellVerificationComponent } from './cell-verification/cell-verification.component';
import { HomeComponent } from './home/home.component';
import { MemberRoutingModule } from './member-routing.module';
import { MemberComponent } from './member.component';
import { MyAddressComponent } from './my-address/my-address.component';
import { MyPaymentComponent } from './my-payment/my-payment.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { SettingComponent } from './setting/setting.component';





@NgModule({
  declarations: [
    MemberComponent,
    HomeComponent,
    SettingComponent,
    MyProfileComponent,
    CellVerificationComponent,
    MyAddressComponent,
    MyPaymentComponent
  ],
  exports: [
    HomeComponent,
    SettingComponent,
    MyProfileComponent,
    CellVerificationComponent,
    MyAddressComponent,
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
