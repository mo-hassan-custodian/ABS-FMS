import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CreateRequisitionsComponent } from './pages/requisitions/create-requisitions/create-requisitions.component';
import { CreatePayeeComponent } from './pages/Payee/create-payee/create-payee.component';
import { ManageRequisitionsComponent } from './pages/requisitions/manage-requisitions/manage-requisitions.component';
import { AuthorizedFileTransferComponent } from './pages/payments/authorized-file-transfer/authorized-file-transfer.component';
import { AuthorizedFileTransferViewComponent } from './pages/payments/authorized-file-transfer-view/authorized-file-transfer-view.component';
import { RequisitionViewComponent } from './pages/requisitions/requisition-view/requisition-view.component';

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
  },
  {
    path: 'authorized-file-transfer',
    component: AuthorizedFileTransferComponent
  },
  {
    path: 'authorized-file-transfer-view',
    component: AuthorizedFileTransferViewComponent
  },
  {
    path: 'manage-requisitions',
    component: ManageRequisitionsComponent
  },
  {
    path: 'requisition-view/:id',
    component: RequisitionViewComponent
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
