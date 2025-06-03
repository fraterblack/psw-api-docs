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

interface AbsenteeismConditionComponentData {
  value?: any;
  changes?: DialogClosed<any>;
}

@Component({
  selector: 'app-absenteeism-condition',
  templateUrl: 'absenteeism-condition.component.html'
})
export class AbsenteeismConditionComponent extends DialogComponent {
  // Save authentication data
  authentication: Auth;

  conditionFormGroup = new UntypedFormGroup({
    ignoreBHAbsence: new UntypedFormControl(null),
    ignoreNonJustifiedAbsence: new UntypedFormControl(null),
    type: new UntypedFormControl('---'),
    identifiers: new UntypedFormControl([]),
  });

  typeOptions: any[] = [
    {
      id: 'considerAllAllowanceJustification',
      name: 'Qualquer justificativa abono',
    },
    {
      id: 'considerAllAbsenceJustification',
      name: 'Qualquer justificativa falta',
    },
    {
      id: 'considerSpecificJustification',
      name: 'Justificativa específica',
    },
    {
      id: 'disconsiderWithJustification',
      name: 'Desconsiderar com justificativa',
    },
  ];
  identifierOptions: any[] = [];
  isLoadOptionsBusy = false;

  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
    private authStore: AuthStore,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AbsenteeismConditionComponentData>,
    @Inject(MAT_DIALOG_DATA) public data: AbsenteeismConditionComponentData,
  ) {
    super();

    // Subscribe to listen auth store changes
    this.authStore.data
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(auth => {
        this.authentication = auth;
      });

    const value = localStorage.getItem(`justificationOptions_${this.authentication?.licenseId}`);
    if (value) {
      this.identifierOptions = JSON.parse(value);
    }

    if (data.value) {
      this.conditionFormGroup.get('ignoreBHAbsence').setValue(data.value.ignoreBHAbsence || null);
      this.conditionFormGroup.get('ignoreNonJustifiedAbsence').setValue(data.value.ignoreNonJustifiedAbsence || null);
      this.conditionFormGroup.get('type').setValue(data.value.type || '---');
      this.conditionFormGroup.get('identifiers').setValue(data.value.identifiers || []);
    }
  }

  async onLoadOptions() {
    this.identifierOptions = await this.runGetRequest(
      `${ApiServiceUrl.TIMESHEET}/external/v1/justifications`,
      null,
      (active: boolean) => this.isLoadOptionsBusy = active,
    )
      .then((data: any) => {
        return data.results.map((x: any) => {
          return {
            id: x.id,
            name: x.name,
          };
        });
      })
      .catch((err) => { });

    if (this.identifierOptions?.length) {
      localStorage.setItem(`justificationOptions_${this.authentication?.licenseId}`, JSON.stringify(this.identifierOptions));
    }
  }

  onApply() {
    let data: any = ObjectHelper.mapObjectValues(
      this.conditionFormGroup.getRawValue(),
      null,
    );

    switch (data.type) {
      case 'considerAllAllowanceJustification':
      case 'considerAllAbsenceJustification':
        delete data.identifiers;
        break;
      case 'disconsiderWithJustification':
        delete data.identifiers;
        break;
      case 'considerSpecificJustification':
        if (!data.identifiers?.length) {
          delete data.identifiers;
          delete data.type;
        }
        break;
      default:
        delete data.identifiers;
        delete data.type;
        break;
    }

    if (!data.ignoreBHAbsence) {
      delete data.ignoreBHAbsence;
    }

    if (!data.ignoreNonJustifiedAbsence) {
      delete data.ignoreNonJustifiedAbsence;
    }

    if (!Object.keys(data).length) {
      data = null;
    }

    this.closeDialog({
      changed: true,
      data,
    });
  }

  onClose() {
    this.closeDialog({ changed: false });
  }

  private async runGetRequest(
    endpointUrl: string,
    httpParams?: HttpParams,
    onLoadingCallback?: (active: boolean) => void,
  ): Promise<any> {
    if (!this.authentication?.token) {
      this.emitWarningMessage('Autentique-se para continuar');
      return;
    }

    (onLoadingCallback || new Function())(true)
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
      .finally(() => (onLoadingCallback || new Function())(false));
  }

  private closeDialog(result?: DialogClosed<any>) {
    this.dialogService.unsetFullDialogOpenState();
    this.dialogRef.close(result);
  }
}
