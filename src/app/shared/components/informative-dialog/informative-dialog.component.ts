import {
  Component, EventEmitter, Inject, Output
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface InformativeDialogData {
  message: string;
}

@Component({
  selector: 'app-informative-dialog',
  templateUrl: './informative-dialog.component.html'
})
export class InformativeDialogComponent {
  @Output() closed = new EventEmitter();

  private open = false;

  constructor(
    public dialogRef: MatDialogRef<InformativeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InformativeDialogData,
  ) {
    this.open = true;
  }

  onClose() {
    this.open = false;

    this.dialogRef.close();
    this.closed.emit();
  }
}
