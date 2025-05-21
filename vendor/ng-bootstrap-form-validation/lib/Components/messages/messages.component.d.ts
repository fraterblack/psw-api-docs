import { BootstrapVersion } from "../../../lib/Enums/BootstrapVersion";
import * as i0 from "@angular/core";
export declare class MessagesComponent {
    private bootstrapVersion;
    messages: () => any[];
    get className(): "help-block" | "invalid-feedback";
    constructor(bootstrapVersion: BootstrapVersion);
    static ɵfac: i0.ɵɵFactoryDeclaration<MessagesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MessagesComponent, "bfv-messages", never, { "messages": "messages"; }, {}, never, never>;
}
