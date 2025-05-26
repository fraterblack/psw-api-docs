import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { ApiServiceUrl } from '../../../core/enums/api-service-url.enum';
import { AlertService } from '../../../core/services/alert.service';
import { ApiService } from '../../../core/services/api.service';
import { BusyLoaderService } from '../../../core/services/busy-loader.service';
import { DialogService } from '../../../core/services/dialog.service';
import { AuthStore } from '../../../core/stores/auth.store';
import { DialogComponent } from '../../../shared/views/extendable/dialog-component';

@Component({
  selector: 'app-authentication',
  templateUrl: 'authentication.component.html'
})
export class AuthenticationComponent extends DialogComponent {
  key: string;

  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
    protected busyLoaderService: BusyLoaderService,
    private authStore: AuthStore,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AuthenticationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  loginRequestCode = `
  curl --location 'https://core.pontosystemweb.com.br/api/v1/auth-external-api/login'
  --header 'Content-Type: application/json'
  --data '{
      "key": "<SUA CHAVE>"
  }'
`;

  onSend() {
    if (!this.key) {
      return;
    }


    this.busyLoaderService.show();
    lastValueFrom(
      this.apiService.post(`${ApiServiceUrl.CORE}/v1/auth-external-api/login`, {
        key: this.key,
      }),
    )
      .then((data) => {
        this.showSuccessDialog('Autenticado com sucesso');

        this.authStore.changeSource(data, true);

        this.closeDialog();
      })
      .catch(error => this.handleError(error))
      .finally(() => this.busyLoaderService.hide());
  }

  onClose() {
    this.closeDialog();
  }

  private closeDialog() {
    this.dialogService.unsetFullDialogOpenState();
    this.dialogRef.close({});
  }
}
