import { Component, Inject } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogClosed } from '../../../core/interfaces/dialog-closed.interface';
import { AlertService } from '../../../core/services/alert.service';
import { DialogService } from '../../../core/services/dialog.service';
import { ObjectHelper } from '../../../core/utils/object-helper';
import { DialogComponent } from '../../../shared/views/extendable/dialog-component';

interface BankedHourExtractConditionComponentData {
  value?: any;
  changes?: DialogClosed<any>;
}

@Component({
  selector: 'app-banked-hour-extract-condition',
  templateUrl: 'banked-hour-extract-condition.component.html'
})
export class BankedHourExtractConditionComponent extends DialogComponent {
  conditionFormGroup = new UntypedFormGroup({
    type: new UntypedFormControl(null),
    limitType: new UntypedFormControl('---'),
    limitValue: new UntypedFormControl(null),
  });

  typeOptions: any[] = [
    {
      id: '',
      name: 'Nenhum',
    },
    {
      id: 'positiveBalance',
      name: 'Resumos com saldo positivo',
    },
    {
      id: 'negativeBalance',
      name: 'Resumos com saldo negativo',
    },
  ];

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

  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
    public dialogRef: MatDialogRef<BankedHourExtractConditionComponentData>,
    @Inject(MAT_DIALOG_DATA) public data: BankedHourExtractConditionComponentData,
  ) {
    super();

    if (data.value) {
      this.conditionFormGroup.get('type').setValue(data.value.type);
      this.conditionFormGroup.get('limitType').setValue(data.value.limit?.type || '---');
      this.conditionFormGroup.get('limitValue').setValue(data.value.limit?.value || null);
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


    if (!data?.type) {
      data = null;
    }

    if (data?.limit && (data.limit?.type === '---' || !data.limit?.type || !data.limit?.value)) {
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

  private closeDialog(result?: DialogClosed<any>) {
    this.dialogService.unsetFullDialogOpenState();
    this.dialogRef.close(result);
  }
}
