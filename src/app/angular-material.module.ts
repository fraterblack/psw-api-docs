import { Platform } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';
import { DateFnsModule } from '@angular/material-date-fns-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import dayjs from 'dayjs';

const materialModules = [
  /*
  CdkTreeModule,
  BrowserAnimationsModule,
  MatRadioModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatStepperModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatSortModule,
  MatPaginatorModule,
  MatTableModule,
  */
  MatAutocompleteModule,
  MatExpansionModule,
  MatChipsModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  DateFnsModule,
  MatCheckboxModule,
  MatSelectModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatListModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatBadgeModule,
];

export class CustomDateAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    const parsedDate = dayjs(value, ['DD/MM/YYYY', 'DD/MM']);

    if (parsedDate.isValid()) {
      return parsedDate.toDate();
    } else {
      return null;
    }
  }

  format(date: Date, displayFormat: Object): string {
    return dayjs(date).format('DD/MM/YYYY');
  }
}

@NgModule({
  imports: [
    ...materialModules
  ],
  exports: [
    ...materialModules
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE, Platform] }
  ],
})
export class AngularMaterialModule { }
