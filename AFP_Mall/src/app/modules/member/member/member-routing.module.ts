import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CellVerificationComponent } from './cell-verification/cell-verification.component';
import { HomeComponent } from './home/home.component';
import { MemberComponent } from './member.component';
import { MyAddressComponent } from './my-address/my-address.component';
import { MyPaymentComponent } from './my-payment/my-payment.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  {
    path: '', component: MemberComponent, children: [
      { path: '', component: HomeComponent, data: {animation: 'MemberHome'}  },
      { path: 'Setting', component: SettingComponent, data: {animation: 'Setting'} },
      { path: 'MyProfile', component: MyProfileComponent, data: {animation: 'MyProfile'} },
      { path: 'CellVerification', component: CellVerificationComponent, data: {animation: 'CellVerification'} },
      { path: 'MyAddress', component: MyAddressComponent, data: {animation: 'MyAddress'} },
      { path: 'MyPayment', component: MyPaymentComponent, data: {animation: 'MyPayment'} }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
