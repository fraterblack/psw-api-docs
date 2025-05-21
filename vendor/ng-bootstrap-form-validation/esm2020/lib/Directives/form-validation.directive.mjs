import { Directive, EventEmitter, Input, Output, HostListener } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import * as i0 from "@angular/core";
export class FormValidationDirective {
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: FormValidationDirective, decorators: [{
            type: Directive,
            args: [{
                    // tslint:disable-next-line:directive-selector
                    selector: "[formGroup]"
                }]
        }], propDecorators: { formGroup: [{
                type: Input
            }], validSubmit: [{
                type: Output
            }], onSubmit: [{
                type: HostListener,
                args: ["submit"]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS12YWxpZGF0aW9uLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWJvb3RzdHJhcC1mb3JtLXZhbGlkYXRpb24vc3JjL2xpYi9EaXJlY3RpdmVzL2Zvcm0tdmFsaWRhdGlvbi5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUVMLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxFQUNWLE1BQU0sZ0JBQWdCLENBQUM7O0FBTXhCLE1BQU0sT0FBTyx1QkFBdUI7SUFKcEM7UUFRRSxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7S0F1QnZDO0lBcEJDLFFBQVE7UUFDTixJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QztJQUNILENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxPQUF3QjtRQUM1QyxJQUFJLE9BQU8sWUFBWSxTQUFTLEVBQUU7WUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQzFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQ2xELENBQUM7U0FDSDthQUFNLElBQUksT0FBTyxZQUFZLFNBQVMsRUFBRTtZQUN2QyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlEO2FBQU0sSUFBSSxPQUFPLFlBQVksV0FBVyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDNUQsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3RCLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QixPQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztTQUNsQztJQUNILENBQUM7O3FIQTFCVSx1QkFBdUI7eUdBQXZCLHVCQUF1Qjs0RkFBdkIsdUJBQXVCO2tCQUpuQyxTQUFTO21CQUFDO29CQUNULDhDQUE4QztvQkFDOUMsUUFBUSxFQUFFLGFBQWE7aUJBQ3hCOzhCQUdDLFNBQVM7c0JBRFIsS0FBSztnQkFHTixXQUFXO3NCQURWLE1BQU07Z0JBSVAsUUFBUTtzQkFEUCxZQUFZO3VCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgSG9zdExpc3RlbmVyXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1xuICBBYnN0cmFjdENvbnRyb2wsXG4gIEZvcm1BcnJheSxcbiAgRm9ybUNvbnRyb2wsXG4gIEZvcm1Hcm91cFxufSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcblxuQERpcmVjdGl2ZSh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkaXJlY3RpdmUtc2VsZWN0b3JcbiAgc2VsZWN0b3I6IFwiW2Zvcm1Hcm91cF1cIlxufSlcbmV4cG9ydCBjbGFzcyBGb3JtVmFsaWRhdGlvbkRpcmVjdGl2ZSB7XG4gIEBJbnB1dCgpXG4gIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuICBAT3V0cHV0KClcbiAgdmFsaWRTdWJtaXQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBASG9zdExpc3RlbmVyKFwic3VibWl0XCIpXG4gIG9uU3VibWl0KCkge1xuICAgIHRoaXMubWFya0FzVG91Y2hlZEFuZERpcnR5KHRoaXMuZm9ybUdyb3VwKTtcbiAgICBpZiAodGhpcy5mb3JtR3JvdXAudmFsaWQpIHtcbiAgICAgIHRoaXMudmFsaWRTdWJtaXQuZW1pdCh0aGlzLmZvcm1Hcm91cC52YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgbWFya0FzVG91Y2hlZEFuZERpcnR5KGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkge1xuICAgIGlmIChjb250cm9sIGluc3RhbmNlb2YgRm9ybUdyb3VwKSB7XG4gICAgICBPYmplY3Qua2V5cyhjb250cm9sLmNvbnRyb2xzKS5mb3JFYWNoKGtleSA9PlxuICAgICAgICB0aGlzLm1hcmtBc1RvdWNoZWRBbmREaXJ0eShjb250cm9sLmNvbnRyb2xzW2tleV0pXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoY29udHJvbCBpbnN0YW5jZW9mIEZvcm1BcnJheSkge1xuICAgICAgY29udHJvbC5jb250cm9scy5mb3JFYWNoKGMgPT4gdGhpcy5tYXJrQXNUb3VjaGVkQW5kRGlydHkoYykpO1xuICAgIH0gZWxzZSBpZiAoY29udHJvbCBpbnN0YW5jZW9mIEZvcm1Db250cm9sICYmIGNvbnRyb2wuZW5hYmxlZCkge1xuICAgICAgY29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuICAgICAgY29udHJvbC5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICBjb250cm9sLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==