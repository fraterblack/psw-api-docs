import { Injectable, Inject } from "@angular/core";
import { DEFAULT_ERRORS } from "../default-errors";
import { CUSTOM_ERROR_MESSAGES } from "../Tokens/tokens";
import * as i0 from "@angular/core";
export class ErrorMessageService {
    constructor(customErrorMessages) {
        this.customErrorMessages = customErrorMessages;
        this.defaultErrors = DEFAULT_ERRORS;
        this.errorMessages = customErrorMessages.reduce((acc, cur) => acc.concat(cur), this.defaultErrors);
    }
}
ErrorMessageService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: ErrorMessageService, deps: [{ token: CUSTOM_ERROR_MESSAGES }], target: i0.ɵɵFactoryTarget.Injectable });
ErrorMessageService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: ErrorMessageService, providedIn: "root" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: ErrorMessageService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root"
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CUSTOM_ERROR_MESSAGES]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItbWVzc2FnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctYm9vdHN0cmFwLWZvcm0tdmFsaWRhdGlvbi9zcmMvbGliL1NlcnZpY2VzL2Vycm9yLW1lc3NhZ2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7O0FBTXpELE1BQU0sT0FBTyxtQkFBbUI7SUFLOUIsWUFDd0MsbUJBQXFDO1FBQXJDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBa0I7UUFMckUsa0JBQWEsR0FBRyxjQUFjLENBQUM7UUFPckMsSUFBSSxDQUFDLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLENBQzdDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FDbkIsQ0FBQztJQUNKLENBQUM7O2lIQVpVLG1CQUFtQixrQkFNcEIscUJBQXFCO3FIQU5wQixtQkFBbUIsY0FGbEIsTUFBTTs0RkFFUCxtQkFBbUI7a0JBSC9CLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzswQkFPSSxNQUFNOzJCQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBERUZBVUxUX0VSUk9SUyB9IGZyb20gXCIuLi9kZWZhdWx0LWVycm9yc1wiO1xuaW1wb3J0IHsgQ1VTVE9NX0VSUk9SX01FU1NBR0VTIH0gZnJvbSBcIi4uL1Rva2Vucy90b2tlbnNcIjtcbmltcG9ydCB7IEVycm9yTWVzc2FnZSB9IGZyb20gXCIuLi9Nb2RlbHMvZXJyb3ItbWVzc2FnZVwiO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46IFwicm9vdFwiXG59KVxuZXhwb3J0IGNsYXNzIEVycm9yTWVzc2FnZVNlcnZpY2Uge1xuICBwcml2YXRlIGRlZmF1bHRFcnJvcnMgPSBERUZBVUxUX0VSUk9SUztcblxuICBwdWJsaWMgZXJyb3JNZXNzYWdlczogRXJyb3JNZXNzYWdlW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChDVVNUT01fRVJST1JfTUVTU0FHRVMpIHB1YmxpYyBjdXN0b21FcnJvck1lc3NhZ2VzOiBFcnJvck1lc3NhZ2VbXVtdXG4gICkge1xuICAgIHRoaXMuZXJyb3JNZXNzYWdlcyA9IGN1c3RvbUVycm9yTWVzc2FnZXMucmVkdWNlKFxuICAgICAgKGFjYywgY3VyKSA9PiBhY2MuY29uY2F0KGN1ciksXG4gICAgICB0aGlzLmRlZmF1bHRFcnJvcnNcbiAgICApO1xuICB9XG59XG4iXX0=