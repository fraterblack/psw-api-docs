
import { DialogService } from '../../../core/services/dialog.service';
import { SuccessDialogComponent } from '../../components/success-dialog/success-dialog.component';
import { AppComponent } from './app-component';

/**
 * Abstract class to easily implements Form behaviors
 */
export abstract class DialogComponent extends AppComponent {
  protected abstract dialogService: DialogService;

  /**
     * Show confirmation message
     *
     * @param message Message to be showed
     * @param duration Message autohide delay
     */
  showSuccessDialog(message: string, duration = 2000) {
    this.dialogService.openDialog(SuccessDialogComponent, {
      data: { message, duration },
      maxWidth: '90dvw',
      panelClass: 'success-dialog',
      closeOnNavigation: false,
    });
  }
}
