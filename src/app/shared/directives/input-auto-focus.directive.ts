import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[inputAutoFocus]'
})
export class InputAutoFocusDirective implements AfterViewInit {
  @Input() inputAutoFocus: number;

  @Input() selectOnAutoFocus: boolean;

  constructor(private element: ElementRef<HTMLInputElement>) { }

  ngAfterViewInit(): void {
    if (!this.element.nativeElement['focus']) {
      console.warn('Element does not support focus');
      return;
    }

    if (this.inputAutoFocus) {
      try {
        if (this.element.nativeElement?.nodeName === 'NG-SELECT') {
          console.warn('[InputAutoFocusDirective] To ng-select component use "autofocus" @Input instead "inputAutoFocus" directive');
        }
      } catch (err) {
        // Nothing
      }

      setTimeout(() => {
        this.element.nativeElement.focus();

        if (this.selectOnAutoFocus) {
          this.element.nativeElement.select();
        }
      }, this.inputAutoFocus);
    } else {
      this.element.nativeElement.focus();

      if (this.selectOnAutoFocus) {
        this.element.nativeElement.select();
      }
    }
  }
}
