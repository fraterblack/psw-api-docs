import { Directive, Input, HostBinding, Optional, Host, SkipSelf, Inject } from "@angular/core";
import { BootstrapVersion } from "../Enums/BootstrapVersion";
import { BOOTSTRAP_VERSION } from "../Tokens/tokens";
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../Enums/BootstrapVersion";
export function controlPath(name, parent) {
    // tslint:disable-next-line:no-non-null-assertion
    return [...parent.path, name];
}
export class FormControlDirective {
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: FormControlDirective, decorators: [{
            type: Directive,
            args: [{
                    // tslint:disable-next-line:directive-selector
                    selector: ".form-control,.form-check-input,.custom-control-input"
                }]
        }], ctorParameters: function () { return [{ type: i1.ControlContainer, decorators: [{
                    type: Optional
                }, {
                    type: Host
                }, {
                    type: SkipSelf
                }] }, { type: i2.BootstrapVersion, decorators: [{
                    type: Inject,
                    args: [BOOTSTRAP_VERSION]
                }] }]; }, propDecorators: { formControlName: [{
                type: Input
            }], validClass: [{
                type: HostBinding,
                args: ["class.is-valid"]
            }], invalidClass: [{
                type: HostBinding,
                args: ["class.is-invalid"]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1jb250cm9sLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWJvb3RzdHJhcC1mb3JtLXZhbGlkYXRpb24vc3JjL2xpYi9EaXJlY3RpdmVzL2Zvcm0tY29udHJvbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsV0FBVyxFQUNYLFFBQVEsRUFDUixJQUFJLEVBQ0osUUFBUSxFQUNSLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7OztBQUVyRCxNQUFNLFVBQVUsV0FBVyxDQUFDLElBQVksRUFBRSxNQUF3QjtJQUNoRSxpREFBaUQ7SUFDakQsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBTUQsTUFBTSxPQUFPLG9CQUFvQjtJQTZDL0I7SUFDRSwrREFBK0Q7SUFDL0QsMEVBQTBFO0lBSWxFLE1BQXdCLEVBQ0csZ0JBQWtDO1FBRDdELFdBQU0sR0FBTixNQUFNLENBQWtCO1FBQ0cscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtJQUNwRSxDQUFDO0lBakRKLElBQ0ksVUFBVTtRQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLENBQ0wsSUFBSSxDQUFDLGFBQWE7WUFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQ2xCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FDN0MsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUNJLFlBQVk7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxDQUNMLElBQUksQ0FBQyxhQUFhO1lBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTztZQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87WUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQ25CLENBQUM7SUFDSixDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3hELENBQUM7SUFFRCxJQUFJLGFBQWE7UUFDZixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7SUFDekQsQ0FBQzs7a0hBM0NVLG9CQUFvQiw4RkFvRHJCLGlCQUFpQjtzR0FwRGhCLG9CQUFvQjs0RkFBcEIsb0JBQW9CO2tCQUpoQyxTQUFTO21CQUFDO29CQUNULDhDQUE4QztvQkFDOUMsUUFBUSxFQUFFLHVEQUF1RDtpQkFDbEU7OzBCQWlESSxRQUFROzswQkFDUixJQUFJOzswQkFDSixRQUFROzswQkFFUixNQUFNOzJCQUFDLGlCQUFpQjs0Q0FsRDNCLGVBQWU7c0JBRGQsS0FBSztnQkFJRixVQUFVO3NCQURiLFdBQVc7dUJBQUMsZ0JBQWdCO2dCQWF6QixZQUFZO3NCQURmLFdBQVc7dUJBQUMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgSG9zdEJpbmRpbmcsXG4gIE9wdGlvbmFsLFxuICBIb3N0LFxuICBTa2lwU2VsZixcbiAgSW5qZWN0XG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb250cm9sQ29udGFpbmVyLCBGb3JtQ29udHJvbCB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgQm9vdHN0cmFwVmVyc2lvbiB9IGZyb20gXCIuLi9FbnVtcy9Cb290c3RyYXBWZXJzaW9uXCI7XG5pbXBvcnQgeyBCT09UU1RSQVBfVkVSU0lPTiB9IGZyb20gXCIuLi9Ub2tlbnMvdG9rZW5zXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb250cm9sUGF0aChuYW1lOiBzdHJpbmcsIHBhcmVudDogQ29udHJvbENvbnRhaW5lcik6IHN0cmluZ1tdIHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW5vbi1udWxsLWFzc2VydGlvblxuICByZXR1cm4gWy4uLnBhcmVudC5wYXRoISwgbmFtZV07XG59XG5cbkBEaXJlY3RpdmUoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yXG4gIHNlbGVjdG9yOiBcIi5mb3JtLWNvbnRyb2wsLmZvcm0tY2hlY2staW5wdXQsLmN1c3RvbS1jb250cm9sLWlucHV0XCJcbn0pXG5leHBvcnQgY2xhc3MgRm9ybUNvbnRyb2xEaXJlY3RpdmUge1xuICBASW5wdXQoKVxuICBmb3JtQ29udHJvbE5hbWU6IHN0cmluZztcblxuICBASG9zdEJpbmRpbmcoXCJjbGFzcy5pcy12YWxpZFwiKVxuICBnZXQgdmFsaWRDbGFzcygpIHtcbiAgICBpZiAoIXRoaXMuY29udHJvbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5ib290c3RyYXBGb3VyICYmXG4gICAgICB0aGlzLmNvbnRyb2wudmFsaWQgJiZcbiAgICAgICh0aGlzLmNvbnRyb2wudG91Y2hlZCB8fCB0aGlzLmNvbnRyb2wuZGlydHkpXG4gICAgKTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZyhcImNsYXNzLmlzLWludmFsaWRcIilcbiAgZ2V0IGludmFsaWRDbGFzcygpIHtcbiAgICBpZiAoIXRoaXMuY29udHJvbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5ib290c3RyYXBGb3VyICYmXG4gICAgICB0aGlzLmNvbnRyb2wuaW52YWxpZCAmJlxuICAgICAgdGhpcy5jb250cm9sLnRvdWNoZWQgJiZcbiAgICAgIHRoaXMuY29udHJvbC5kaXJ0eVxuICAgICk7XG4gIH1cblxuICBnZXQgcGF0aCgpIHtcbiAgICByZXR1cm4gY29udHJvbFBhdGgodGhpcy5mb3JtQ29udHJvbE5hbWUsIHRoaXMucGFyZW50KTtcbiAgfVxuXG4gIGdldCBjb250cm9sKCk6IEZvcm1Db250cm9sIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtRGlyZWN0aXZlICYmIHRoaXMuZm9ybURpcmVjdGl2ZS5nZXRDb250cm9sKHRoaXMpO1xuICB9XG5cbiAgZ2V0IGZvcm1EaXJlY3RpdmUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5mb3JtRGlyZWN0aXZlIDogbnVsbDtcbiAgfVxuXG4gIGdldCBib290c3RyYXBGb3VyKCkge1xuICAgIHJldHVybiB0aGlzLmJvb3RzdHJhcFZlcnNpb24gPT09IEJvb3RzdHJhcFZlcnNpb24uRm91cjtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8vIHRoaXMgdmFsdWUgbWlnaHQgYmUgbnVsbCwgYnV0IHdlIHVuaW9uIHR5cGUgaXQgYXMgc3VjaCB1bnRpbFxuICAgIC8vIHRoaXMgaXNzdWUgaXMgcmVzb2x2ZWQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI1NTQ0XG4gICAgQE9wdGlvbmFsKClcbiAgICBASG9zdCgpXG4gICAgQFNraXBTZWxmKClcbiAgICBwcml2YXRlIHBhcmVudDogQ29udHJvbENvbnRhaW5lcixcbiAgICBASW5qZWN0KEJPT1RTVFJBUF9WRVJTSU9OKSBwcml2YXRlIGJvb3RzdHJhcFZlcnNpb246IEJvb3RzdHJhcFZlcnNpb25cbiAgKSB7fVxufVxuIl19