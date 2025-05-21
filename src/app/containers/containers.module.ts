import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';

import { AngularMaterialModule } from './../angular-material.module';
import { SharedModule } from './../shared/shared.module';
import { DefaultContainerComponent } from './default-container/default-container.component';

@NgModule({
  declarations: [
    DefaultContainerComponent,
  ],
  imports: [
    SharedModule,

    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    NgBootstrapFormValidationModule.forRoot(),
    BrowserModule,
    RouterModule,
  ]
})
export class ContainersModule { }
