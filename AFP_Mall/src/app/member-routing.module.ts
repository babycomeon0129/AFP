import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberComponent } from './views/member/member.component';
import { HomeComponent } from './views/member/home/home.component';
import { SettingComponent } from './views/member/setting/setting.component';
import { MyProfileComponent } from './views/member/my-profile/my-profile.component';
import { CellVerificationComponent } from './views/member/cell-verification/cell-verification.component';
import { MyAddressComponent } from './views/member/my-address/my-address.component';
import { PasswordUpdateComponent } from './views/member/password-update/password-update.component';
import { MyPaymentComponent } from './views/member/my-payment/my-payment.component';
import { ThirdBindingComponent } from './views/member/third-binding/third-binding.component';

const routes: Routes = [
  {
    path: 'Member', component: MemberComponent, children: [
      { path: '', component: HomeComponent, data: {animation: 'MemberHome'}  },
      { path: 'Setting', component: SettingComponent, data: {animation: 'Setting'} },
      { path: 'MyProfile', component: MyProfileComponent, data: {animation: 'MyProfile'} },
      { path: 'CellVerification', component: CellVerificationComponent,
        data: {animation: 'CellVerification'} },
      { path: 'MyAddress', component: MyAddressComponent, data: {animation: 'MyAddress'} },
      { path: 'MyPayment', component: MyPaymentComponent, data: {animation: 'MyPayment'} },
      { path: 'PasswordUpdate', component: PasswordUpdateComponent, data: {animation: 'PasswordUpdate'} },
      { path: 'ThirdBinding', component: ThirdBindingComponent, data: {animation: 'ThirdBinding'} }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
