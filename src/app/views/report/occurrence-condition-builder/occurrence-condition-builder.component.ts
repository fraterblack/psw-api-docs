import { Component, Inject } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { uniqBy } from 'lodash';
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

interface OccurrenceConditionBuilderComponentData {
  value?: any[];
  changes?: DialogClosed<any>;
}

@Component({
  selector: 'app-occurrence-condition-builder',
  templateUrl: 'occurrence-condition-builder.component.html'
})
export class OccurrenceConditionBuilderComponent extends DialogComponent {
  // Save authentication data
  authentication: Auth;

  formGroup = new UntypedFormGroup({
    conditions: new UntypedFormArray([]),
  });

  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
    private authStore: AuthStore,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<OccurrenceConditionBuilderComponentData>,
    @Inject(MAT_DIALOG_DATA) public data: OccurrenceConditionBuilderComponentData,
  ) {
    super();

    // Subscribe to listen auth store changes
    this.authStore.data
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(auth => {
        this.authentication = auth;
      });

    if (data.value?.length) {
      for (const item of data.value) {
        this.getConditions().push(this.createConditionFormControl(
          item.matchType,
          item.type,
          item.identifiers,
          item.limitType,
          item.limitValue,
        ));
      }
    } else {
      this.getConditions().push(this.createConditionFormControl());
    }
  }

  onApply() {
    let data: any = ObjectHelper.mapObjectValues(
      this.formGroup.getRawValue(),
      null,
      {
        'conditions[*]limitType': 'conditions[*]limit.type',
        'conditions[*]limitValue': 'conditions[*]limit.value',
      },
    );

    const parsedData: any[] = uniqBy(
      data.conditions
        .map((x: any) => {
          if (!x.type) {
            return null;
          }

          x.matchType = x.matchType || 'and';

          switch (x.type) {
            case 'withValueInColumn':
              if (!x.identifiers?.length) {
                return null;
              }
              break;
            case 'withJustification':
              x.limit = null;
              break;
            case 'withShiftMissingRecord':
            case 'withMissingAllRecord':
            case 'withShiftMissing':
            case 'withIncludedRecord':
            case 'withSomeRecordInHoliday':
            case 'withMissingRecord':
            case 'withoutRecord':
            case 'withSomeRecord':
              x.identifiers = null;
              x.limit = null;
              break;
          }

          if (!x?.limit || !x.limit?.type || !x.limit?.value || x.limit?.type === '---') {
            delete x.limit;
          }

          if (!x?.identifiers || !x.identifiers?.length) {
            delete x.identifiers;
          }

          return x;
        })
        .filter((x: any) => x),
      x => x.type,
    );

    if (!parsedData?.length) {
      this.emitWarningMessage('Não foram encontradas condições válidas. Reveja suas escolhas e tente novamente');
      return;
    }

    this.closeDialog({
      changed: true,
      data: parsedData,
    });
  }

  onClose() {
    this.closeDialog({ changed: false });
  }

  onAddCondition() {
    if (this.getConditions().length >= 3) {
      return;
    }

    this.getConditions().push(this.createConditionFormControl());
  }

  onRemoveCondition(index: number) {
    this.getConditions().removeAt(index);

    if (this.getConditions().length === 0) {
      this.onAddCondition();
    }
  }

  async onLoadOptions() {
    /*
    this.identifiersOptions = await this.runGetRequest(
      `${ApiServiceUrl.TIMESHEET}/external/v1/calculation-columns`,
      null,
      (active: boolean) => this.isLoadOptionsBusy = active,
    )
      .then((data: any) => {
        return (data || []).map((x: any) => {
          return {
            id: x.code,
            name: x.name,
          };
        });
      })
      .catch((err) => { });

    if (this.identifiersOptions?.length) {
      localStorage.setItem(`columnsOptions_${this.authentication?.licenseId}`, JSON.stringify(this.identifiersOptions));
    }
    */
  }

  private closeDialog(result?: DialogClosed<any>) {
    this.dialogService.unsetFullDialogOpenState();
    this.dialogRef.close(result);
  }

  private createConditionFormControl(
    matchType?: string,
    type?: string,
    identifiers?: string[],
    limitType?: string,
    limitValue?: string,
  ) {
    return new UntypedFormGroup({
      matchType: new UntypedFormControl(matchType || 'and'),
      type: new UntypedFormControl(type || null),
      identifiers: new UntypedFormControl(identifiers || []),
      limitType: new UntypedFormControl(limitType || '---'),
      limitValue: new UntypedFormControl(limitValue || null),
    });
  }

  private getConditions(): UntypedFormArray {
    return this.formGroup.get('conditions') as UntypedFormArray;
  }

  async onLoadColumns() {
    const value = sessionStorage.getItem(`occurrenceColumnsOptions_${this.authentication?.licenseId}`);
    if (value) {
      return Promise.resolve(JSON.parse(value));
    }

    return this.runGetRequest(
      `${ApiServiceUrl.TIMESHEET}/external/v1/calculation-columns`,
      null,
    )
      .then((data: any) => {
        const mappedData = (data || []).map((x: any) => {
          return {
            id: x.code,
            name: x.name,
          };
        });

        if (mappedData?.length) {
          sessionStorage.setItem(`occurrenceColumnsOptions_${this.authentication?.licenseId}`, JSON.stringify(mappedData));
        }

        return mappedData;
      })
      .catch((err) => []);
  }

  async onLoadJustifications() {
    const value = sessionStorage.getItem(`occurrenceJustificationOptions_${this.authentication?.licenseId}`);
    if (value) {
      return Promise.resolve(JSON.parse(value));
    }

    return this.runGetRequest(
      `${ApiServiceUrl.TIMESHEET}/external/v1/justifications`,
      null,
    )
      .then((data: any) => {
        const mappedData = data.results.map((x: any) => {
          return {
            id: x.id,
            name: x.name,
          };
        });

        if (mappedData?.length) {
          sessionStorage.setItem(`occurrenceJustificationOptions_${this.authentication?.licenseId}`, JSON.stringify(mappedData));
        }
        return mappedData;
      })
      .catch((err) => []);
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
}
