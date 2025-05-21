import { ModuleWithProviders } from "@angular/core";
import { NgBootstrapFormValidationModuleOptions } from "./Models/NgBootstrapFormValidationModuleOptions";
import * as i0 from "@angular/core";
import * as i1 from "./Directives/form-validation.directive";
import * as i2 from "./Components/form-group/form-group.component";
import * as i3 from "./Components/messages/messages.component";
import * as i4 from "./Directives/form-control.directive";
import * as i5 from "@angular/common";
export declare class NgBootstrapFormValidationModule {
    static forRoot(userOptions?: NgBootstrapFormValidationModuleOptions): ModuleWithProviders<NgBootstrapFormValidationModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgBootstrapFormValidationModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NgBootstrapFormValidationModule, [typeof i1.FormValidationDirective, typeof i2.FormGroupComponent, typeof i3.MessagesComponent, typeof i4.FormControlDirective], [typeof i5.CommonModule], [typeof i1.FormValidationDirective, typeof i2.FormGroupComponent, typeof i3.MessagesComponent, typeof i4.FormControlDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NgBootstrapFormValidationModule>;
}
