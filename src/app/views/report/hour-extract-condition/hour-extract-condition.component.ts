import { Component, Inject } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom, takeUntil } from 'rxjs';
import { ApiServiceUrl } from '../../../core/enums/api-service-url.enum';
import { DialogClosed } from '../../../core/interfaces/dialog-closed.interface';
import { Auth } from '../../../core/models/auth.model';
import { AlertService } from '../../../core/services/alert.service';
import { ApiService } from '../../../core/services/api.service';
import { DialogService } from '../../../core/services/dialog.service';
import { AuthStore } from '../../../core/stores/auth.store';
import { ObjectHelper } from '../../../core/utils/object-helper';
import { DialogComponent } from '../../../shared/views/extendable/dialog-component';

interface HourExtractConditionComponentData {
  activeFilters: string[],
  value?: any;
  changes?: DialogClosed<any>;
}

@Component({
  selector: 'app-hour-extract-condition',
  templateUrl: 'hour-extract-condition.component.html'
})
export class HourExtractConditionComponent extends DialogComponent {
  // Save authentication data
  authentication: Auth;

  conditionFormGroup = new UntypedFormGroup({
    columns: new UntypedFormControl([]),
    limitType: new UntypedFormControl('---'),
    limitValue: new UntypedFormControl(null),
  });

  limitOptions: any[] = [
    {
      id: '<',
      name: 'Menor que',
    },
    {
      id: '>',
      name: 'Maior que',
    },
  ];
  columnOptions: any[] = [];

  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
    private authStore: AuthStore,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<HourExtractConditionComponentData>,
    @Inject(MAT_DIALOG_DATA) public data: HourExtractConditionComponentData,
  ) {
    super();

    // Subscribe to listen auth store changes
    this.authStore.data
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(auth => {
        this.authentication = auth;
      });

    const value = localStorage.getItem(`columnsOptions_${this.authentication?.licenseId}`);
    if (value) {
      this.columnOptions = JSON.parse(value);
    }

    if (data.value) {
      this.conditionFormGroup.get('columns').setValue(data.value.columns || []);
      this.conditionFormGroup.get('limitType').setValue(data.value.limit?.type || '---');
      this.conditionFormGroup.get('limitValue').setValue(data.value.limit?.value || null);
    }
  }

  async onLoadOptions() {
    this.columnOptions = await this.runGetRequest(`${ApiServiceUrl.TIMESHEET}/external/v1/calculation-columns`)
      .then((data: any) => {
        return (data || []).map((x: any) => {
          return {
            id: x.code,
            name: x.name,
          };
        });
      })
      .catch((err) => { });

    if (this.columnOptions?.length) {
      localStorage.setItem(`columnsOptions_${this.authentication?.licenseId}`, JSON.stringify(this.columnOptions));
    }
  }

  onApply() {
    let data: any = ObjectHelper.mapObjectValues(
      this.conditionFormGroup.getRawValue(),
      null,
      {
        limitType: 'limit.type',
        limitValue: 'limit.value',
      },
    );


    if (!data?.columns?.length) {
      data = null;
    }

    if (data?.limit && (data.limit?.type === '---' || !data.limit?.value)) {
      delete data.limit;
    }

    this.closeDialog({
      changed: true,
      data,
    });
  }

  onClose() {
    this.closeDialog({ changed: false });
  }

  private async runGetRequest(endpointUrl: string, httpParams?: HttpParams): Promise<any> {
    if (!this.authentication?.token) {
      this.emitWarningMessage('Autentique-se para continuar');
      return;
    }

    // this.isBusy = true;
    return lastValueFrom(
      this.apiService.get(
        endpointUrl,
        httpParams,
        new HttpHeaders({
          Authorization: `Bearer ${this.authentication.token}`,
          'ContentType': 'application/json',
        }),
      ),
    )
      .then((data) => {
        this.emitSuccessMessage('Requisição concluída com sucesso');
        return data;
      })
      .catch(error => this.handleError(error))
      .finally(() => {
        // this.isBusy = false
      });
  }

  private closeDialog(result?: DialogClosed<any>) {
    this.dialogService.unsetFullDialogOpenState();
    this.dialogRef.close(result);
  }
}
