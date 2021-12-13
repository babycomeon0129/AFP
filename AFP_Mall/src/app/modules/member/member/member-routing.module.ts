import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberComponent } from './member.component';
import { HomeComponent } from './home/home.component';
import { SettingComponent } from './setting/setting.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CellVerificationComponent } from './cell-verification/cell-verification.component';
import { MyAddressComponent } from './my-address/my-address.component';
import { PasswordUpdateComponent } from './password-update/password-update.component';
import { MyPaymentComponent } from './my-payment/my-payment.component';

const routes: Routes = [
  {
    // path: '',  canActivate: [SessionAliveGuard], component: MemberComponent, children: [
    path: '', component: MemberComponent, children: [
      { path: '', component: HomeComponent, data: {animation: 'MemberHome'}  },
      { path: 'Setting', component: SettingComponent, data: {animation: 'Setting'} },
      { path: 'MyProfile', component: MyProfileComponent, data: {animation: 'MyProfile'} },
      { path: 'CellVerification', component: CellVerificationComponent, data: {animation: 'CellVerification'} },
      { path: 'MyAddress', component: MyAddressComponent, data: {animation: 'MyAddress'} },
      { path: 'MyPayment', component: MyPaymentComponent, data: {animation: 'MyPayment'} },
      { path: 'PasswordUpdate', component: PasswordUpdateComponent, data: {animation: 'PasswordUpdate'} }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
