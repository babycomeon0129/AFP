import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
// import { EntranceComponent } from './views/entrance/entrance.component';
import { TravelComponent } from './views/travel/travel.component';
import { ExploreListComponent } from './views/explore-list/explore-list.component';
import { ExploreDetailComponent } from './views/explore-detail/explore-detail.component';
import { ExploreMapComponent } from './views/explore-map/explore-map.component';
import { ShoppingComponent } from './views/shopping/shopping.component';
// import { BearServicesComponent } from './views/bearservices/bearservices.component';
import { AuthUserGuard } from './shared/auth/auth-user.guard';
import { SessionAliveGuard } from './shared/auth/session-alive.guard';
import { MemberCardComponent } from './views/member-card/member-card.component';
import { MemberTicketComponent } from './views/member-ticket/member-ticket.component';
import { MemberCoinComponent } from './views/member-coin//member-coin.component';
import { MemberDiscountComponent } from './views/member-discount/member-discount.component';
import { MemberFavoriteComponent } from './views/member-favorite/member-favorite.component';
import { MemberOrderComponent } from './views/member-order/member-order.component';
import { TermsComponent } from './views/terms/terms.component';
import { PrivacyComponent } from './views/privacy/privacy.component';
import { TrafficComponent } from './views/traffic/traffic.component';
import { ProductListComponent } from './views/product-list/product-list.component';
import { ProductDetailComponent } from './views/product-detail/product-detail.component';
// import { AppLoginComponent } from './views/app-login/app-login.component';
// import { AppLoginSuccessComponent } from './views/app-login-success/app-login-success.component';
import { ShoppingCartComponent } from './views/shopping-cart/shopping-cart.component';
import { ShoppingOrderComponent } from './views/shopping-order/shopping-order.component';
import { ShoppingPaymentComponent } from './views/shopping-payment/shopping-payment.component';
// import { AppRedirectComponent } from './views/app-redirect/app-redirect.component';
import { ShoppingOffersComponent } from './views/shopping-offers/shopping-offers.component';
import { VoucherDetailComponent } from './views/voucher-detail/voucher-detail.component';
import { MyOrderDetailComponent } from './views/my-order-detail/my-order-detail.component';
import { ReturnComponent } from './views/return/return.component';
import { ReturnDetailComponent } from './views/return-detail/return-detail.component';
import { ReturnDialogComponent } from './views/return-dialog/return-dialog.component';
import { OrderCompleteComponent } from './views/order-complete/order-complete.component';
import { OffersComponent } from './views/offers/offers.component';
import { SalesComponent } from './views/sales/sales.component';
import { NotificationComponent } from './views/notification/notification.component';
// import { AppGoPaymentComponent } from './views/app-go-payment/app-go-payment.component';
// import { AppLogoutComponent } from './views/app-logout/app-logout.component';
import { MissionComponent } from './views/mission/mission.component';
import { GameCenterComponent } from './views/game-center/game-center.component';
// import { AppDownloadComponent } from './views/app-download/app-download.component';
import { QAComponent } from './views/qa/qa.component';
import { EventComponent } from './views/event/event.component';
import { GameComponent } from './views/game/game.component';
import { ETicketOrderComponent } from './views/eticket-order/eticket-order.component';
import { ETicketDetailComponent } from './views/eticket-detail/eticket-detail.component';
import { ETicketOrderDetailComponent } from './views/eticket-order-detail/eticket-order-detail.component';
import { DeliveryInfoComponent } from './views/delivery-info/delivery-info.component';
import { MemberFoodComponent } from './views/member-food/member-food.component';
import { NotificationDetailComponent } from './views/notification-detail/notification-detail.component';
// import { Error404Component } from './views/error404/error404.component';
// import { Error500Component } from './views/error500/error500.component';
// import { Error503Component } from './views/error503/error503.component';

