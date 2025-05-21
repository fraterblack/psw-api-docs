import * as i1 from "@angular/common";
import * as i0 from "@angular/core";
import { Component, Inject, Input } from "@angular/core";
import * as i2 from "../../../lib/Enums/BootstrapVersion";
import { BootstrapVersion } from "../../../lib/Enums/BootstrapVersion";
import { BOOTSTRAP_VERSION } from "../../Tokens/tokens";
export class MessagesComponent {
  constructor(bootstrapVersion) {
    this.bootstrapVersion = bootstrapVersion;
    this.messages = () => [];
  }
  get className() {
    switch (this.bootstrapVersion) {
      case BootstrapVersion.Three:
        return "help-block";
      case BootstrapVersion.Four:
        return "invalid-feedback";
    }
  }
}
MessagesComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MessagesComponent, deps: [{ token: BOOTSTRAP_VERSION }], target: i0.ɵɵFactoryTarget.Component });
MessagesComponent.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: "12.0.0", version: "13.3.11", type: MessagesComponent, selector: "bfv-messages", inputs: { messages: "messages" }, ngImport: i0, template: `
    <span [ngClass]="className" *ngFor="let message of messages()">{{message}}</span>
  `, isInline: true, styles: [".invalid-feedback,.valid-feedback{display:block}\n"], directives: [{ type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }]
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MessagesComponent, decorators: [{
    type: Component,
    args: [{
      selector: "bfv-messages",
      template: `
    <span [ngClass]="className" *ngFor="let message of messages()" [title]="message">{{message}}</span>
  `,
      styles: [
        `
      .invalid-feedback,
      .valid-feedback {
        display: block;
      }
    `
      ]
    }]
  }], ctorParameters: function () {
    return [{
      type: i2.BootstrapVersion, decorators: [{
        type: Inject,
        args: [BOOTSTRAP_VERSION]
      }]
    }];
  }, propDecorators: {
    messages: [{
      type: Input
    }]
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctYm9vdHN0cmFwLWZvcm0tdmFsaWRhdGlvbi9zcmMvbGliL0NvbXBvbmVudHMvbWVzc2FnZXMvbWVzc2FnZXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN2RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7OztBQWdCeEQsTUFBTSxPQUFPLGlCQUFpQjtJQWE1QixZQUNxQyxnQkFBa0M7UUFBbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQVpoRSxhQUFRLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBYXhCLENBQUM7SUFYSixJQUFJLFNBQVM7UUFDWCxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUM3QixLQUFLLGdCQUFnQixDQUFDLEtBQUs7Z0JBQ3pCLE9BQU8sWUFBWSxDQUFDO1lBQ3RCLEtBQUssZ0JBQWdCLENBQUMsSUFBSTtnQkFDeEIsT0FBTyxrQkFBa0IsQ0FBQztTQUM3QjtJQUNILENBQUM7OytHQVhVLGlCQUFpQixrQkFjbEIsaUJBQWlCO21HQWRoQixpQkFBaUIsc0ZBWmxCOztHQUVUOzRGQVVVLGlCQUFpQjtrQkFkN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsUUFBUSxFQUFFOztHQUVUO29CQUNELE1BQU0sRUFBRTt3QkFDTjs7Ozs7S0FLQztxQkFDRjtpQkFDRjs7MEJBZUksTUFBTTsyQkFBQyxpQkFBaUI7NENBWnBCLFFBQVE7c0JBRGQsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIEluamVjdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBCb290c3RyYXBWZXJzaW9uIH0gZnJvbSBcIi4uLy4uLy4uL2xpYi9FbnVtcy9Cb290c3RyYXBWZXJzaW9uXCI7XG5pbXBvcnQgeyBCT09UU1RSQVBfVkVSU0lPTiB9IGZyb20gXCIuLi8uLi9Ub2tlbnMvdG9rZW5zXCI7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogXCJiZnYtbWVzc2FnZXNcIixcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3BhbiBbbmdDbGFzc109XCJjbGFzc05hbWVcIiAqbmdGb3I9XCJsZXQgbWVzc2FnZSBvZiBtZXNzYWdlcygpXCI+e3ttZXNzYWdlfX08L3NwYW4+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIC5pbnZhbGlkLWZlZWRiYWNrLFxuICAgICAgLnZhbGlkLWZlZWRiYWNrIHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICB9XG4gICAgYFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VzQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgcHVibGljIG1lc3NhZ2VzID0gKCkgPT4gW107XG5cbiAgZ2V0IGNsYXNzTmFtZSgpIHtcbiAgICBzd2l0Y2ggKHRoaXMuYm9vdHN0cmFwVmVyc2lvbikge1xuICAgICAgY2FzZSBCb290c3RyYXBWZXJzaW9uLlRocmVlOlxuICAgICAgICByZXR1cm4gXCJoZWxwLWJsb2NrXCI7XG4gICAgICBjYXNlIEJvb3RzdHJhcFZlcnNpb24uRm91cjpcbiAgICAgICAgcmV0dXJuIFwiaW52YWxpZC1mZWVkYmFja1wiO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoQk9PVFNUUkFQX1ZFUlNJT04pIHByaXZhdGUgYm9vdHN0cmFwVmVyc2lvbjogQm9vdHN0cmFwVmVyc2lvblxuICApIHt9XG59XG4iXX0=
