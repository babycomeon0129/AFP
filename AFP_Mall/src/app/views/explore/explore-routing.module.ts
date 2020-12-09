import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SessionAliveGuard } from 'src/app/shared/auth/session-alive.guard';

import { ExploreDetailComponent } from './explore-detail/explore-detail.component';
import { ExploreListComponent } from './explore-list/explore-list.component';
import { ExploreMapComponent } from './explore-map/explore-map.component';

const routes: Routes = [
  { path: 'ExploreMap', canActivate: [SessionAliveGuard], component: ExploreMapComponent },
  { path: 'ExploreList/:AreaMenu_Code', canActivate: [SessionAliveGuard], component: ExploreListComponent },
  { path: 'ExploreList', canActivate: [SessionAliveGuard], component: ExploreListComponent },
  { path: 'ExploreDetail/:ECStore_Code', canActivate: [SessionAliveGuard], component: ExploreDetailComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule {}
