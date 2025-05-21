import { ElementRef, QueryList, OnInit, AfterContentInit } from "@angular/core";
import { FormControlName } from "@angular/forms";
import { ErrorMessageService } from "../../Services/error-message.service";
import { MessagesComponent } from "../messages/messages.component";
import { ErrorMessage } from "../../Models/error-message";
import * as i0 from "@angular/core";
export declare class FormGroupComponent implements OnInit, AfterContentInit {
    private elRef;
    private errorMessageService;
    FormControlNames: QueryList<FormControlName>;
    customErrorMessages: ErrorMessage[];
    validationDisabled: boolean;
    get hasErrors(): boolean;
    get hasSuccess(): boolean;
    messagesBlock: MessagesComponent;
    private errorMessages;
    messages: () => string[];
    constructor(elRef: ElementRef, errorMessageService: ErrorMessageService);
    ngAfterContentInit(): void;
    ngOnInit(): void;
    get label(): any;
    get isDirtyAndTouched(): boolean;
    private getMessages;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormGroupComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FormGroupComponent, ".form-group", never, { "customErrorMessages": "customErrorMessages"; "validationDisabled": "validationDisabled"; }, {}, ["messagesBlock", "FormControlNames"], ["*"]>;
}
