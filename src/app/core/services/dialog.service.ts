import { Injectable } from '@angular/core';

import { ComponentType } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(
    private location: Location,
    private dialog: MatDialog,
  ) { }

  closeDialog(id: string) {
    this.dialog.getDialogById(id)?.close();
  }

  openDialog<T, R = any>(
    component: ComponentType<T>,
    config: MatDialogConfig,
  ) {
    return this.dialog.open<T, any, R>(component, config);
  }

  openFullDialog<T, R = any, D = any>(
    component: ComponentType<T>,
    disableClose = true,
    data?: D,
    minWidth: number | string = 900,
  ) {
    const dialogId = this.setFullDialogOpenState();
    const inFullMode = window.innerWidth < 992;

    return this.dialog.open<T, D, R>(component, {
      data,
      minWidth,
      panelClass: 'full-dialog',
      disableClose,
      closeOnNavigation: false,
      id: `full-dialog-${dialogId}`,
      enterAnimationDuration: inFullMode ? 0 : 250,
      exitAnimationDuration: inFullMode ? 0 : 250,
    });
  }

  setFullDialogOpenState(): number {
    const currentUrl = this.location.path(true);
    const dialogParam = this.getDialogValue(currentUrl);

    if (dialogParam) {
      const newDialogValue = currentUrl.replace(`dialog=${dialogParam}`, `dialog=${dialogParam + 1}`);
      this.location.go(newDialogValue);

      return dialogParam + 1;
    } else {
      this.location.go(`${currentUrl}?dialog=1`);
      return 1;
    }
  }

  unsetFullDialogOpenState(empty?: boolean) {
    const currentUrl = this.location.path(true);
    const dialogParam = this.getDialogValue(currentUrl);

    if (dialogParam) {
      let newUrl = currentUrl;
      if (empty || dialogParam === 1) {
        newUrl = currentUrl.replace(`?dialog=${dialogParam}`, '');
        this.location.replaceState(newUrl);
      } else {
        this.location.back();
      }
    }
  }

  private getDialogValue(url: string): number | null {
    const regex = /dialog=(\d+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return null;
  }
}
