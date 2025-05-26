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
import { CacheService } from '../../../core/services/cache.service';
import { DialogService } from '../../../core/services/dialog.service';
import { AuthStore } from '../../../core/stores/auth.store';
import { DialogComponent } from '../../../shared/views/extendable/dialog-component';

interface EmployeeFilterComponentData {
  activeFilters: string[],
  value?: any;
  changes?: DialogClosed<any>;
}

@Component({
  selector: 'app-employee-filters',
  templateUrl: 'employee-filters.component.html'
})
export class EmployeeFiltersComponent extends DialogComponent {
  // Save authentication data
  authentication: Auth;

  filtersFormGroup = new UntypedFormGroup({});

  selectOptions: { [propName: string]: any[] } = {};
  activeFilters: string[] = [];

  private settings = {
    employees: {
      service: ApiServiceUrl.TIMESHEET,
      path: '/external/v1/employees',
      docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#ea3d6a75-82a2-4df7-8a84-3486eae6f68e',
      mapper: (data: any) => {
        return data.results
          .map(x => {
            return {
              id: x.id,
              name: `${x.name}${x.registrationNumber ? ' - ' + x.registrationNumber : ''}`,
            }
          });
      },
    },
    companies: {
      service: ApiServiceUrl.TIMESHEET,
      path: '/external/v1/companies',
      docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#c6e37927-0050-40e5-a5a6-235da86d7fac',
      mapper: (data: any) => data.results,
    },
    departments: {
      service: ApiServiceUrl.TIMESHEET,
      path: '/external/v1/departments',
      docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#e807ba1b-208e-43c8-865f-79e28a1b8975',
      mapper: (data: any) => data.results,
    },
    structures: {
      service: ApiServiceUrl.TIMESHEET,
      path: '/external/v1/structures',
      docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#84c0f7c3-7bb8-41ca-9f01-088996cfe249',
      mapper: (data: any) => data.results,
    },
    roles: {
      service: ApiServiceUrl.TIMESHEET,
      path: '/external/v1/roles',
      docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#80b00e97-a7e3-4d79-914d-11464f1639bf',
      mapper: (data: any) => data.results,
    },
    schedules: {
      service: ApiServiceUrl.TIMESHEET,
      path: '/external/v1/schedules',
      docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#64aabb3f-cc98-460d-a99d-4c41af888e8f',
      mapper: (data: any) => data.results,
    },
    groups: {
      service: ApiServiceUrl.TIMESHEET,
      path: '/external/v1/groups',
      docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#e1ecb000-f64e-4b68-9b67-2ab32b677302',
      mapper: (data: any) => data.results,
    },
    collectors: {
      service: ApiServiceUrl.COLLECTOR,
      path: '/external/v1/collectors',
      docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#cbb5b642-6ef2-404b-81cc-3415f5d519aa',
      mapper: (data: any) => data.results,
    },
  };

  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
    private authStore: AuthStore,
    private apiService: ApiService,
    private cacheService: CacheService,
    public dialogRef: MatDialogRef<EmployeeFiltersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeFilterComponentData,
  ) {
    super();

    // Subscribe to listen auth store changes
    this.authStore.data
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(auth => {
        this.authentication = auth;
      });

    for (const filterName of data.activeFilters) {
      this.filtersFormGroup.addControl(
        filterName,
        new UntypedFormControl(data.value && data.value[filterName] || []),
      );

      const cachedOptions = this.cacheService.get(`employeeFilter${filterName}_${this.authentication?.licenseId}`);
      if (cachedOptions) {
        this.selectOptions[filterName] = cachedOptions;
      }
    }

    this.activeFilters = data.activeFilters;
  }

  async onLoadOptions(filterName: string) {
    const settings = this.settings[filterName];

    if (!settings) {
      return;
    }

    this.selectOptions[filterName] = await this.runGetRequest(`${settings.service}${settings.path}`)
      .then((data: any) => settings.mapper(data || []))
      .catch((err) => { });

    this.cacheService.set(`employeeFilter${filterName}_${this.authentication?.licenseId}`, this.selectOptions[filterName]);
  }

  onApply() {
    const data = {};

    for (const filterName of this.activeFilters) {
      const value = this.filtersFormGroup.get(filterName)?.value;

      if (value?.length) {
        data[filterName] = value;
      }
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
