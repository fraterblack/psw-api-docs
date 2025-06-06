import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { OccurrenceConditionBuilderComponent } from './occurrence-condition-builder/occurrence-condition-builder.component';

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
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AppComponent } from '../../shared/views/extendable/app-component';
import { AbsenteeismConditionComponent } from './absenteeism-condition/absenteeism-condition.component';
import { BankedHourExtractConditionComponent } from './banked-hour-extract-condition/banked-hour-extract-condition.component';
import { EmployeeFiltersComponent } from './employee-filters/employee-filters.component';
import { HourExtractConditionComponent } from './hour-extract-condition/hour-extract-condition.component';
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
  isLoadOptionsBusy = false;

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
        let parsedValue = param.parser ? param.parser(paramValue) : paramValue;

        if (param.beforeSend) {
          try {
            parsedValue = await param.beforeSend(parsedValue);
          } catch (err) {
            return;
          }
        }

        body[param.name] = parsedValue;
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
      null,
      (active: boolean) => this.isBusy = active,
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

          setTimeout(() => {
            const element = document.getElementById('reportProgress');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }
          }, 500);
        }
      );

    setTimeout(() => {
      const element = document.getElementById('reportProgress');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }, 500);
  }

  private async runPostRequest(
    endpointUrl: string,
    body: any,
    httpParams?: HttpParams,
    onLoadingCallback?: (active: boolean) => void,
  ): Promise<any> {
    if (!this.authentication?.token) {
      this.emitWarningMessage('Autentique-se para continuar');
      return;
    }

    (onLoadingCallback || new Function())(true);
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
      .finally(() => (onLoadingCallback || new Function())(false));
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

    (onLoadingCallback || new Function())(true);
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
            ...this.generateColumnsParameters(),
            {
              name: 'conditions',
              type: 'DIALOG',
              description: 'Permite filtrar os dias a serem considerados por condições específicas',
              placeholder: 'Clique no botão ao lado para configurar',
              setInitialValue: () => {
                return null;
              },
              parser: (data?: string) => {
                return data ? JSON.parse(data) : null;
              },
              onOpen: () => {
                const value = this.parametersFormGroup.get('conditions')?.value;

                this.dialogService
                  .openFullDialog<OccurrenceConditionBuilderComponent, DialogClosed<any>>(
                    OccurrenceConditionBuilderComponent,
                    true,
                    {
                      value: value ? JSON.parse(value) : null,
                    }
                  )
                  .afterClosed()
                  .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe(result => {
                    if (result.changed) {
                      this.parametersFormGroup.get('conditions').setValue(
                        result.data ? JSON.stringify(result.data, null, 2) : null,
                      );
                    }
                  });
              },
            },
            {
              name: 'consecutiveConditionsDays',
              type: 'INTEGER',
              description: 'Define quantos dias consecutivos a ocorrência(s) deve acontecer para ser considerada. Se não for passado um valor, o padrão é 1',
              placeholder: 1,
            },
            ...this.generateFiltersParameters(),
          ],
          reportProgressLabel: 'Empregados sendo analisados',
        },

        {
          name: 'Extrato de Banco de Horas',
          description: 'Este relatório depende da funcionalidade Banco de Horas habilitada no sistema',
          service: ApiServiceUrl.TIMESHEET,
          path: '/external/v1/report/banked-hour-extract',
          docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#8c33a990-621d-40e1-b914-d492403ff03c',
          parameters: [
            ...this.generatePeriodParameters(),
            ...this.generateIncludeFiredParameters(),
            {
              name: 'showSummary',
              type: 'BOOLEAN',
              description: 'Indica se os totais dos cálculos devem ser exibidos no resultado',
            },
            {
              name: 'condition',
              type: 'DIALOG',
              description: 'Permite filtrar os saldos de BH por uma condição específica',
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
                  .openFullDialog<BankedHourExtractConditionComponent, DialogClosed<any>>(
                    BankedHourExtractConditionComponent,
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
          name: 'Absenteísmo',
          description: 'Este relatório depende da funcionalidade Absenteísmo habilitada no sistema',
          service: ApiServiceUrl.TIMESHEET,
          path: '/external/v1/report/absenteeism',
          docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#e3ae0d9a-187c-412b-b717-624b341998e2',
          parameters: [
            ...this.generatePeriodParameters(),
            ...this.generateIncludeFiredParameters(),
            {
              name: 'showSummary',
              type: 'BOOLEAN',
              description: 'Indica se os totais dos cálculos devem ser exibidos no resultado',
            },
            {
              name: 'showDetailedJustifications',
              type: 'BOOLEAN',
              description: 'Mostra os valores de ausência para cada justificativa',
            },
            {
              name: 'showOnlyEmployeesWithAbsence',
              type: 'BOOLEAN',
              description: 'Mostra somente empregados com alguma ausência',
            },
            {
              name: 'percentagePlaces',
              type: 'SELECT',
              description: 'Casas Decimais a serem usadas na % Ausência',
              setInitialValue: () => {
                if (localStorage.getItem(`absenteeismPercentagePlaces_${this.authentication?.licenseId}`)) {
                  return JSON.parse(localStorage.getItem(`absenteeismPercentagePlaces_${this.authentication?.licenseId}`));
                }

                return 2;
              },
              parser: (data?: string) => {
                return parseInt(data || '2', 10);
              },
              onStart: () => {
                this.selectOptions['percentagePlaces'] = [
                  {
                    id: 0,
                    name: 0,
                  },
                  {
                    id: 1,
                    name: 1,
                  },
                  {
                    id: 2,
                    name: 2,
                  },
                  {
                    id: 3,
                    name: 3,
                  },
                  {
                    id: 4,
                    name: 4,
                  },
                  {
                    id: 5,
                    name: 5,
                  },
                ];
              },
              onChange: (data?: number) => {
                localStorage.setItem(`absenteeismPercentagePlaces_${this.authentication?.licenseId}`, JSON.stringify(data));
              },
            },
            {
              name: 'condition',
              type: 'DIALOG',
              description: 'Permite filtrar ausências por uma condição específica',
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
                  .openFullDialog<AbsenteeismConditionComponent, DialogClosed<any>>(
                    AbsenteeismConditionComponent,
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
              beforeSend: async (value?: any) => {
                const condition = JSON.parse(this.parametersFormGroup.get('condition')?.value || '{}');
                const showDetailedJustifications = this.parametersFormGroup.get('showDetailedJustifications')?.value;

                if (showDetailedJustifications) {
                  if (condition?.type === 'disconsiderWithJustification') {
                    const result = await lastValueFrom(this.dialogService.openDialog(ConfirmationDialogComponent, {
                      data: {
                        message: 'Não é possível selecionar <b>disconsiderWithJustification</b> em <i>condition->type</i> com o parâmetro<br> <i>showDetailedJustifications</i> marcado. Gostaria de continuar sem a condição?',
                      },
                      maxWidth: '90dvw',
                      panelClass: 'confirmation-dialog',
                      closeOnNavigation: false,
                    })
                      .afterClosed()
                      .pipe(takeUntil(this.ngUnsubscribe)));

                    if (result) {
                      return Promise.resolve(null);
                    } else {
                      return Promise.reject(null);
                    }
                  }

                  if (condition?.ignoreBHAbsence) {
                    const result = await lastValueFrom(this.dialogService.openDialog(ConfirmationDialogComponent, {
                      data: {
                        message: 'Não é possível marcar <i>condition->ignoreBHAbsence</i> com o parâmetro<br> <i>showDetailedJustifications</i> marcado. Gostaria de continuar sem a condição?',
                      },
                      maxWidth: '90dvw',
                      panelClass: 'confirmation-dialog',
                      closeOnNavigation: false,
                    })
                      .afterClosed()
                      .pipe(takeUntil(this.ngUnsubscribe)));

                    if (result) {
                      return Promise.resolve(null);
                    } else {
                      return Promise.reject(null);
                    }
                  }
                }

                return Promise.resolve(value);
              },
            },
            ...this.generateFiltersParameters(),
          ],
          reportProgressLabel: '',
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
          this.selectOptions['columns'] = await this.runGetRequest(
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
