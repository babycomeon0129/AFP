import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreDetailComponent } from './explore-detail/explore-detail.component';
import { ExploreListComponent } from './explore-list/explore-list.component';
import { ExploreMapComponent } from './explore-map/explore-map.component';


const routes: Routes = [
  { path: 'ExploreMap', component: ExploreMapComponent },
  { path: 'ExploreList/:AreaMenu_Code', component: ExploreListComponent },
  { path: 'ExploreList', component: ExploreListComponent },
  { path: 'ExploreDetail/:ECStore_Code', component: ExploreDetailComponent },
  { path: '', redirectTo: 'ExploreMap' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule {}
