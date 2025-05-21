import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

import { AlertType } from '../enums/alert-type.enum';

interface AlertIds {
  alertId: number;
  snack: MatSnackBarRef<TextOnlySnackBar>;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alerts: AlertIds[] = [];

  constructor(private snackBar: MatSnackBar) { }

  /**
   * Show alert
   *
   * @param message text message
   * @param type AlertType enum
   * @param duration In mileseconds. Set null to default delay. Set 0 to deactive autohide
   * @param id Message id. If setted will prevent duplication
   */
  show(message: string, type: AlertType, duration?: number, id?: string): MatSnackBarRef<TextOnlySnackBar> {
    const hashId = this.getHash(id || new Date().toString());

    // If id exists, try to remove already added
    if (id) {
      this.remove(hashId);
    }

    // Translate alert config to snotify toast configuration
    const snackCfg: MatSnackBarConfig = {
      duration: duration === 0 ? 30000 : (duration || 10000),
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    };

    let snack: MatSnackBarRef<TextOnlySnackBar>;

    switch (type) {
      case AlertType.SUCCESS:
        snack = this.snackBar.open(message, 'OK', { ...snackCfg, panelClass: ['app-mat-snackbar', 'app-mat-snackbar-success'] });
        break;

      case AlertType.ERROR:
        snack = this.snackBar.open(message, 'OK', { ...snackCfg, panelClass: ['app-mat-snackbar', 'app-mat-snackbar-error'] });

        break;

      case AlertType.WARNING:
        snack = this.snackBar.open(message, 'OK', { ...snackCfg, panelClass: ['app-mat-snackbar', 'app-mat-snackbar-warn'] });
        break;

      case AlertType.INFO:
        snack = this.snackBar.open(message, 'OK', { ...snackCfg, panelClass: ['app-mat-snackbar', 'app-mat-snackbar-info'] });
        break;
    }

    this.alerts.push({
      alertId: hashId,
      snack,
    });

    return snack;
  }

  /**
   * Remove alert
   *
   * @param id Alert id
   */
  remove(id: number): void {
    this.alerts = this.alerts.filter(t => {
      if (t.alertId === id && t.snack) {
        t.snack.dismiss();
        return false;
      }
      return true;
    });
  }

  /**
   * Remove all alert
   */
  removeAll(): void {
    this.snackBar.dismiss();
    this.alerts = [];
  }

  private getHash(input: string) {
    let hash = 0;
    const len = input.length;
    for (let i = 0; i < len; i++) {
      // tslint:disable-next-line: no-bitwise
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      // tslint:disable-next-line: no-bitwise
      hash |= 0; // to 32bit integer
    }

    return hash;
  }
}
