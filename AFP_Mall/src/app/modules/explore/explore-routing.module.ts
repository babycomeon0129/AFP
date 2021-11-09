import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SessionAliveGuard } from 'src/app/shared/guard/session-alive-guard/session-alive.guard';

import { ExploreDetailComponent } from './explore-detail/explore-detail.component';
import { ExploreListComponent } from './explore-list/explore-list.component';
import { ExploreMapComponent } from './explore-map/explore-map.component';

const routes: Routes = [
  { path: 'ExploreMap', component: ExploreMapComponent },
  { path: 'ExploreList/:AreaMenu_Code', component: ExploreListComponent },
  { path: 'ExploreList', component: ExploreListComponent },
  { path: 'ExploreDetail/:ECStore_Code', component: ExploreDetailComponent },
  // { path: 'ExploreMap', canActivate: [SessionAliveGuard], component: ExploreMapComponent },
  // { path: 'ExploreList/:AreaMenu_Code', canActivate: [SessionAliveGuard], component: ExploreListComponent },
  // { path: 'ExploreList', canActivate: [SessionAliveGuard], component: ExploreListComponent },
  // { path: 'ExploreDetail/:ECStore_Code', canActivate: [SessionAliveGuard], component: ExploreDetailComponent },
  { path: '', redirectTo: 'ExploreMap' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule {}
