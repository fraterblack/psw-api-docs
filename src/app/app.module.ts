import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, LOCALE_ID, NgModule, isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

import {
  CUSTOM_ERROR_MESSAGES,
  NgBootstrapFormValidationModule,
  FormGroupComponent as NgFormGroupComponent,
  FormControlDirective as ɵb,
} from 'ng-bootstrap-form-validation';

import '@angular/common/locales/global/fr';
import * as ptLocale from '@angular/common/locales/global/pt';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgSelectModule } from '@ng-select/ng-select';
import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { AngularMaterialModule } from './angular-material.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ContainersModule } from './containers/containers.module';
import { GlobalErrorHandler } from './core/error-handlers/global-error.handler';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { FormGroupComponent } from './shared/components/form-group/form-group.component';
import { FormControlDirective } from './shared/directives/form-control.directive';
import { SharedModule } from './shared/shared.module';
import { CUSTOM_ERRORS } from './translate/validation-error-messages';
import { ErrorComponent } from './views/error/error.component';
import { NotFoundComponent } from './views/error/not-found.component';
import { AuthenticationViewComponent } from './views/shared/authentication-view/authentication-view.component';

const locale = ptLocale;

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

const maskConfig: Partial<IConfig> = {
  showMaskTyped: true,
  clearIfNotMatch: true,
};

@NgModule({
  imports: [
    ContainersModule,
    SharedModule,

    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgBootstrapFormValidationModule,
    NgSelectModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  declarations: [
    AppComponent,
    AuthenticationViewComponent,

    NotFoundComponent,
    ErrorComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: ɵb,
      useClass: FormControlDirective
    },
    {
      provide: NgFormGroupComponent,
      useClass: FormGroupComponent
    },
    {
      provide: CUSTOM_ERROR_MESSAGES,
      useValue: CUSTOM_ERRORS,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: LOCALE_ID,
      useValue: 'pt',
    },
    provideEnvironmentNgxMask(maskConfig),
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
