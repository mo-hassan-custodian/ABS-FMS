import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CreateRequisitionsComponent } from './pages/requisitions/create-requisitions/create-requisitions.component';
import { CreatePayeeComponent } from './pages/requisitions/create-payee/create-payee.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'create-requisition',
    component: CreateRequisitionsComponent
  },
  {
    path: 'create-payee',
    component: CreatePayeeComponent
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
