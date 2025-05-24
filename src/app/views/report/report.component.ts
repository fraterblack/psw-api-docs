import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import dayjs from 'dayjs';
import { lastValueFrom, Subject, takeUntil, timeout } from 'rxjs';
import { ApiServiceUrl } from '../../core/enums/api-service-url.enum';
import { DialogClosed } from '../../core/interfaces/dialog-closed.interface';
import { Auth } from '../../core/models/auth.model';
import { AlertService } from '../../core/services/alert.service';
import { DialogService } from '../../core/services/dialog.service';
import { SseService } from '../../core/services/sse.service';
import { AuthStore } from '../../core/stores/auth.store';
import { ErrorHelper } from '../../core/utils/error-helper';
import { AppComponent } from '../../shared/views/extendable/app-component';
import { EmployeeFiltersComponent } from './employee-filters/employee-filters.component';
import { ReportSettings } from './interfaces/report-settings.interface';

@Component({
  selector: 'app-report',
  templateUrl: 'report.component.html'
})
export class ReportComponent extends AppComponent implements OnInit, OnDestroy {
  // Save authentication data
  authentication: Auth;

  // List of endpoint parameters
  endpoints: ReportSettings[] = [];

  // Selected endpoint
  selectedEndpoint: ReportSettings;

  requestUrl: string;
  requestBody: string;
  requestResult: string;

  reportId: string;
  reportProgress: any;
  reportData: string;

  isBusy = false;

  parametersFormGroup = new UntypedFormGroup({});
  activeParameters: any[];

  selectOptions: { [propName: string]: any[] } = {};

