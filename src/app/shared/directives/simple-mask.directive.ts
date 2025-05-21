import { DOCUMENT } from '@angular/common';
import { Directive, HostListener, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IConfig, NgxMaskService } from 'ngx-mask';
import { CustomKeyboardEvent } from '../../core/utils/custom-keyboard-event';

/**
 * Simple Mask without NG_VALUE_ACESSOR and feel setting
 * Based on MaskDirective to create it
 * @see https://github.com/JsDaddy/ngx-mask/blob/develop/projects/ngx-mask-lib/src/lib/mask.directive.ts
 * @class SimpleMaskDirectives
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[simpleMask]',
  providers: [
    NgxMaskService
  ]
})
export class SimpleMaskDirective implements OnChanges {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('simpleMask') public maskExpression: string = '';

  @Input() showMaskTyped: IConfig['showMaskTyped'] | null = null;

  @Input() dropSpecialCharacters: IConfig['dropSpecialCharacters'] | null = null;

  private maskValue: string = '';
  private maskExpressionArray: string[] = [];
  private inputValue!: string;
  private position: number | null = null;
  private code!: string;

  private justPasted: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private maskService: NgxMaskService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const { maskExpression, showMaskTyped, dropSpecialCharacters } = changes;

    if (showMaskTyped) {
      this.maskService.showMaskTyped = showMaskTyped.currentValue;
    }

    if (dropSpecialCharacters) {
      this.maskService.dropSpecialCharacters = dropSpecialCharacters.currentValue;
    }

    if (maskExpression) {
      this.maskValue = maskExpression.currentValue || '';
      if (maskExpression.currentValue) {
        this.maskExpressionArray = maskExpression.currentValue.split('||').sort((a: string, b: string) => {
          return a.length - b.length;
        });
        this.maskValue = this.maskExpressionArray[0];
        this.maskExpression = this.maskExpressionArray[0];
        this.maskService.maskExpression = this.maskExpressionArray[0];
      }
    }
  }

  @HostListener('paste')
  public onPaste() {
    this.justPasted = true;
  }

  @HostListener('input', ['$event'])
  onInput(e: CustomKeyboardEvent): void {
    const el: HTMLInputElement = e.target as HTMLInputElement;
    this.inputValue = el.value;

    this.setMask();

    if (!this.maskValue) {
      return;
    }
    const position: number =
      el.selectionStart === 1
        ? (el.selectionStart as number) + this.maskService.prefix.length
        : (el.selectionStart as number);
    let caretShift = 0;
    let backspaceShift = false;
    this.maskService.applyValueChanges(
      position,
      this.justPasted,
      this.code === 'Backspace' || this.code === 'Delete',
      (shift: number, _backspaceShift: boolean) => {
        this.justPasted = false;
        caretShift = shift;
        backspaceShift = _backspaceShift;
      }
    );
    // only set the selection if the element is active
    if (this.document.activeElement !== el) {
      return;
    }
    this.position = this.position === 1 && this.inputValue.length === 1 ? null : this.position;
    let positionToApply: number = this.position
      ? this.inputValue.length + position + caretShift
      : position + (this.code === 'Backspace' && !backspaceShift ? 0 : caretShift);
    if (positionToApply > this.getActualInputLength()) {
      positionToApply = this.getActualInputLength();
    }
    el.setSelectionRange(positionToApply, positionToApply);
    if ((this.maskExpression.includes('H') || this.maskExpression.includes('M')) && caretShift === 0) {
      el.setSelectionRange((el.selectionStart as number) + 1, (el.selectionStart as number) + 1);
    }
    this.position = null;
  }

  private getActualInputLength() {
    return (
      this.maskService.actualValue.length || this.maskService.actualValue.length + this.maskService.prefix.length
    );
  }

  private setMask() {
    if (this.maskExpressionArray.length > 0) {
      this.maskExpressionArray.some(mask => {
        const test = this.maskService.removeMask(this.inputValue).length <= this.maskService.removeMask(mask).length;
        if (this.inputValue && test) {
          this.maskValue = mask;
          this.maskExpression = mask;
          this.maskService.maskExpression = mask;
          return test;
        } else {
          this.maskValue = this.maskExpressionArray[this.maskExpressionArray.length - 1];
          this.maskExpression = this.maskExpressionArray[this.maskExpressionArray.length - 1];
          this.maskService.maskExpression = this.maskExpressionArray[this.maskExpressionArray.length - 1];
        }
      });
    }
  }
}
