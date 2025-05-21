import { ControlContainer, FormControl } from "@angular/forms";
import { BootstrapVersion } from "../Enums/BootstrapVersion";
import * as i0 from "@angular/core";
export declare function controlPath(name: string, parent: ControlContainer): string[];
export declare class FormControlDirective {
    private parent;
    private bootstrapVersion;
    formControlName: string;
    get validClass(): boolean;
    get invalidClass(): boolean;
    get path(): string[];
    get control(): FormControl;
    get formDirective(): any;
    get bootstrapFour(): boolean;
    constructor(parent: ControlContainer, bootstrapVersion: BootstrapVersion);
    static ɵfac: i0.ɵɵFactoryDeclaration<FormControlDirective, [{ optional: true; host: true; skipSelf: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FormControlDirective, ".form-control,.form-check-input,.custom-control-input", never, { "formControlName": "formControlName"; }, {}, never>;
}
