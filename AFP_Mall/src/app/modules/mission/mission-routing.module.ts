import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackComponent } from './feedback/feedback.component';
import { MissionComponent } from './mission.component';


const routes: Routes = [
  { path: '',  component: MissionComponent},
  { path: 'Feedback', component: FeedbackComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionRoutingModule {}
