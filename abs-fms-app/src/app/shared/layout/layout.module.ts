
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { MenuIconComponent } from '../menu-icon/menu-icon.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    MenuIconComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    LayoutComponent,
    MenuIconComponent
  ]
})
export class LayoutModule { }
