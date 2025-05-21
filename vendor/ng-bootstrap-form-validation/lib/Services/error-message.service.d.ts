import { ErrorMessage } from "../Models/error-message";
import * as i0 from "@angular/core";
export declare class ErrorMessageService {
    customErrorMessages: ErrorMessage[][];
    private defaultErrors;
    errorMessages: ErrorMessage[];
    constructor(customErrorMessages: ErrorMessage[][]);
    static ɵfac: i0.ɵɵFactoryDeclaration<ErrorMessageService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ErrorMessageService>;
}