const routes: Routes = [
  // { path: '', canActivate: [SessionAliveGuard], component: EntranceComponent, data: {animation: 'Entrance'} },
  { path: '', loadChildren: () => import('./views/entrance/entrance.module').then(m => m.EntranceModule)},
  { path: 'Function', loadChildren: () => import('./views/function/function.module').then(m => m.FunctionModule)},
  // { path: 'Travel', canActivate: [SessionAliveGuard], component: TravelComponent },
  // { path: 'ExploreMap', canActivate: [SessionAliveGuard], component: ExploreMapComponent },
  // { path: 'Shopping', canActivate: [SessionAliveGuard], component: ShoppingComponent },
  // { path: 'ExploreList/:AreaMenu_Code', canActivate: [SessionAliveGuard], component: ExploreListComponent },
  // { path: 'ExploreList', canActivate: [SessionAliveGuard], component: ExploreListComponent },
  // { path: 'ExploreDetail/:ECStore_Code', canActivate: [SessionAliveGuard], component: ExploreDetailComponent },
  // // { path: 'BearServices', component: BearServicesComponent },
  // { path: 'MemberCard', canActivate: [SessionAliveGuard], component: MemberCardComponent},
  // { path: 'MemberTicket', canActivate: [SessionAliveGuard], component: MemberTicketComponent},
  // { path: 'MemberCoin', canActivate: [SessionAliveGuard], component: MemberCoinComponent},
  // { path: 'MemberDiscount', component: MemberDiscountComponent, data: {animation: 'MemberDiscount'}},
  // { path: 'MemberFavorite', component: MemberFavoriteComponent, data: {animation: 'MemberFavorite'}},
  // { path: 'MemberOrder', component: MemberOrderComponent, data: {animation: 'MemberOrder'}},
  // { path: 'MemberFood', component: MemberFoodComponent, data: {animation: 'MemberFood'}},
  // { path: 'Terms', component: TermsComponent },
  // { path: 'Privacy', component: PrivacyComponent },
  // { path: 'Traffic', component: TrafficComponent },
  // { path: 'ProductList/:ProductDir_Code', canActivate: [SessionAliveGuard], component: ProductListComponent },
  // { path: 'ProductDetail/:ProductDir_Code/:Product_Code', canActivate: [SessionAliveGuard], component: ProductDetailComponent },
  // // { path: 'AppLogin', component: AppLoginComponent },
  // // { path: 'AppLoginSuccess', component: AppLoginSuccessComponent },
  // // { path: 'AppRedirect', component: AppRedirectComponent},
  // { path: 'ShoppingCart', canActivate: [SessionAliveGuard], component: ShoppingCartComponent },
  // { path: 'ShoppingOrder', component: ShoppingOrderComponent },
  // { path: 'ShoppingPayment', component: ShoppingPaymentComponent },
  // { path: 'ShoppingOffers', component: ShoppingOffersComponent },
  // { path: 'VoucherDetail/:Voucher_Code', canActivate: [SessionAliveGuard], component: VoucherDetailComponent },
  // { path: 'MyOrderDetail/:Order_TableNo', canActivate: [SessionAliveGuard], component: MyOrderDetailComponent },
  // { path: 'Return/:Order_TableNo', canActivate: [SessionAliveGuard], component: ReturnComponent },
  // { path: 'ReturnDetail/:Services_TableNo', component: ReturnDetailComponent },
  // { path: 'ReturnDialog/:Services_TableNo', component: ReturnDialogComponent },
  // { path: 'OrderComplete', canActivate: [SessionAliveGuard], component: OrderCompleteComponent },
  // { path: 'Offers', component: OffersComponent },
  // { path: 'Sales', component: SalesComponent },
  // { path: 'Notification', component: NotificationComponent },
  // { path: 'Notification/:IMessage_Code', component: NotificationDetailComponent },
  // // { path: 'AppGoPayment', component: AppGoPaymentComponent },
  // // { path: 'AppLogout', component: AppLogoutComponent },
  // { path: 'Mission', canActivate: [SessionAliveGuard], component: MissionComponent },
  // { path: 'Game/:Game_Code', canActivate: [SessionAliveGuard], component: GameComponent },
  // { path: 'GameCenter', canActivate: [SessionAliveGuard], component: GameCenterComponent },
  // // { path: 'AppDownload', component: AppDownloadComponent },
  // { path: 'QA', component: QAComponent },
  // { path: 'Event', component: EventComponent },
  // { path: 'ETicketOrder', component: ETicketOrderComponent},
  // { path: 'ETicketDetail/:UserTicket_Code', component: ETicketDetailComponent},
  // { path: 'ETicketOrderDetail/:Order_TableNo', component: ETicketOrderDetailComponent},
  // { path: 'DeliveryInfo/:ECStore_Code', component: DeliveryInfoComponent},
  // // { path: 'Error500', component: Error500Component},
  // // { path: 'Error503', component: Error503Component},
  // // { path: '**', component: Error404Component }
];

// const extraOptions: ExtraOptions = {
//   scrollPositionRestoration: 'enabled'
// };

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
