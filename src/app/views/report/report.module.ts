import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';

import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { AngularMaterialModule } from '../../angular-material.module';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeFiltersComponent } from './employee-filters/employee-filters.component';
import { HourExtractConditionComponent } from './hour-extract-condition/hour-extract-condition.component';
import { OccurrenceConditionBuilderComponent } from './occurrence-condition-builder/occurrence-condition-builder.component';
import { OccurrenceConditionComponent } from './occurrence-condition/occurrence-condition.component';
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
    EmployeeFiltersComponent,
    HourExtractConditionComponent,
    OccurrenceConditionBuilderComponent,
    OccurrenceConditionComponent,
  ],
  providers: [
  ]
})
export class ReportModule { }
