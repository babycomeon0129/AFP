import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SessionAliveGuard } from 'src/app/shared/auth/session-alive.guard';

import { ExploreDetailComponent } from './explore-detail/explore-detail.component';
import { ExploreListComponent } from './explore-list/explore-list.component';
import { ExploreMapComponent } from './explore-map/explore-map.component';
import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';

const routes: Routes = [
  { path: '', canActivate: [SessionAliveGuard],
    children: [
      { path: 'ExploreMap', canActivate: [SessionAliveGuard], component: ExploreMapComponent },
      { path: 'ExploreList/:AreaMenu_Code', canActivate: [SessionAliveGuard], component: ExploreListComponent },
      { path: 'ExploreList', canActivate: [SessionAliveGuard], component: ExploreListComponent },
      { path: 'ExploreDetail/:ECStore_Code', canActivate: [SessionAliveGuard], component: ExploreDetailComponent },
      { path: 'DeliveryInfo/:ECStore_Code', component: DeliveryInfoComponent}
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule {}
