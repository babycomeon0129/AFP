import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Error404Component } from './modules/error404/error404.component';



const routes: Routes = [
  // MOB-4103 避免登入因驗證轉跳或快取，導至null網址，故統一導到Login頁判斷，若未登入則跳出alert "請重新登入"
  { path: '', loadChildren: () => import('./modules/entrance/entrance.module').then(m => m.EntranceModule), data: {animation: 'Home'}},
  { path: 'null', loadChildren: () => import('./modules/oauth/oauth.module').then(m => m.OauthModule), data: {animation: 'Login'}},
  { path: 'Login', loadChildren: () => import('./modules/oauth/oauth.module').then(m => m.OauthModule), data: {animation: 'Login'}},
  { path: 'Explore', loadChildren: () => import('./modules/explore/explore.module').then(m => m.ExploreModule)},
  { path: 'Shopping', loadChildren: () => import('./modules/shopping/shopping.module').then(m => m.ShoppingModule)},
  { path: 'Order', loadChildren: () => import('./modules/order/order.module').then(m => m.OrderModule)},
  { path: 'Return', loadChildren: () => import('./modules/return/return.module').then(m => m.ReturnModule)},
  { path: 'Voucher', loadChildren: () => import('./modules/voucher/voucher.module').then(m => m.VoucherModule)},
  { path: 'GameCenter', loadChildren: () => import('./modules/game-center/game-center.module').then(m => m.GameCenterModule)},
  { path: 'Notification', loadChildren: () => import('./modules/notification/notification.module').then(m => m.NotificationModule)},
  { path: 'Info', loadChildren: () => import('./modules/info/info.module').then(m => m.InfoModule)},
  { path: 'Mission', loadChildren: () => import('./modules/mission/mission.module').then(m => m.MissionModule)},
  { path: 'Travel', loadChildren: () => import('./modules/travel/travel.module').then(m => m.TravelModule)},
  { path: 'Member', loadChildren: () => import('./modules/member/member/member.module').then(m => m.MemberModule)},
  { path: 'MemberFunction', loadChildren: () => import('./modules/member/member-function/member-function.module').then(m => m.MemberFunctionModule)},
  { path: 'Delivery', loadChildren: () => import('./modules/delivery/delivery.module').then(m => m.DeliveryModule)},
  { path: 'ForApp', loadChildren: () => import('./modules/for-app/for-app.module').then(m => m.ForAppModule)},
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
