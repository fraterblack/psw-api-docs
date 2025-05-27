import { Component, effect, Input } from '@angular/core';

import { input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DialogClosed } from '../../../core/interfaces/dialog-closed.interface';
import { AlertService } from '../../../core/services/alert.service';
import { AppComponent } from '../../../shared/views/extendable/app-component';

interface HourExtractConditionComponentData {
  activeFilters: string[],
  value?: any;
  changes?: DialogClosed<any>;
}

@Component({
  selector: 'app-occurrence-condition',
  templateUrl: 'occurrence-condition.component.html',
})
export class OccurrenceConditionComponent extends AppComponent {
  formGroup = input<UntypedFormGroup>();

  @Input({ required: true })
  loadColumnsCallback: CallableFunction;

  @Input({ required: true })
  loadJustificationsCallback: CallableFunction;

  matchTypeOptions: any[] = [
    {
      id: 'and',
      name: 'Obrigatório (AND)',
    },
    {
      id: 'or',
      name: 'Opcional (OR)',
    },
  ];

  typeOptions: any[] = [
    {
      id: 'withValueInColumn',
      name: 'Com horas nas seguintes colunas',

    },
    {
      id: 'withJustification',
      name: 'Com Justificativas',

    },
    {
      id: 'withMissingRecord',
      name: 'Com alguma marcação faltando',

    },
    {
      id: 'withShiftMissingRecord',
      name: 'Com algum turno faltando 1 marcação',

    },
    {
      id: 'withMissingAllRecord',
      name: 'Com todas as marcações faltando',

    },
    {
      id: 'withoutRecord',
      name: 'Com nenhuma marcação',

    },
    {
      id: 'withShiftMissing',
      name: 'Com algum turno faltando',

    },
    {
      id: 'withIncludedRecord',
      name: 'Com marcação incluída manualmente',

    },
    {
      id: 'withSomeRecord',
      name: 'Com marcação',

    },
    {
      id: 'withSomeRecordInHoliday',
      name: 'Com marcação em Feriado',

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

  identifiersOptions: any[] = [];

  isLoadOptionsBusy = false;
  showIdentifiers = false;
  showLimit = false;

  constructor(
    protected alertService: AlertService,
  ) {
    super();

    effect(() => {
      if (this.formGroup().get('type')?.value) {
        this.onTypeChange(this.formGroup().get('type').value, false);
      }
    });
  }

  onTypeChange(type: string, resetIdSelection = true) {
    this.handleTypeChange(type);


    if (type === 'withValueInColumn') {
      if (resetIdSelection) {
        this.identifiersOptions = [];
        this.formGroup().get('identifiers')?.setValue([]);
      }

      this.isLoadOptionsBusy = true;

      this.loadColumnsCallback()
        .then((items: any[]) => {
          this.identifiersOptions = items;
        })
        .finally(() => this.isLoadOptionsBusy = false);
    } else if (type === 'withJustification') {
      if (resetIdSelection) {
        this.identifiersOptions = [];
        this.formGroup().get('identifiers')?.setValue([]);
      }

      this.isLoadOptionsBusy = true;

      this.loadJustificationsCallback()
        .then((items: any[]) => {
          this.identifiersOptions = items;
        })
        .finally(() => this.isLoadOptionsBusy = false);
    }
  }

  private handleTypeChange(type: string) {
    switch (type) {
      case 'withValueInColumn':
        this.showIdentifiers = true;
        this.showLimit = true;
        break;
      case 'withJustification':
        this.showIdentifiers = true;
        this.showLimit = false;
        break;
      case 'withShiftMissingRecord':
      case 'withMissingAllRecord':
      case 'withShiftMissing':
      case 'withIncludedRecord':
      case 'withSomeRecordInHoliday':
      case 'withMissingRecord':
      case 'withoutRecord':
      case 'withSomeRecord':
        this.showIdentifiers = false;
        this.showLimit = false;
        break;
    }
  }
}
