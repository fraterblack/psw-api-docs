import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../../angular-material.module';
import { SharedModule } from '../../shared/shared.module';
import { RepPDataRoutingModule } from './rep-p-data-routing.module';
import { RepPDataComponent } from './rep-p-data.component';

@NgModule({
  imports: [
    SharedModule,

    RepPDataRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  declarations: [
    RepPDataComponent,
  ],
  providers: [
  ]
})
export class RepPDataModule { }