  protected ngUnsubscribeParameters = new Subject<void>();

  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
    private authStore: AuthStore,
    private apiService: ApiService,
    private sseService: SseService,
  ) {
    super();

    // Subscribe to listen auth store changes
    this.authStore.data
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(auth => {
        this.authentication = auth;
      });
  }

  ngOnInit(): void {
    this.populateReports();
  }

  onEndpointChangeChange() {
    this.requestUrl = null;
    this.requestBody = null;
    this.requestResult = null;

    this.reportId = null;
    this.reportData = null;
    this.reportProgress = null;

    this.activeParameters = [];
    this.parametersFormGroup = new UntypedFormGroup({});

    this.ngUnsubscribeParameters.next();
    this.ngUnsubscribeParameters.complete();

    // Before show report parameters, create form control
    for (const param of this.selectedEndpoint.parameters) {
      this.parametersFormGroup.addControl(
        param.name,
        new UntypedFormControl(
          param.setInitialValue ? param.setInitialValue() : null,
        ),
      );

      // Watch for changes
      if (param.onChange) {
        this.parametersFormGroup.get(param.name).valueChanges
          .pipe(takeUntil(this.ngUnsubscribeParameters))
          .subscribe((v => {
            param.onChange(v);
          }));
      }

      if (param.onStart) {
        param.onStart();
      }
    }

    this.activeParameters = this.selectedEndpoint.parameters;
  }

  async onSend() {
    if (!this.selectedEndpoint) {
      return;
    }

    this.requestUrl = null;
    this.requestBody = null;
    this.requestResult = null;

    this.reportId = null;
    this.reportData = null;
    this.reportProgress = null;

    // Parse parameters to generate body
    const body: any = {};

    for (const param of this.activeParameters) {
      const paramValue = this.parametersFormGroup.get(param.name)?.value;
      if (paramValue) {
        body[param.name] = param.parser ? param.parser(paramValue) : paramValue;
      }
    }

    this.requestUrl = `${this.selectedEndpoint.service}${this.selectedEndpoint.path}`;

    this.requestBody = JSON.stringify(
      body,
      null,
      2,
    );

    const requestResult = await this.runPostRequest(
      this.requestUrl,
      body,
    );

    this.requestResult = JSON.stringify(
      requestResult || {},
      null,
      2,
    );

    // Monitoring report progress
    this.reportId = requestResult?.id;

    if (requestResult?.id) {
      this.openReportMonitoring(requestResult.id);
    }
  }

  private openReportMonitoring(reportId: string) {
    const header = {
      authorization: `Bearer ${this.authentication.token}`,
      'x-request-origin': 'api/docs',
      'x-license-id': this.authentication.licenseId,
      'ngsw-bypass': true,
    };

    // Create a SSE request to monitor report progress
    this.sseService.get(
      `${this.selectedEndpoint.service}/v2/async-processing-monitor/${reportId}`,
      header,
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(timeout(180000))
      .subscribe(
        // On watching events
        (data: any) => {
          console.log(`Monitoring progress (${reportId})`, data);

          // If complete, means the processing is finished
          if (data.complete) {
            this.reportData = JSON.stringify(
              data.report,
              null,
              2,
            );

            this.reportProgress = {
              total: data.total,
              processed: data.processed,
              progress: 100,
            };

            this.emitSuccessMessage('Relatório completado com sucesso');

            // While is not completed, means is being processed
          } else if (data.total) {
            this.reportProgress = {
              total: data.total,
              processed: data.processed,
              progress: (data.processed * 100) / data.total,
            };
          }
        },
        // On error
        (error: any) => {
          console.error(`Monitoring error (${reportId})`, error);

          this.reportData = JSON.stringify(
            error?.data ? JSON.parse(error.data) : error,
            null,
            2,
          );

          this.emitErrorMessage('Houve um erro ao processar relatório');
        },
        // On finally
        () => {
          console.log(`Monitoring complete (${reportId})`);
        }
      );

    setTimeout(() => {
      const element = document.getElementById('reportProgress');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }, 500);
  }

  private async runPostRequest(endpointUrl: string, body: any, httpParams?: HttpParams): Promise<any> {
    this.isBusy = true;
    return lastValueFrom(
      this.apiService.post(
        endpointUrl,
        body,
        null,
        new HttpHeaders({
          Authorization: `Bearer ${this.authentication.token}`,
          'ContentType': 'application/json',
        }),
      ),
    )
      .then((data) => {
        return data;
      })
      .catch(error => this.handleError(error))
      .finally(() => this.isBusy = false);
  }

  private async runGetRequest(endpointUrl: string, httpParams?: HttpParams): Promise<any> {
    this.isBusy = true;
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
      .finally(() => this.isBusy = false);
  }

  private populateReports() {
    try {
      this.endpoints = [
        {
          name: 'Apuração de Ponto',
          service: ApiServiceUrl.TIMESHEET,
          path: '/external/v1/report/timesheet',
          docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#4c1caa91-4996-4134-97ed-885caa0faa60',
          parameters: [
            ...this.generatePeriodParameters(),
            ...this.generateIncludeFiredParameters(),
            {
              name: 'showSummary',
              type: 'BOOLEAN',
              description: 'Indica se os totais dos cálculos devem ser exibidos no resultado',
            },
            {
              name: 'showPartialAllowances',
              type: 'BOOLEAN',
              description: 'Indica se os abonos parciais devem ser exibidos no resultado',
            },
            ...this.generateColumnsParameters(),
            ...this.generateFiltersParameters(),
          ],
        },

        {
          name: 'Teste 2',
          service: ApiServiceUrl.TIMESHEET,
          path: '/external/v1/report/timesheet',
          docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#ea3d6a75-82a2-4df7-8a84-3486eae6f68e',
          parameters: [],
        },
      ];
    } catch (err) {
      console.error(err);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribeParameters.next();
    this.ngUnsubscribeParameters.complete();

    super.ngOnDestroy();
  }

  protected handleBadRequestError(error: any): any | void {
    this.emitErrorMessage(ErrorHelper.parseMessage(error), 10000);
    return { error: ErrorHelper.parseMessage(error) };
  }

  protected handleNonDefinedError(error: any): any | void {
    this.emitErrorMessage(ErrorHelper.parseMessage(error), 10000);
    return { error: ErrorHelper.parseMessage(error) };
  }

  protected handleDatabaseError(error: any): any | void {
    this.emitErrorMessage(ErrorHelper.parseMessage(error), 10000);
    return { error: ErrorHelper.parseMessage(error) };
  }

  private generatePeriodParameters() {
    return [
      {
        name: 'startAt',
        type: 'START_DATE_PICKER',
        description: 'Período inicial da consulta (obrigatório)',
        placeholder: 'DD/MM/YYYY',
        parser: (date: Date) => {
          return dayjs(date).format('YYYY-MM-DD');
        },
        setInitialValue: () => {
          if (sessionStorage.getItem('startAtParam')) {
            return dayjs(sessionStorage.getItem('startAtParam')).toDate();
          }

          return null;
        },
        onChange: (date?: Date) => {
          if (date) {
            sessionStorage.setItem('startAtParam', dayjs(date).format('YYYY-MM-DD'));
          } else {
            sessionStorage.removeItem('startAtParam');
          }
        },
      },
      {
        name: 'endAt',
        type: 'END_DATE_PICKER',
        description: 'Período final da consulta (obrigatório)',
        placeholder: 'DD/MM/YYYY',
        parser: (date: Date) => {
          return dayjs(date).format('YYYY-MM-DD');
        },
        setInitialValue: () => {
          if (sessionStorage.getItem('endAtParam')) {
            return dayjs(sessionStorage.getItem('endAtParam')).toDate();
          }

          return null;
        },
        onChange: (date: Date) => {
          if (date) {
            sessionStorage.setItem('endAtParam', dayjs(date).format('YYYY-MM-DD'));
          } else {
            sessionStorage.removeItem('endAtParam');
          }
        },
      },
    ];
  }

  private generateIncludeFiredParameters() {
    return [
      {
        name: 'includeFiredEmployees',
        type: 'BOOLEAN',
        description: 'Indica se empregados desligados devem ser incluídos na consulta',
      },
    ];
  }

  private generateColumnsParameters() {
    return [
      {
        name: 'columns',
        type: 'MULTISELECT',
        placeholder: 'Clique aqui para selecionar colunas',
        description: 'Lista dos nomes das colunas com os valores dos cálculos a serem exibidos. Quando vazio, usa as colunas selecionadas na configuração',
        onStart: () => {
          const value = sessionStorage.getItem(`columnsOptions_${this.authentication?.licenseId}`);
          if (value) {
            this.selectOptions['columns'] = JSON.parse(value);
          }
        },
        setInitialValue: () => {
          if (sessionStorage.getItem(`columnsParams_${this.authentication?.licenseId}`)) {
            return JSON.parse(sessionStorage.getItem(`columnsParams_${this.authentication?.licenseId}`));
          }
          return null;
        },
        onChange: (data: any) => {
          if (data) {
            sessionStorage.setItem(`columnsParams_${this.authentication?.licenseId}`, JSON.stringify(data));
          } else {
            sessionStorage.removeItem(`columnsParams_${this.authentication?.licenseId}`);
          }
        },
        onLoadOptions: async () => {
          this.selectOptions['columns'] = await this.runGetRequest(`${ApiServiceUrl.TIMESHEET}/external/v1/calculation-columns`)
            .then((data: any) => {
              return data.map((x: any) => {
                return {
                  id: x.code,
                  name: x.name,
                };
              });
            })
            .catch((err) => { });

          sessionStorage.setItem(`columnsOptions_${this.authentication?.licenseId}`, JSON.stringify(this.selectOptions['columns']));
        },
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#2f7675c2-08c7-4858-ba5d-5b02c2c6d3ee',
      },
    ];
  }

  private generateFiltersParameters() {
    return [
      {
        name: 'filters',
        type: 'DIALOG',
        description: 'Permite filtrar os empregados por diferentes parâmetros',
        placeholder: 'Clique no botão ao lado para selecionar',
        setInitialValue: () => {
          return null;
        },
        parser: (data?: string) => {
          return data ? JSON.parse(data) : null;
        },
        onOpen: () => {
          const activeFilters = [
            'employees',
            'companies',
            'departments',
            'roles',
            'groups',
            'structures',
            'schedules',
          ];

          const value = this.parametersFormGroup.get('filters')?.value;

          this.dialogService
            .openFullDialog<EmployeeFiltersComponent, DialogClosed<any>>(
              EmployeeFiltersComponent,
              true,
              {
                activeFilters,
                value: value ? JSON.parse(value) : null,
              }
            )
            .afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
              if (result.changed) {
                this.parametersFormGroup.get('filters').setValue(
                  result.data ? JSON.stringify(result.data, null, 2) : null,
                );
              }
            });
        },
      },
    ];
  }
}
