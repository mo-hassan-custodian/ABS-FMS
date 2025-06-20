import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { authGuardGuard } from 'src/app/auth-guard.guard';


const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'finance',
    pathMatch: 'full'
  },
  {
    path: 'finance',
    component: LayoutComponent,
    children: [
      {
        path: 'generate-receipt',
        loadChildren: () => import('../../../module/genarate-receipt/genarate-receipt.module').then(m => m.GenarateReceiptModule)
      },
      {
        path: 'post-receipt',
        loadChildren: () => import('../../payable-receivable/receivable-posting/receivable-posting.module').then(m => m.ReceivablePostingModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(LAYOUT_ROUTES)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
