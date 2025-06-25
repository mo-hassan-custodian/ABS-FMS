import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { CreateRequisitionsComponent } from './modules/dashboard/pages/requisitions/create-requisitions/create-requisitions.component';
import { CreatePayeeComponent } from './modules/dashboard/pages/requisitions/create-payee/create-payee.component';
import { AuthorizedFileTransferComponent } from './modules/dashboard/pages/payments/authorized-file-transfer/authorized-file-transfer.component';
import { AuthorizedFileTransferViewComponent } from './modules/dashboard/pages/payments/authorized-file-transfer-view/authorized-file-transfer-view.component';

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
        path: 'authorized-file-transfer',
        component: AuthorizedFileTransferComponent
      },
      {
        path: 'authorized-file-transfer-view',
        component: AuthorizedFileTransferViewComponent
      },
    ]
  }
  // Add more routes here as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
