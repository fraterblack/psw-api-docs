import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { AngularMaterialModule } from './../angular-material.module';
import { BusyLoaderComponent } from './components/busy-loader/busy-loader.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ContentLoaderComponent } from './components/content-loader/content-loader.component';
import { FormGroupComponent } from './components/form-group/form-group.component';
import { FullDialogComponent } from './components/full-dialog/full-dialog.component';
import { InformativeDialogComponent } from './components/informative-dialog/informative-dialog.component';
import { SuccessDialogComponent } from './components/success-dialog/success-dialog.component';
import { DimensionDirective } from './directives/dimension.directive';
import { FormControlDirective } from './directives/form-control.directive';
import { InputAutoFocusDirective } from './directives/input-auto-focus.directive';
import { SimpleMaskDirective } from './directives/simple-mask.directive';
import { RoutePipe } from './pipes/route.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    NgxMatTimepickerModule,
    NgSelectModule,

    NgxMaskDirective,
    NgxMaskPipe,
  ],
  declarations: [
    FormControlDirective,
    InputAutoFocusDirective,
    SimpleMaskDirective,
    DimensionDirective,

    BusyLoaderComponent,
    ContentLoaderComponent,
    FormGroupComponent,
    FullDialogComponent,
    SuccessDialogComponent,
    ConfirmationDialogComponent,
    InformativeDialogComponent,

    RoutePipe,
  ],
  exports: [
    FormControlDirective,
    InputAutoFocusDirective,
    SimpleMaskDirective,
    DimensionDirective,

    BusyLoaderComponent,
    ContentLoaderComponent,
    FormGroupComponent,
    FullDialogComponent,
    SuccessDialogComponent,
    ConfirmationDialogComponent,
    InformativeDialogComponent,

    RoutePipe,

    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [
    RoutePipe,

    NgxMaskPipe,
  ]
})
export class SharedModule { }
