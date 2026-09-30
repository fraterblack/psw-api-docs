import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';

import { AngularMaterialModule } from '../../angular-material.module';
import { SharedModule } from '../../shared/shared.module';
import { DataRoutingModule } from './data-routing.module';
import { DataComponent } from './data.component';

@NgModule({
  imports: [
    SharedModule,

    DataRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgBootstrapFormValidationModule,
  ],
  declarations: [
    DataComponent,
  ],
  providers: [
  ]
})
export class DataModule { }
