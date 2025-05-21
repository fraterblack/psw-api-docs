import { EventEmitter } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import * as i0 from "@angular/core";
export declare class FormValidationDirective {
    formGroup: FormGroup;
    validSubmit: EventEmitter<any>;
    onSubmit(): void;
    markAsTouchedAndDirty(control: AbstractControl): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormValidationDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FormValidationDirective, "[formGroup]", never, { "formGroup": "formGroup"; }, { "validSubmit": "validSubmit"; }, never>;
}
