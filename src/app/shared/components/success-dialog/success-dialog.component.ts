import {
  Component, EventEmitter, Inject, Output
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface SuccessDialogData {
  message: string;
  duration: number;
}

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html'
})
export class SuccessDialogComponent {
  @Output() closed = new EventEmitter();

  private open = false;

  constructor(
    public dialogRef: MatDialogRef<SuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SuccessDialogData,
  ) {
    this.open = true;

    setTimeout(() => {
      if (this.open) {
        this.onClose();
      }
    }, data.duration);
  }

  onClose() {
    this.open = false;

    this.dialogRef.close();
    this.closed.emit();
  }
}
