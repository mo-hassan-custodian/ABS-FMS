import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '../../shared/material/material.module';
import { CreateRequisitionsComponent } from './pages/requisitions/create-requisitions/create-requisitions.component';
import { CreatePayeeComponent } from './pages/Payee/create-payee/create-payee.component';
import { share } from 'rxjs';
import { SharedModule } from '../../shared/modules/shared.module';
import { AuthorizedFileTransferComponent } from './pages/payments/authorized-file-transfer/authorized-file-transfer.component';
import { AuthorizedFileTransferViewComponent } from './pages/payments/authorized-file-transfer-view/authorized-file-transfer-view.component';
import { ManageRequisitionsComponent } from './pages/requisitions/manage-requisitions/manage-requisitions.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CreateRequisitionsComponent,
    CreatePayeeComponent,
    AuthorizedFileTransferComponent,
    AuthorizedFileTransferViewComponent,
    ManageRequisitionsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MaterialModule,
    SharedModule  
  ],
  exports: [
    DashboardComponent,
  
  ]
})
export class DashboardModule { }
