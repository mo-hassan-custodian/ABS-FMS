import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { CreateRequisitionsComponent } from './modules/dashboard/pages/requisitions/create-requisitions/create-requisitions.component';
import { CreatePayeeComponent } from './modules/dashboard/pages/Payee/create-payee/create-payee.component';
import { ManageRequisitionsComponent } from './modules/dashboard/pages/requisitions/manage-requisitions/manage-requisitions.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  },
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  },
  {
    path: 'App',
    component: LayoutComponent,
    children: [
      {
        path: 'create-requisition',
        component: CreateRequisitionsComponent
      },
      {
        path: 'create-payee',
        component: CreatePayeeComponent
      },
      {
        path: 'manage-requisitions',
        component: ManageRequisitionsComponent
      }
    ]
  }
  // Add more routes here as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
