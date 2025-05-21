import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isNumber } from 'lodash';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[dimension]'
})
export class DimensionDirective implements AfterViewInit, OnChanges {
  @Input() width: string | number;

  @Input() minWidth: string | number;

  @Input() maxWidth: string | number;

  @Input() height: string | number;

  @Input() minHeight: string | number;

  @Input() maxHeight: string | number;

  constructor(private element: ElementRef<HTMLInputElement>) { }

  ngAfterViewInit(): void {
    if (this.width) {
      this.setWidth();
    }

    if (this.minWidth) {
      this.setMinWidth();
    }

    if (this.maxWidth) {
      this.setMaxWidth();
    }

    if (this.height) {
      this.setHeight();
    }

    if (this.minHeight) {
      this.setMinHeight();
    }

    if (this.maxHeight) {
      this.setMaxHeight();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { width, minWidth, maxWidth, height, minHeight, maxHeight } = changes;

    if (width) {
      this.setWidth();
    }

    if (minWidth) {
      this.setMinWidth();
    }

    if (maxWidth) {
      this.setMaxWidth();
    }

    if (height) {
      this.setHeight();
    }

    if (minHeight) {
      this.setMinHeight();
    }

    if (maxHeight) {
      this.setMaxHeight();
    }
  }

  private setWidth(): void {
    const parsedWidth = isNumber(this.width) ? `${this.width}px` : this.width;
    this.element.nativeElement.style.width = parsedWidth as string;
  }

  private setMinWidth(): void {
    const parsedWidth = isNumber(this.minWidth) ? `${this.minWidth}px` : this.minWidth;
    this.element.nativeElement.style.minWidth = parsedWidth as string;
  }

  private setMaxWidth(): void {
    const parsedWidth = isNumber(this.maxWidth) ? `${this.maxWidth}px` : this.maxWidth;
    this.element.nativeElement.style.maxWidth = parsedWidth as string;
  }

  private setHeight(): void {
    const parsedHeight = isNumber(this.height) ? `${this.height}px` : this.height;
    this.element.nativeElement.style.height = parsedHeight as string;
  }

  private setMinHeight(): void {
    const parsedHeight = isNumber(this.minHeight) ? `${this.minHeight}px` : this.minHeight;
    this.element.nativeElement.style.minHeight = parsedHeight as string;
  }

  private setMaxHeight(): void {
    const parsedHeight = isNumber(this.maxHeight) ? `${this.maxHeight}px` : this.maxHeight;
    this.element.nativeElement.style.maxHeight = parsedHeight as string;
  }
}
