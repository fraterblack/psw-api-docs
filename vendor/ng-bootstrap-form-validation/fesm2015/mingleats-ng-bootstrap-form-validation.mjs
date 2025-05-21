import * as i1$1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Component, ContentChild, ContentChildren, Directive, EventEmitter, Host, HostBinding, HostListener, Inject, Injectable, InjectionToken, Input, NgModule, Optional, Output, SkipSelf } from '@angular/core';
import * as i1 from '@angular/forms';
import { FormArray, FormControl, FormControlName, FormGroup } from '@angular/forms';

var BootstrapVersion;
(function (BootstrapVersion) {
  BootstrapVersion[BootstrapVersion["Three"] = 0] = "Three";
  BootstrapVersion[BootstrapVersion["Four"] = 1] = "Four";
})(BootstrapVersion || (BootstrapVersion = {}));

const CUSTOM_ERROR_MESSAGES = new InjectionToken("ng-bootstrap-form-validation custom error messages");
const BOOTSTRAP_VERSION = new InjectionToken("ng-bootstrap-form-validation module options");

function controlPath(name, parent) {
  // tslint:disable-next-line:no-non-null-assertion
  return [...parent.path, name];
}
class FormControlDirective {
  constructor(
    // this value might be null, but we union type it as such until
    // this issue is resolved: https://github.com/angular/angular/issues/25544
    parent, bootstrapVersion) {
    this.parent = parent;
    this.bootstrapVersion = bootstrapVersion;
  }
  get validClass() {
    if (!this.control) {
      return false;
    }
    return (this.bootstrapFour &&
      this.control.valid &&
      (this.control.touched || this.control.dirty));
  }
  get invalidClass() {
    if (!this.control) {
      return false;
    }
    return (this.bootstrapFour &&
      this.control.invalid &&
      this.control.touched &&
      this.control.dirty);
  }
  get path() {
    return controlPath(this.formControlName, this.parent);
  }
  get control() {
    return this.formDirective && this.formDirective.getControl(this);
  }
  get formDirective() {
    return this.parent ? this.parent.formDirective : null;
  }
  get bootstrapFour() {
    return this.bootstrapVersion === BootstrapVersion.Four;
  }
}
FormControlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: FormControlDirective, deps: [{ token: i1.ControlContainer, host: true, optional: true, skipSelf: true }, { token: BOOTSTRAP_VERSION }], target: i0.ɵɵFactoryTarget.Directive });
FormControlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.11", type: FormControlDirective, selector: ".form-control,.form-check-input,.custom-control-input", inputs: { formControlName: "formControlName" }, host: { properties: { "class.is-valid": "this.validClass", "class.is-invalid": "this.invalidClass" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: FormControlDirective, decorators: [{
    type: Directive,
    args: [{
      // tslint:disable-next-line:directive-selector
      selector: ".form-control,.form-check-input,.custom-control-input"
    }]
  }], ctorParameters: function () {
    return [{
      type: i1.ControlContainer, decorators: [{
        type: Optional
      }, {
        type: Host
      }, {
        type: SkipSelf
      }]
    }, {
      type: BootstrapVersion, decorators: [{
        type: Inject,
        args: [BOOTSTRAP_VERSION]
      }]
    }];
  }, propDecorators: {
    formControlName: [{
      type: Input
    }], validClass: [{
      type: HostBinding,
      args: ["class.is-valid"]
    }], invalidClass: [{
      type: HostBinding,
      args: ["class.is-invalid"]
    }]
  }
});

class FormValidationDirective {
  constructor() {
    this.validSubmit = new EventEmitter();
  }
  onSubmit() {
    this.markAsTouchedAndDirty(this.formGroup);
    if (this.formGroup.valid) {
      this.validSubmit.emit(this.formGroup.value);
    }
  }
  markAsTouchedAndDirty(control) {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => this.markAsTouchedAndDirty(control.controls[key]));
    }
    else if (control instanceof FormArray) {
      control.controls.forEach(c => this.markAsTouchedAndDirty(c));
    }
    else if (control instanceof FormControl && control.enabled) {
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }
}
FormValidationDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: FormValidationDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
FormValidationDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.11", type: FormValidationDirective, selector: "[formGroup]", inputs: { formGroup: "formGroup" }, outputs: { validSubmit: "validSubmit" }, host: { listeners: { "submit": "onSubmit()" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: FormValidationDirective, decorators: [{
    type: Directive,
    args: [{
      // tslint:disable-next-line:directive-selector
      selector: "[formGroup]"
    }]
  }], propDecorators: {
    formGroup: [{
      type: Input
    }], validSubmit: [{
      type: Output
    }], onSubmit: [{
      type: HostListener,
      args: ["submit"]
    }]
  }
});

