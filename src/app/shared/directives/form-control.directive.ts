import { Directive, Host, HostBinding, Inject, Optional, SkipSelf } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { BOOTSTRAP_VERSION, BootstrapVersion, FormControlDirective as ɵb } from 'ng-bootstrap-form-validation';

/**
 * Overwrite FormControlDirective from ng-bootstrap-form-validation to implement specific app behavior
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '.form-control,.custom-control-label,.custom-control-label,.custom-control-input'
})
export class FormControlDirective extends ɵb {
  @HostBinding('class.is-invalid')
  get invalidClass() {
    if (!this.control) {
      return false;
    }
    return (
      this.bootstrapFour &&
      this.control.invalid &&
      (this.control.touched || this.control.dirty)
    );
  }

  constructor(
    // this value might be null, but we union type it as such until
    // this issue is resolved: https://github.com/angular/angular/issues/25544
    @Optional()
    @Host()
    @SkipSelf()
    parent: ControlContainer,
    @Inject(BOOTSTRAP_VERSION) bootstrapVersion: BootstrapVersion
  ) {
    super(parent, bootstrapVersion);
  }
}
