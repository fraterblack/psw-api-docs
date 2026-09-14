import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';

import { AngularMaterialModule } from '../../angular-material.module';
import { SharedModule } from '../../shared/shared.module';
import { ImportRoutingModule } from './import-routing.module';
import { ImportComponent } from './import.component';

@NgModule({
  imports: [
    SharedModule,

    ImportRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgBootstrapFormValidationModule,
  ],
  declarations: [
    ImportComponent,
  ],
  providers: [
  ]
})
export class ImportModule { }
