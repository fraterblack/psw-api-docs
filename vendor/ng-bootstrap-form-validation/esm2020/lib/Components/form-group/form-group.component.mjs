import { Component, ContentChildren, ContentChild, HostBinding, Input } from "@angular/core";
import { FormControlName } from "@angular/forms";
import { MessagesComponent } from "../messages/messages.component";
import * as i0 from "@angular/core";
import * as i1 from "../../Services/error-message.service";
import * as i2 from "../messages/messages.component";
import * as i3 from "@angular/common";
export class FormGroupComponent {
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
FormGroupComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: FormGroupComponent, deps: [{ token: i0.ElementRef }, { token: i1.ErrorMessageService }], target: i0.ɵɵFactoryTarget.Component });
FormGroupComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.11", type: FormGroupComponent, selector: ".form-group", inputs: { customErrorMessages: "customErrorMessages", validationDisabled: "validationDisabled" }, host: { properties: { "class.has-error": "this.hasErrors", "class.has-success": "this.hasSuccess" } }, queries: [{ propertyName: "messagesBlock", first: true, predicate: MessagesComponent, descendants: true }, { propertyName: "FormControlNames", predicate: FormControlName, descendants: true }], ngImport: i0, template: `
    <ng-content></ng-content>
    <bfv-messages *ngIf="!messagesBlock" [messages]="messages"></bfv-messages>
  `, isInline: true, components: [{ type: i2.MessagesComponent, selector: "bfv-messages", inputs: ["messages"] }], directives: [{ type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: FormGroupComponent, decorators: [{
            type: Component,
            args: [{
                    // tslint:disable:component-selector
                    selector: ".form-group",
                    template: `
    <ng-content></ng-content>
    <bfv-messages *ngIf="!messagesBlock" [messages]="messages"></bfv-messages>
  `
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ErrorMessageService }]; }, propDecorators: { FormControlNames: [{
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
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1ncm91cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1ib290c3RyYXAtZm9ybS12YWxpZGF0aW9uL3NyYy9saWIvQ29tcG9uZW50cy9mb3JtLWdyb3VwL2Zvcm0tZ3JvdXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsZUFBZSxFQUNmLFlBQVksRUFFWixXQUFXLEVBQ1gsS0FBSyxFQUlOLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVqRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7Ozs7QUFXbkUsTUFBTSxPQUFPLGtCQUFrQjtJQWtDN0IsWUFDVSxLQUFpQixFQUNqQixtQkFBd0M7UUFEeEMsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBL0JsRCx3QkFBbUIsR0FBbUIsRUFBRSxDQUFDO1FBR3pDLHVCQUFrQixHQUFHLEtBQUssQ0FBQztRQXdCcEIsYUFBUSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUt4QyxDQUFDO0lBM0JKLElBQ0ksU0FBUztRQUNYLE9BQU8sQ0FDTCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNqRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FDekIsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUNJLFVBQVU7UUFDWixPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENB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QUFnQjtzQkFEZixlQUFlO3VCQUFDLGVBQWUsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUU7Z0JBSXZELG1CQUFtQjtzQkFEbEIsS0FBSztnQkFJTixrQkFBa0I7c0JBRGpCLEtBQUs7Z0JBSUYsU0FBUztzQkFEWixXQUFXO3VCQUFDLGlCQUFpQjtnQkFTMUIsVUFBVTtzQkFEYixXQUFXO3VCQUFDLG1CQUFtQjtnQkFVekIsYUFBYTtzQkFEbkIsWUFBWTt1QkFBQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgQ29udGVudENoaWxkLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgSW5wdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgT25Jbml0LFxuICBBZnRlckNvbnRlbnRJbml0XG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBGb3JtQ29udHJvbE5hbWUgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IEVycm9yTWVzc2FnZVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vU2VydmljZXMvZXJyb3ItbWVzc2FnZS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBNZXNzYWdlc0NvbXBvbmVudCB9IGZyb20gXCIuLi9tZXNzYWdlcy9tZXNzYWdlcy5jb21wb25lbnRcIjtcbmltcG9ydCB7IEVycm9yTWVzc2FnZSB9IGZyb20gXCIuLi8uLi9Nb2RlbHMvZXJyb3ItbWVzc2FnZVwiO1xuXG5AQ29tcG9uZW50KHtcbiAgLy8gdHNsaW50OmRpc2FibGU6Y29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiBcIi5mb3JtLWdyb3VwXCIsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDxiZnYtbWVzc2FnZXMgKm5nSWY9XCIhbWVzc2FnZXNCbG9ja1wiIFttZXNzYWdlc109XCJtZXNzYWdlc1wiPjwvYmZ2LW1lc3NhZ2VzPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1Hcm91cENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIEBDb250ZW50Q2hpbGRyZW4oRm9ybUNvbnRyb2xOYW1lLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gIEZvcm1Db250cm9sTmFtZXM6IFF1ZXJ5TGlzdDxGb3JtQ29udHJvbE5hbWU+O1xuXG4gIEBJbnB1dCgpXG4gIGN1c3RvbUVycm9yTWVzc2FnZXM6IEVycm9yTWVzc2FnZVtdID0gW107XG5cbiAgQElucHV0KClcbiAgdmFsaWRhdGlvbkRpc2FibGVkID0gZmFsc2U7XG5cbiAgQEhvc3RCaW5kaW5nKFwiY2xhc3MuaGFzLWVycm9yXCIpXG4gIGdldCBoYXNFcnJvcnMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuRm9ybUNvbnRyb2xOYW1lcy5zb21lKGMgPT4gIWMudmFsaWQgJiYgYy5kaXJ0eSAmJiBjLnRvdWNoZWQpICYmXG4gICAgICAhdGhpcy52YWxpZGF0aW9uRGlzYWJsZWRcbiAgICApO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKFwiY2xhc3MuaGFzLXN1Y2Nlc3NcIilcbiAgZ2V0IGhhc1N1Y2Nlc3MoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICF0aGlzLkZvcm1Db250cm9sTmFtZXMuc29tZShjID0+ICFjLnZhbGlkKSAmJlxuICAgICAgdGhpcy5Gb3JtQ29udHJvbE5hbWVzLnNvbWUoYyA9PiBjLmRpcnR5ICYmIGMudG91Y2hlZCkgJiZcbiAgICAgICF0aGlzLnZhbGlkYXRpb25EaXNhYmxlZFxuICAgICk7XG4gIH1cblxuICBAQ29udGVudENoaWxkKE1lc3NhZ2VzQ29tcG9uZW50KVxuICBwdWJsaWMgbWVzc2FnZXNCbG9jazogTWVzc2FnZXNDb21wb25lbnQ7XG5cbiAgcHJpdmF0ZSBlcnJvck1lc3NhZ2VzOiBFcnJvck1lc3NhZ2VbXTtcblxuICBwdWJsaWMgbWVzc2FnZXMgPSAoKSA9PiB0aGlzLmdldE1lc3NhZ2VzKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIGVycm9yTWVzc2FnZVNlcnZpY2U6IEVycm9yTWVzc2FnZVNlcnZpY2VcbiAgKSB7fVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAodGhpcy5tZXNzYWdlc0Jsb2NrKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzQmxvY2subWVzc2FnZXMgPSB0aGlzLm1lc3NhZ2VzO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZXJyb3JNZXNzYWdlcyA9IHRoaXMuZXJyb3JNZXNzYWdlU2VydmljZS5lcnJvck1lc3NhZ2VzXG4gICAgICAuY29uY2F0KHRoaXMuY3VzdG9tRXJyb3JNZXNzYWdlcylcbiAgICAgIC5yZXZlcnNlKCk7XG4gIH1cblxuICBnZXQgbGFiZWwoKSB7XG4gICAgY29uc3QgbGFiZWwgPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpO1xuICAgIHJldHVybiBsYWJlbCAmJiBsYWJlbC50ZXh0Q29udGVudCA/IGxhYmVsLnRleHRDb250ZW50LnRyaW0oKSA6IFwiVGhpcyBmaWVsZFwiO1xuICB9XG5cbiAgZ2V0IGlzRGlydHlBbmRUb3VjaGVkKCkge1xuICAgIHJldHVybiB0aGlzLkZvcm1Db250cm9sTmFtZXMuc29tZShjID0+IGMuZGlydHkgJiYgYy50b3VjaGVkKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TWVzc2FnZXMoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IG1lc3NhZ2VzID0gW107XG4gICAgaWYgKCF0aGlzLmlzRGlydHlBbmRUb3VjaGVkIHx8IHRoaXMudmFsaWRhdGlvbkRpc2FibGVkKSB7XG4gICAgICByZXR1cm4gbWVzc2FnZXM7XG4gICAgfVxuXG4gICAgY29uc3QgbmFtZXMgPSB0aGlzLkZvcm1Db250cm9sTmFtZXMubWFwKGYgPT4gZi5uYW1lKTtcblxuICAgIHRoaXMuRm9ybUNvbnRyb2xOYW1lcy5maWx0ZXIoXG4gICAgICAoYywgaSkgPT5cbiAgICAgICAgIWMudmFsaWQgJiZcbiAgICAgICAgISFjLmVycm9ycyAmJlxuICAgICAgICAvLyBmaWx0ZXIgb3V0IEZvcm1Db250cm9sTmFtZXMgdGhhdCBzaGFyZSB0aGUgc2FtZSBuYW1lIC0gdXN1YWxseSBmb3IgcmFkaW8gYnV0dG9uc1xuICAgICAgICBuYW1lcy5pbmRleE9mKGMubmFtZSkgPT09IGlcbiAgICApLmZvckVhY2goY29udHJvbCA9PiB7XG4gICAgICBPYmplY3Qua2V5cyhjb250cm9sLmVycm9ycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBjb25zdCBlcnJvciA9IHRoaXMuZXJyb3JNZXNzYWdlcy5maW5kKGVyciA9PiBlcnIuZXJyb3IgPT09IGtleSk7XG4gICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbWVzc2FnZXMucHVzaChlcnJvci5mb3JtYXQodGhpcy5sYWJlbCwgY29udHJvbC5lcnJvcnNba2V5XSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWVzc2FnZXM7XG4gIH1cbn1cbiJdfQ==