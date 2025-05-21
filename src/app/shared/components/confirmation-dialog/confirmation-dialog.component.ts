import {
  Component, EventEmitter, Inject, Output
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  title?: string;
  message: string;
  yesBtnText?: string;
  noBtnText?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent {
  @Output() closed = new EventEmitter();

  yesBtnText: string;
  noBtnText: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
  ) {
    this.yesBtnText = data.yesBtnText || 'Sim';
    this.noBtnText = data.noBtnText || 'Não';
  }

  onConfirm() {
    this.dialogRef.close(true);
    this.closed.emit();
  }

  onReject() {
    this.dialogRef.close(false);
    this.closed.emit();
  }
}
