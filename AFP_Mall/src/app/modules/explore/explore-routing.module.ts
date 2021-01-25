import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SessionAliveGuard } from 'src/app/shared/guard/session-alive-guard/session-alive.guard';

import { ExploreDetailComponent } from './explore-detail/explore-detail.component';
import { ExploreListComponent } from './explore-list/explore-list.component';
import { ExploreMapComponent } from './explore-map/explore-map.component';

const routes: Routes = [
  { path: 'ExploreMap', canActivate: [SessionAliveGuard], component: ExploreMapComponent },
  { path: 'ExploreList/:AreaMenu_Code', canActivate: [SessionAliveGuard], component: ExploreListComponent },
  { path: 'ExploreList', canActivate: [SessionAliveGuard], component: ExploreListComponent },
  { path: 'ExploreDetail/:ECStore_Code', canActivate: [SessionAliveGuard], component: ExploreDetailComponent },
  { path: ':ECStore_Code', redirectTo:'ExploreDetail/:ECStore_Code' }, // 供module拆分前的舊網址結構'mobii.ai/ExploreDetail/:ECStore_Code'前往
  { path: '', redirectTo: 'ExploreMap' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule {}
