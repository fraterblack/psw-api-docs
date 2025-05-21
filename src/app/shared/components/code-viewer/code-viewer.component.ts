import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import hljs from 'highlight.js';

@Component({
  selector: 'app-code-viewer',
  templateUrl: 'code-viewer.component.html'
})
export class CodeViewerComponent implements OnChanges {
  @Input() public code: string = '';
  @Input() public language: string = 'json';

  parsedCode = '';

  ngOnChanges(changes: SimpleChanges): void {
    this.parsedCode = hljs.highlight(this.code, { language: this.language }).value;
  }
}
