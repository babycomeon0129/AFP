import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./views/entrance/entrance.module').then(m => m.EntranceModule)},
  { path: 'Explore', loadChildren: () => import('./views/explore/explore.module').then(m => m.ExploreModule)},
  { path: 'Shopping', loadChildren: () => import('./views/shopping/shopping.module').then(m => m.ShoppingModule)},
  { path: 'Order', loadChildren: () => import('./views/order/order.module').then(m => m.OrderModule)},
  { path: 'Voucher', loadChildren: () => import('./views/voucher/voucher.module').then(m => m.VoucherModule)},
  { path: 'Game', loadChildren: () => import('./views/game/game.module').then(m => m.GameModule)},
  { path: 'Notification', loadChildren: () => import('./views/notification/notification.module').then(m => m.NotificationModule)},
  { path: 'Info', loadChildren: () => import('./views/info/info.module').then(m => m.InfoModule)},
  { path: 'Mission', loadChildren: () => import('./views/mission/mission.module').then(m => m.MissionModule)},
  { path: 'Travel', loadChildren: () => import('./views/travel/travel.module').then(m => m.TravelModule)},
  { path: 'Member', loadChildren: () => import('./views/member/member/member.module').then(m => m.MemeberModule)},
  { path: 'MemberFunction', loadChildren: () => import('./views/member/member-function/member-function.module').then(m => m.MemberFunctionModule)},
  { path: 'Function', loadChildren: () => import('./views/function/function.module').then(m => m.FunctionModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
