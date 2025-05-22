import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';

import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { AngularMaterialModule } from '../../angular-material.module';
import { SharedModule } from '../../shared/shared.module';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';

@NgModule({
  imports: [
    SharedModule,

    ReportRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgBootstrapFormValidationModule,
    NgxMatTimepickerModule,
  ],
  declarations: [
    ReportComponent,
  ],
  providers: [
  ]
})
export class ReportModule { }
