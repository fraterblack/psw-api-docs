import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-full-dialog',
  templateUrl: './full-dialog.component.html'
})
export class FullDialogComponent {
  @Input()
  title?: string;

  @Input()
  closeLabel = 'Fechar';

  @Output() closeDialog = new EventEmitter();

  onCloseClicked() {
    this.closeDialog.emit();
  }
}
