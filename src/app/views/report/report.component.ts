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
import { HourExtractConditionComponent } from './hour-extract-condition/hour-extract-condition-filters.component';
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
              label: this.selectedEndpoint?.reportProgressLabel || '',
            };

            this.emitSuccessMessage('Relatório completado com sucesso');

            // While is not completed, means is being processed
          } else if (data.total) {
            this.reportProgress = {
              total: data.total,
              processed: data.processed,
              progress: (data.processed * 100) / data.total,
              label: this.selectedEndpoint?.reportProgressLabel || '',
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

          this.emitErrorMessage('Houve um erro ao processar relatório. Verifique na resposta a descrição do erro');
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
    if (!this.authentication?.token) {
      this.emitWarningMessage('Autentique-se para continuar');
      return;
    }

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
    if (!this.authentication?.token) {
      this.emitWarningMessage('Autentique-se para continuar');
      return;
    }

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
          reportProgressLabel: 'Empregados sendo analisados',
        },

        {
          name: 'Extrato de Horas',
          service: ApiServiceUrl.TIMESHEET,
          path: '/external/v1/report/hour-extract',
          docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#eef7cd44-c7e3-4deb-a7f8-5eae9490f497',
          parameters: [
            ...this.generatePeriodParameters(),
            ...this.generateIncludeFiredParameters(),
            {
              name: 'showSummary',
              type: 'BOOLEAN',
              description: 'Indica se os totais dos cálculos devem ser exibidos no resultado',
            },
            ...this.generateColumnsParameters(),
            {
              name: 'condition',
              type: 'DIALOG',
              description: 'Permite filtrar os dias a serem considerados por uma condição específica',
              placeholder: 'Clique no botão ao lado para configurar',
              setInitialValue: () => {
                return null;
              },
              parser: (data?: string) => {
                return data ? JSON.parse(data) : null;
              },
              onOpen: () => {
                const value = this.parametersFormGroup.get('condition')?.value;

                this.dialogService
                  .openFullDialog<HourExtractConditionComponent, DialogClosed<any>>(
                    HourExtractConditionComponent,
                    true,
                    {
                      value: value ? JSON.parse(value) : null,
                    }
                  )
                  .afterClosed()
                  .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe(result => {
                    if (result.changed) {
                      this.parametersFormGroup.get('condition').setValue(
                        result.data ? JSON.stringify(result.data, null, 2) : null,
                      );
                    }
                  });
              },
            },
            ...this.generateFiltersParameters(),
          ],
          reportProgressLabel: 'Empregados sendo analisados',
        },

        {
          name: 'Ocorrências',
          service: ApiServiceUrl.TIMESHEET,
          path: '/external/v1/report/occurrence',
          docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#97fc3808-7699-4e9e-b2b3-c935e034b996',
          parameters: [
            ...this.generatePeriodParameters(),
            ...this.generateIncludeFiredParameters(),
            {
              name: 'showSummary',
              type: 'BOOLEAN',
              description: 'Indica se os totais dos cálculos devem ser exibidos no resultado',
            },
            {
              name: 'showShiftColumns',
              type: 'BOOLEAN',
              description: 'Indica se as colunas com marcações devem ser exibidas',
            },
            {
              name: 'consecutiveConditionsDays',
              type: 'INTEGER',
              description: 'Define quantos dias consecutivos a ocorrência(s) deve acontecer para ser considerada. Se não for passado um valor, o padrão é 1',
              placeholder: 1,
            },
            ...this.generateColumnsParameters(),
            ...this.generateFiltersParameters(),
          ],
          reportProgressLabel: 'Empregados sendo analisados',
        },

        {
          name: 'Marcações Alocadas',
          service: ApiServiceUrl.TIMESHEET,
          path: '/external/v1/report/allocated-records',
          docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#0474bc88-39e1-4ac5-b4ee-ecca42cda3e1',
          parameters: [
            ...this.generatePeriodParameters(),
            ...this.generateIncludeFiredParameters(),
            {
              name: 'showRecordCollector',
              type: 'BOOLEAN',
              description: 'Indica se o ID do coletor de origem da marcação deve ser exibido no resultado',
            },
            {
              name: 'showRecordOrigin',
              type: 'BOOLEAN',
              description: 'Indica se a origem da marcação deve ser exibida no resultado',
            },
            ...this.generateFiltersParameters(
              [
                'collectors',
                'employees',
                'companies',
                'departments',
                'roles',
                'groups',
                'structures',
                'schedules',
              ],
            ),
          ],
          reportProgressLabel: 'Linhas de dias sendo analisados',
        },

        {
          name: 'Localização das Marcações',
          service: ApiServiceUrl.TIMESHEET,
          path: '/external/v1/report/record-locations',
          docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#720125e3-0783-416f-8035-d5a7b579f020',
          parameters: [
            ...this.generatePeriodParameters(),
            ...this.generateIncludeFiredParameters(),
            ...this.generateFiltersParameters(
              [
                'collectors',
                'employees',
                'companies',
                'departments',
                'roles',
                'groups',
                'structures',
                'schedules',
              ],
            ),
          ],
          reportProgressLabel: 'Linhas de dias sendo analisados',
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
          if (localStorage.getItem('startAtParam')) {
            return dayjs(localStorage.getItem('startAtParam')).toDate();
          }

          return null;
        },
        onChange: (date?: Date) => {
          if (date) {
            localStorage.setItem('startAtParam', dayjs(date).format('YYYY-MM-DD'));
          } else {
            localStorage.removeItem('startAtParam');
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
          if (localStorage.getItem('endAtParam')) {
            return dayjs(localStorage.getItem('endAtParam')).toDate();
          }

          return null;
        },
        onChange: (date: Date) => {
          if (date) {
            localStorage.setItem('endAtParam', dayjs(date).format('YYYY-MM-DD'));
          } else {
            localStorage.removeItem('endAtParam');
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
          const value = localStorage.getItem(`columnsOptions_${this.authentication?.licenseId}`);
          if (value) {
            this.selectOptions['columns'] = JSON.parse(value);
          }
        },
        setInitialValue: () => {
          if (localStorage.getItem(`columnsParams_${this.authentication?.licenseId}`)) {
            return JSON.parse(localStorage.getItem(`columnsParams_${this.authentication?.licenseId}`));
          }
          return null;
        },
        onChange: (data: any) => {
          if (data) {
            localStorage.setItem(`columnsParams_${this.authentication?.licenseId}`, JSON.stringify(data));
          } else {
            localStorage.removeItem(`columnsParams_${this.authentication?.licenseId}`);
          }
        },
        onLoadOptions: async () => {
          this.selectOptions['columns'] = await this.runGetRequest(`${ApiServiceUrl.TIMESHEET}/external/v1/calculation-columns`)
            .then((data: any) => {
              return (data || []).map((x: any) => {
                return {
                  id: x.code,
                  name: x.name,
                };
              });
            })
            .catch((err) => { });

          if (this.selectOptions['columns']?.length) {
            localStorage.setItem(`columnsOptions_${this.authentication?.licenseId}`, JSON.stringify(this.selectOptions['columns']));
          }
        },
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#2f7675c2-08c7-4858-ba5d-5b02c2c6d3ee',
      },
    ];
  }

  private generateFiltersParameters(
    activeFilters = [
      'employees',
      'companies',
      'departments',
      'roles',
      'groups',
      'structures',
      'schedules',
    ],
  ) {
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