class MessagesComponent {
  constructor(bootstrapVersion) {
    this.bootstrapVersion = bootstrapVersion;
    this.messages = () => [];
  }
  get className() {
    switch (this.bootstrapVersion) {
      case BootstrapVersion.Three:
        return "help-block";
      case BootstrapVersion.Four:
        return "invalid-feedback";
    }
  }
}
MessagesComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MessagesComponent, deps: [{ token: BOOTSTRAP_VERSION }], target: i0.ɵɵFactoryTarget.Component });
MessagesComponent.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: "12.0.0", version: "13.3.11", type: MessagesComponent, selector: "bfv-messages", inputs: { messages: "messages" }, ngImport: i0, template: `
    <span [ngClass]="className" *ngFor="let message of messages()" [title]="message">{{message}}</span>
  `, isInline: true, styles: [".invalid-feedback,.valid-feedback{display:block}\n"], directives: [{ type: i1$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1$1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }]
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MessagesComponent, decorators: [{
    type: Component,
    args: [{
      selector: "bfv-messages",
      template: `
    <span [ngClass]="className" *ngFor="let message of messages()" [title]="message">{{message}}</span>
  `,
      styles: [
        `
      .invalid-feedback,
      .valid-feedback {
        display: block;
      }
    `
      ]
    }]
  }], ctorParameters: function () {
    return [{
      type: BootstrapVersion, decorators: [{
        type: Inject,
        args: [BOOTSTRAP_VERSION]
      }]
    }];
  }, propDecorators: {
    messages: [{
      type: Input
    }]
  }
});

const DEFAULT_ERRORS = [
  {
    error: "required",
    format: label => `${label} is required`
  },
  {
    error: "pattern",
    format: label => `${label} is invalid`
  },
  {
    error: "minlength",
    format: (label, error) => `${label} must be at least ${error.requiredLength} characters`
  },
  {
    error: "maxlength",
    format: (label, error) => `${label} must be no longer than ${error.requiredLength} characters`
  },
  {
    error: "requiredTrue",
    format: (label, error) => `${label} is required`
  },
  {
    error: "email",
    format: (label, error) => `Invalid email address`
  },
  {
    error: "max",
    format: (label, error) => `${label} must be no greater than ${error.max}`
  },
  {
    error: "min",
    format: (label, error) => `${label} must be no less than ${error.min}`
  }
];

class ErrorMessageService {
  constructor(customErrorMessages) {
    this.customErrorMessages = customErrorMessages;
    this.defaultErrors = DEFAULT_ERRORS;
    this.errorMessages = customErrorMessages.reduce((acc, cur) => acc.concat(cur), this.defaultErrors);
  }
}
ErrorMessageService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: ErrorMessageService, deps: [{ token: CUSTOM_ERROR_MESSAGES }], target: i0.ɵɵFactoryTarget.Injectable });
ErrorMessageService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: ErrorMessageService, providedIn: "root" });
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: ErrorMessageService, decorators: [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], ctorParameters: function () {
    return [{
      type: undefined, decorators: [{
        type: Inject,
        args: [CUSTOM_ERROR_MESSAGES]
      }]
    }];
  }
});

