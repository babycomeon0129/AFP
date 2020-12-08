import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { TravelComponent } from './views/travel/travel.component';
import { AuthUserGuard } from './shared/auth/auth-user.guard';
import { SessionAliveGuard } from './shared/auth/session-alive.guard';
import { MemberCardComponent } from './views/member-card/member-card.component';
import { MemberTicketComponent } from './views/member-ticket/member-ticket.component';
import { MemberCoinComponent } from './views/member-coin//member-coin.component';
import { MemberDiscountComponent } from './views/member-discount/member-discount.component';
import { MemberFavoriteComponent } from './views/member-favorite/member-favorite.component';
import { MemberOrderComponent } from './views/member-order/member-order.component';
import { MyOrderDetailComponent } from './views/my-order-detail/my-order-detail.component';
import { GameComponent } from './views/game/game.component';
import { ETicketDetailComponent } from './views/eticket-detail/eticket-detail.component';
import { ETicketOrderDetailComponent } from './views/eticket-order-detail/eticket-order-detail.component';
import { MemberFoodComponent } from './views/member-food/member-food.component';

const routes: Routes = [
  // { path: '', canActivate: [SessionAliveGuard], component: EntranceComponent, data: {animation: 'Entrance'} },
  { path: '', loadChildren: () => import('./views/entrance/entrance.module').then(m => m.EntranceModule)},
  { path: 'Explore', loadChildren: () => import('./views/explore/explore.module').then(m => m.ExploreModule)},
  { path: 'Shopping', loadChildren: () => import('./views/shopping/shopping.module').then(m => m.ShoppingModule)},
  { path: 'Order', loadChildren: () => import('./views/order/order.module').then(m => m.OrderModule)},
  { path: 'Voucher', loadChildren: () => import('./views/voucher/voucher.module').then(m => m.VoucherModule)},
  { path: 'Game', loadChildren: () => import('./views/game/game.module').then(m => m.GameModule)},
  { path: 'Notification', loadChildren: () => import('./views/notification/notification.module').then(m => m.NotificationModule)},
  { path: 'Info', loadChildren: () => import('./views/info/info.module').then(m => m.InfoModule)},
  { path: 'Mission', loadChildren: () => import('./views/mission/mission.module').then(m => m.MissionModule)},

  { path: 'Function', loadChildren: () => import('./views/function/function.module').then(m => m.FunctionModule)},
  // { path: 'Travel', canActivate: [SessionAliveGuard], component: TravelComponent },
  // { path: 'ExploreMap', canActivate: [SessionAliveGuard], component: ExploreMapComponent },
  // { path: 'ExploreList/:AreaMenu_Code', canActivate: [SessionAliveGuard], component: ExploreListComponent },
  // { path: 'ExploreList', canActivate: [SessionAliveGuard], component: ExploreListComponent },
  // { path: 'ExploreDetail/:ECStore_Code', canActivate: [SessionAliveGuard], component: ExploreDetailComponent },
  // { path: 'MemberCard', canActivate: [SessionAliveGuard], component: MemberCardComponent},
  // { path: 'MemberTicket', canActivate: [SessionAliveGuard], component: MemberTicketComponent},
  // { path: 'MemberCoin', canActivate: [SessionAliveGuard], component: MemberCoinComponent},
  // { path: 'MemberDiscount', component: MemberDiscountComponent, data: {animation: 'MemberDiscount'}},
  // { path: 'MemberFavorite', component: MemberFavoriteComponent, data: {animation: 'MemberFavorite'}},
  // { path: 'MemberOrder', component: MemberOrderComponent, data: {animation: 'MemberOrder'}},
  // { path: 'MemberFood', component: MemberFoodComponent, data: {animation: 'MemberFood'}},
  // { path: 'MyOrderDetail/:Order_TableNo', canActivate: [SessionAliveGuard], component: MyOrderDetailComponent },
  // { path: 'Mission', canActivate: [SessionAliveGuard], component: MissionComponent },
  // { path: 'ETicketDetail/:UserTicket_Code', component: ETicketDetailComponent},
  // { path: 'ETicketOrderDetail/:Order_TableNo', component: ETicketOrderDetailComponent},
];

// const extraOptions: ExtraOptions = {
//   scrollPositionRestoration: 'enabled'
// };

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
