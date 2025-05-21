import { Component, ContentChildren, QueryList } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { FormGroupComponent as NgFormGroupComponent } from 'ng-bootstrap-form-validation';

/**
 * Overwrite FormGroupComponent from ng-bootstrap-form-validation to implement specific app behavior
 */
@Component({
  // tslint:disable:component-selector
  selector: '.app-form-group',
  template: `
    <ng-content></ng-content>
    <bfv-messages *ngIf="!messagesBlock" [messages]="messages"></bfv-messages>
  `
})
export class FormGroupComponent extends NgFormGroupComponent {
  @ContentChildren(FormControlName, { descendants: true })
  FormControlNames: QueryList<FormControlName>;

  get isDirtyAndTouched() {
    return this.FormControlNames.some(c => c.dirty || c.touched);
  }
}