class FormGroupComponent {
  constructor(elRef, errorMessageService) {
    this.elRef = elRef;
    this.errorMessageService = errorMessageService;
    this.customErrorMessages = [];
    this.validationDisabled = false;
    this.messages = () => this.getMessages();
  }
  get hasErrors() {
    return (this.FormControlNames.some(c => !c.valid && c.dirty && c.touched) &&
      !this.validationDisabled);
  }
  get hasSuccess() {
    return (!this.FormControlNames.some(c => !c.valid) &&
      this.FormControlNames.some(c => c.dirty && c.touched) &&
      !this.validationDisabled);
  }
  ngAfterContentInit() {
    if (this.messagesBlock) {
      this.messagesBlock.messages = this.messages;
    }
  }
  ngOnInit() {
    this.errorMessages = this.errorMessageService.errorMessages
      .concat(this.customErrorMessages)
      .reverse();
  }
  get label() {
    const label = this.elRef.nativeElement.querySelector("label");
    return label && label.textContent ? label.textContent.trim() : "This field";
  }
  get isDirtyAndTouched() {
    return this.FormControlNames.some(c => c.dirty && c.touched);
  }
  getMessages() {
    const messages = [];
    if (!this.isDirtyAndTouched || this.validationDisabled) {
      return messages;
    }
    const names = this.FormControlNames.map(f => f.name);
    this.FormControlNames.filter((c, i) => !c.valid &&
      !!c.errors &&
      // filter out FormControlNames that share the same name - usually for radio buttons
      names.indexOf(c.name) === i).forEach(control => {
        Object.keys(control.errors).forEach(key => {
          const error = this.errorMessages.find(err => err.error === key);
          if (!error) {
            return;
          }
          messages.push(error.format(this.label, control.errors[key]));
        });
      });
    return messages;
  }
}
FormGroupComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: FormGroupComponent, deps: [{ token: i0.ElementRef }, { token: ErrorMessageService }], target: i0.ɵɵFactoryTarget.Component });
FormGroupComponent.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: "12.0.0", version: "13.3.11", type: FormGroupComponent, selector: ".form-group", inputs: { customErrorMessages: "customErrorMessages", validationDisabled: "validationDisabled" }, host: { properties: { "class.has-error": "this.hasErrors", "class.has-success": "this.hasSuccess" } }, queries: [{ propertyName: "messagesBlock", first: true, predicate: MessagesComponent, descendants: true }, { propertyName: "FormControlNames", predicate: FormControlName, descendants: true }], ngImport: i0, template: `
    <ng-content></ng-content>
    <bfv-messages *ngIf="!messagesBlock" [messages]="messages"></bfv-messages>
  `, isInline: true, components: [{ type: MessagesComponent, selector: "bfv-messages", inputs: ["messages"] }], directives: [{ type: i1$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }]
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: FormGroupComponent, decorators: [{
    type: Component,
    args: [{
      // tslint:disable:component-selector
      selector: ".form-group",
      template: `
    <ng-content></ng-content>
    <bfv-messages *ngIf="!messagesBlock" [messages]="messages"></bfv-messages>
  `
    }]
  }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: ErrorMessageService }]; }, propDecorators: {
    FormControlNames: [{
      type: ContentChildren,
      args: [FormControlName, { descendants: true }]
    }], customErrorMessages: [{
      type: Input
    }], validationDisabled: [{
      type: Input
    }], hasErrors: [{
      type: HostBinding,
      args: ["class.has-error"]
    }], hasSuccess: [{
      type: HostBinding,
      args: ["class.has-success"]
    }], messagesBlock: [{
      type: ContentChild,
      args: [MessagesComponent]
    }]
  }
});

class NgBootstrapFormValidationModule {
  static forRoot(userOptions = {
    bootstrapVersion: BootstrapVersion.Four
  }) {
    return {
      ngModule: NgBootstrapFormValidationModule,
      providers: [
        {
          provide: CUSTOM_ERROR_MESSAGES,
          useValue: userOptions.customErrorMessages || [],
          multi: true
        },
        {
          provide: BOOTSTRAP_VERSION,
          useValue: userOptions.bootstrapVersion
        }
      ]
    };
  }
}
NgBootstrapFormValidationModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: NgBootstrapFormValidationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgBootstrapFormValidationModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: NgBootstrapFormValidationModule, declarations: [FormValidationDirective,
    FormGroupComponent,
    MessagesComponent,
    FormControlDirective], imports: [CommonModule], exports: [FormValidationDirective,
      FormGroupComponent,
      MessagesComponent,
      FormControlDirective]
});
NgBootstrapFormValidationModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: NgBootstrapFormValidationModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: NgBootstrapFormValidationModule, decorators: [{
    type: NgModule,
    args: [{
      imports: [CommonModule],
      declarations: [
        FormValidationDirective,
        FormGroupComponent,
        MessagesComponent,
        FormControlDirective
      ],
      exports: [
        FormValidationDirective,
        FormGroupComponent,
        MessagesComponent,
        FormControlDirective
      ]
    }]
  }]
});

/*
 * Public API Surface of ng-bootstrap-form-validation
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BOOTSTRAP_VERSION, BootstrapVersion, CUSTOM_ERROR_MESSAGES, FormControlDirective, FormGroupComponent, FormValidationDirective, MessagesComponent, NgBootstrapFormValidationModule };
//# sourceMappingURL=mingleats-ng-bootstrap-form-validation.mjs.map
