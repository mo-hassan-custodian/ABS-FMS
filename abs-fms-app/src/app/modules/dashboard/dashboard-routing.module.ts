import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
  // Add more dashboard child routes here as needed
  // Example:
  // {
  //   path: 'analytics',
  //   component: AnalyticsComponent
  // },
  // {
  //   path: 'reports',
  //   component: ReportsComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
