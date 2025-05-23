import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../core/services/api.service';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { lastValueFrom, takeUntil } from 'rxjs';
import { ApiServiceUrl } from '../../core/enums/api-service-url.enum';
import { Auth } from '../../core/models/auth.model';
import { AlertService } from '../../core/services/alert.service';
import { DialogService } from '../../core/services/dialog.service';
import { AuthStore } from '../../core/stores/auth.store';
import { ErrorHelper } from '../../core/utils/error-helper';
import { ViewComponent } from '../../shared/views/extendable/view-component';
import { EndpointParams } from './interfaces/endpoint-params.interface';

@Component({
  selector: 'app-directory',
  templateUrl: 'directory.component.html'
})
export class DirectoryComponent extends ViewComponent implements OnInit {
  // List of endpoint parameters
  endpoints: EndpointParams[] = [];

  // Selected endpoint
  selectedEndpoint: EndpointParams;

  // Save authentication data
  authentication: Auth;

  requestUrl: string;
  requestResult: any;
  isBusy = false;

  parametersFormGroup = new UntypedFormGroup({
    param1: new UntypedFormControl(),
    param2: new UntypedFormControl(),
    param3: new UntypedFormControl(),
    param4: new UntypedFormControl(),
    param5: new UntypedFormControl(),
    param6: new UntypedFormControl(),
    param7: new UntypedFormControl(),
    param8: new UntypedFormControl(),
    param9: new UntypedFormControl(),
    param10: new UntypedFormControl(),
  });

  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
    private authStore: AuthStore,
    private apiService: ApiService,
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
    this.populateEndpoints();
  }

  onEndpointChangeChange() {
    this.requestResult = null;
    this.requestUrl = null;
    this.parametersFormGroup.reset();
  }

  async onSend() {
    if (!this.selectedEndpoint) {
      return;
    }

    this.requestUrl = null;
    this.requestResult = null;

    const rawParameters = this.parametersFormGroup.getRawValue();

    switch (this.selectedEndpoint.type) {
      case 'FIND_BY_ID':

        if (!rawParameters.param1) {
          this.emitWarningMessage('Informe um UUID');
          return;
        }

        const findByIdEndpoint = `${this.selectedEndpoint.service}${this.selectedEndpoint.path}`
          .replace('{id}', rawParameters.param1);

        this.requestUrl = findByIdEndpoint;

        this.requestResult = JSON.stringify(
          await this.runGetRequest(
            findByIdEndpoint,
          ) || {},
          null,
          2,
        );

        break;

      case 'LIST':
        const rawHttpParam: any = {};
        (this.selectedEndpoint.queryParams || []).forEach((param, index) => {
          if (rawParameters['param' + (index + 1)]) {
            rawHttpParam[param.name] = rawParameters['param' + (index + 1)];
          }
        });

        const httpParams = new HttpParams({
          fromObject: rawHttpParam,
        });

        this.requestUrl = `${this.selectedEndpoint.service}${this.selectedEndpoint.path}${httpParams.toString() ? '?' + httpParams.toString() : ''}`;

        this.requestResult = JSON.stringify(
          await this.runGetRequest(
            this.selectedEndpoint.service + this.selectedEndpoint.path,
            httpParams,
          ) || {},
          null,
          2,
        );

        break;
    }
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

  private populateEndpoints() {
    this.endpoints = [
      // Employees
      {
        type: 'LIST',
        name: 'Empregados (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/employees',
        queryParams: [
          ...this.generatePaginationParameters(),
          {
            name: 'pis',
            type: 'text',
            description: 'Quando informado, pesquisa empregados por PIS (Opcional) (Aceita valores com E sem caracteres de formatação)',
          },
          {
            name: 'cpf',
            type: 'text',
            description: 'Quando informado, pesquisa empregados por CPF (Opcional) (Aceita valores com E sem caracteres de formatação)',
          },
          {
            name: 'company',
            type: 'text',
            description: 'Quando informado, pesquisa empregados por CNPJ/CPF (Opcional) (Aceita valores com E sem caracteres de formatação)',
          },
        ],
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#ea3d6a75-82a2-4df7-8a84-3486eae6f68e',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Empregados (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/employees/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#4f7d955e-4c4f-41cb-8177-b8e7c3ded88d',
      },
      // Companies
      {
        type: 'LIST',
        name: 'Empresas (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/companies',
        queryParams: [
          ...this.generatePaginationParameters(),
          {
            name: 'nationalIdentity',
            type: 'text',
            description: 'Quando informado, pesquisa empresas com o identificador informado. Aceita CNPJ ou CPF (Aceita valores com E sem caracteres de formatação)',
          },
        ],
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#c6e37927-0050-40e5-a5a6-235da86d7fac',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Empresas (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/companies/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#cbeecce9-3d41-4c0c-b279-f7fa66f3df9f',
      },
      // Schedules
      {
        type: 'LIST',
        name: 'Horários (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/schedules',
        queryParams: this.generatePaginationParameters(),
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#64aabb3f-cc98-460d-a99d-4c41af888e8f',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Horários (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/schedules/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#50041153-6129-4d93-a200-b6fb4acfe748',
      },
      // Calculation settings
      {
        type: 'LIST',
        name: 'Configurações de Cálculos (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/calculation-settings',
        queryParams: this.generatePaginationParameters(),
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#957c315b-a309-41b3-927f-4bc7594cb65d',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Configurações de Cálculos (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/calculation-settings/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#19933cef-5c2f-4d33-b2b8-484fff281f0b',
      },
      // DSR settings
      {
        type: 'LIST',
        name: 'Configurações de DSR (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/dsr-settings',
        queryParams: this.generatePaginationParameters(),
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#b941792e-fdc4-47ac-b25f-ad821d402f18',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Configurações de DSR (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/dsr-settings/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#ba406a37-d79d-4fc6-bd85-e875f2a9e6ba',
      },
      // Overtime monthly settings
      {
        type: 'LIST',
        name: 'Configurações de Extras Mensais (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/overtime-monthly-settings',
        queryParams: this.generatePaginationParameters(),
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#72b3553f-be2c-4959-8f68-73a3c16d6caa',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Configurações de Extras Mensais (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/overtime-monthly-settings/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#71768d24-fa2d-44e4-a816-253b6baa062a',
      },
      // Overtime ranges
      {
        type: 'LIST',
        name: 'Faixas de Extras (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/overtime-ranges',
        queryParams: this.generatePaginationParameters(),
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#be7bb228-9983-477e-8fbf-3f059c0f266f',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Faixas de Extras (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/overtime-ranges/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#a619b38d-f923-4209-94a5-d67beafc41cf',
      },
      // Departments
      {
        type: 'LIST',
        name: 'Departamentos (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/departments',
        queryParams: this.generatePaginationParameters(),
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#e807ba1b-208e-43c8-865f-79e28a1b8975',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Departamentos (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/departments/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#bf10727c-14d4-4b3e-926d-f41ae17c234c',
      },
      // Roles
      {
        type: 'LIST',
        name: 'Funções (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/roles',
        queryParams: this.generatePaginationParameters(),
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#80b00e97-a7e3-4d79-914d-11464f1639bf',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Funções (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/roles/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#c5c993f2-f9a9-42fd-832c-db0d96913379',
      },
      // Structures
      {
        type: 'LIST',
        name: 'Estruturas (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/structures',
        queryParams: this.generatePaginationParameters(),
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#84c0f7c3-7bb8-41ca-9f01-088996cfe249',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Estruturas (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/structures/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#89ff3158-37ed-4bd4-9492-76abfe2de76f',
      },
      // Groups
      {
        type: 'LIST',
        name: 'Grupos (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/groups',
        queryParams: this.generatePaginationParameters(),
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#e1ecb000-f64e-4b68-9b67-2ab32b677302',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Grupos (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/groups/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#d498caaf-e637-4cd7-87b6-22f79b01bb78',
      },
      // Justifications
      {
        type: 'LIST',
        name: 'Justificativas (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/justifications',
        queryParams: this.generatePaginationParameters(),
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#b80f96d0-ac29-40f0-9107-b4f09d21fd77',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Justificativas (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/justifications/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#490a9b8d-d7c8-42eb-bb50-862dee372e38',
      },
      // Collectors
      {
        type: 'LIST',
        name: 'Coletores (Listar)',
        service: ApiServiceUrl.COLLECTOR,
        path: '/external/v1/collectors',
        queryParams: this.generatePaginationParameters(),
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#cbb5b642-6ef2-404b-81cc-3415f5d519aa',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Coletores (Retornar por ID)',
        service: ApiServiceUrl.COLLECTOR,
        path: '/external/v1/collectors/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#327450e1-69a1-4fb6-ad37-dddf4bb61cf5',
      },
      // Times Off
      {
        type: 'LIST',
        name: 'Afastamentos (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/times-off',
        queryParams: this.generatePaginationParameters(),
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#1dc4ba7e-2248-4e85-b1ff-a170d9cd3e4b',
      },
      {
        type: 'FIND_BY_ID',
        name: 'Afastamentos (Retornar por ID)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/times-off/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#986c8714-3199-4399-a578-0bc6eae3a2cd',
      },
      // Calculation Columns
      {
        type: 'LIST',
        name: 'Colunas de Cálculos (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/calculation-columns',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#2f7675c2-08c7-4858-ba5d-5b02c2c6d3ee',
      },
    ];
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

  private generatePaginationParameters() {
    return [
      {
        name: 'limit',
        type: 'number',
        description: 'Limite de resultados por página (Opcional)',
      },
      {
        name: 'page',
        type: 'number',
        description: 'Página a ser retornada (Opcional)',
      },
    ];
  }
}
