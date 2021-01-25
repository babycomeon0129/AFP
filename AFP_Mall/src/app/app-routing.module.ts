import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { Error404Component } from './modules/error404/error404.component';
import { Error500Component } from './modules/error500/error500.component';
import { Error503Component } from './modules/error503/error503.component';

// tslint:disable: max-line-length
const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/entrance/entrance.module').then(m => m.EntranceModule), data: {animation: 'Home'}},
  { path: 'Explore', loadChildren: () => import('./modules/explore/explore.module').then(m => m.ExploreModule)},
  { path: 'ExploreDetail', loadChildren: () => import('./modules/explore/explore.module').then(m => m.ExploreModule)}, // 供module拆分前的舊網址前往
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
  { path: 'AppDownload', loadChildren: () => import('./modules/for-app/for-app.module').then(m => m.ForAppModule)}, // 供module拆分前的舊網址結構'mobii.ai/AppDownload'前往
  { path: 'Error500', component: Error500Component},
  { path: 'Error503', component: Error503Component},
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
