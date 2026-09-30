import { Component, OnInit } from '@angular/core';

import { HttpHeaders } from '@angular/common/http';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { lastValueFrom, takeUntil } from 'rxjs';
import { ApiServiceUrl } from '../../core/enums/api-service-url.enum';
import { Auth } from '../../core/models/auth.model';
import { AlertService } from '../../core/services/alert.service';
import { ApiService } from '../../core/services/api.service';
import { DialogService } from '../../core/services/dialog.service';
import { AuthStore } from '../../core/stores/auth.store';
import { ErrorHelper } from '../../core/utils/error-helper';
import { AppComponent } from '../../shared/views/extendable/app-component';
import { ImportEndpointParams } from './interfaces/import-endpoint-params.interface';

@Component({
  selector: 'app-import',
  templateUrl: 'import.component.html'
})
export class ImportComponent extends AppComponent implements OnInit {
  // List of import endpoint parameters
  endpoints: ImportEndpointParams[] = [];

  // Selected endpoint
  selectedEndpoint: ImportEndpointParams;

  // Save authentication data
  authentication: Auth;

  // Import (POST) request
  requestUrl: string;
  requestResult: any;
  isSending = false;

  // Import fields (GET) request
  importFieldsResult: any;
  isLoadingImportFields = false;

  // Shown along with the import fields request result
  showImportFieldTypes = false;
  importFieldTypes = [
    {
      type: 'string',
      name: 'Texto',
      description: 'Texto livre',
      defaultValue: 'Pode ter tamanho máximo (maxLength).',
    },
    {
      type: 'integer',
      name: 'Número inteiro',
      description: 'Número inteiro',
      defaultValue: 'Somente números sem sinal e sem casas decimais.',
    },
    {
      type: 'boolean',
      name: 'Verdadeiro ou falso',
      description: 'Valor lógico.',
      defaultValue: 'Aceita 1 e 0 ou true e false',
    },
    {
      type: 'uuid',
      name: 'Identificador (UUID)',
      description: 'Identificador único no formato UUID v4.',
      defaultValue: 'Deve ser um UUID v4 válido',
    },
    {
      type: 'dateOnly',
      name: 'Data',
      description: 'Data sem hora.',
      defaultValue: 'Data deve ser no formato 0000-00-00 (AAAA-MM-DD)',
    },
    {
      type: 'custom',
      name: 'Lista de opções',
      description: 'Valor restrito a uma lista fixa que o backend envia em allowedCustomOptions.',
      defaultValue: 'Deve ser enviado somente "value" da lista de opções',
    },
    {
      type: 'model',
      name: 'Seleção',
      description: 'Referência a um registro que já existe no sistema pelo ID ou nome. Pode aceitar mais de um valor (multiple).',
      defaultValue: 'Quando for ID, deve ser um UUID v4 válido; Quando for nome, deve ser um texto que exista no sistema',
    },
    {
      type: 'modelAppendable',
      name: 'Seleção (Auto cadastro)',
      description: 'Também referencia um registro pelo ID ou nome. Porém, quando não existe um novo registro seria criado automaticamente.',
      defaultValue: 'Quando for ID, deve ser um UUID v4 válido; Quando for nome, deve ser um texto que exista no sistema',
    },
  ];

  bodyFormGroup = new UntypedFormGroup({
    body: new UntypedFormControl(),
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

  get isBusy(): boolean {
    return this.isSending || this.isLoadingImportFields;
  }

  ngOnInit(): void {
    this.populateEndpoints();
  }

  onEndpointChange() {
    this.requestResult = null;
    this.requestUrl = null;
    this.importFieldsResult = null;
    this.showImportFieldTypes = false;
    this.bodyFormGroup.reset({
      body: this.selectedEndpoint ? JSON.stringify(this.selectedEndpoint.bodyExample, null, 2) : null,
    });
  }

  async onLoadImportFields() {
    if (!this.selectedEndpoint) {
      return;
    }

    const importFieldsEndpoint = `${this.selectedEndpoint.service}${this.selectedEndpoint.importFieldsPath}`;

    this.importFieldsResult = null;
    this.showImportFieldTypes = false;
    this.isLoadingImportFields = true;

    const result = await this.runRequest(
      this.apiService.get(importFieldsEndpoint, null, this.generateHeaders()),
    ).finally(() => this.isLoadingImportFields = false);

    this.importFieldsResult = JSON.stringify(result || {}, null, 2);
    this.showImportFieldTypes = !!result && !result.error;
  }

  async onSend() {
    if (!this.selectedEndpoint) {
      return;
    }

    let body: any;

    try {
      body = JSON.parse(this.bodyFormGroup.getRawValue().body || '');
    } catch {
      this.emitWarningMessage('Informe um JSON válido no corpo da requisição');
      return;
    }

    const importEndpoint = `${this.selectedEndpoint.service}${this.selectedEndpoint.path}`;

    this.requestUrl = importEndpoint;
    this.requestResult = null;
    this.isSending = true;

    const result = await this.runRequest(
      this.apiService.post(importEndpoint, body, null, this.generateHeaders()),
      data => this.emitImportResultMessage(data),
    ).finally(() => this.isSending = false);

    this.requestResult = JSON.stringify(result || {}, null, 2);
  }

  private async runRequest(
    request: ReturnType<ApiService['get']>,
    onSuccess: (data: any) => void = () => this.emitSuccessMessage('Requisição concluída com sucesso'),
  ): Promise<any> {
    if (!this.authentication?.token) {
      this.emitWarningMessage('Autentique-se para continuar');
      return;
    }

    return lastValueFrom(request)
      .then((data) => {
        onSuccess(data);
        return data;
      })
      .catch(error => this.handleError(error));
  }

  // Emits a message according to the status of each imported record
  private emitImportResultMessage(data: any) {
    const items: any[] = Array.isArray(data) ? data : [];
    const invalidCount = items.filter(item => item?.status === 'invalid').length;

    if (invalidCount && invalidCount === items.length) {
      this.emitErrorMessage('Requisição inválida');
    } else if (invalidCount) {
      this.emitWarningMessage('Requisição concluída com alguns erros');
    } else {
      this.emitSuccessMessage('Requisição concluída com sucesso');
    }
  }

  private generateHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authentication?.token}`,
      'Content-Type': 'application/json',
    });
  }

  private populateEndpoints() {
    this.endpoints = [
      {
        name: 'Empregados',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/employees',
        importFieldsPath: '/external/v1/employees/import-fields',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#489c4506-8f0f-7308-aac9-10c3b2bee223',
        importFieldsDocUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#ae591606-95af-b204-cc3c-80fffeac1089',
        bodyExample: [
          {
            name: 'Nome do Empregado',
            cpf: '000.000.000-00',
            company: 'ID ou nome da empresa',
            schedule: 'ID ou nome do horário',
            hiringAt: '2025-01-01',
          },
        ],
      },
      {
        name: 'Empresas',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/companies',
        importFieldsPath: '/external/v1/companies/import-fields',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#558995b7-ae61-2a5d-421c-092245090d17',
        importFieldsDocUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#e68a9fc4-be5e-1a9a-d6af-c712601c74fd',
        bodyExample: [
          {
            companyType: 'company',
            name: 'Nome Fantasia',
            legalName: 'Razão Social',
            nationalIdentity: '00.000.000/0001-00',
            startedAt: '2025-01-01',
          },
        ],
      },
      {
        name: 'Departamentos',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/departments',
        importFieldsPath: '/external/v1/departments/import-fields',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#c5f2ad3d-5335-a6a3-832c-8f8a09fec76d',
        importFieldsDocUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#eb224d63-da05-9484-7beb-a5fe91d009dc',
        bodyExample: [
          {
            name: 'Nome do Departamento',
          },
        ],
      },
      {
        name: 'Funções',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/roles',
        importFieldsPath: '/external/v1/roles/import-fields',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#845ae098-ccff-0b95-6d14-86810c0bf090',
        importFieldsDocUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#3a65d8d5-e35b-9209-e414-913d0e221482',
        bodyExample: [
          {
            name: 'Nome da Função',
          },
        ],
      },
      {
        name: 'Estruturas',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/structures',
        importFieldsPath: '/external/v1/structures/import-fields',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#7d32acec-d288-706b-d120-967c183c094e',
        importFieldsDocUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#ba2f2497-5a8f-e162-38e1-f5227871120e',
        bodyExample: [
          {
            name: 'Nome da Estrutura',
            prior: 'ID ou nome da estrutura superior (opcional)',
          },
        ],
      },
      {
        name: 'Grupos',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/groups',
        importFieldsPath: '/external/v1/groups/import-fields',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#a6210037-30fa-0020-39f6-73365dd0227a',
        importFieldsDocUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#b0817641-ad1e-b0b9-b007-30c58beda49d',
        bodyExample: [
          {
            name: 'Nome do Grupo',
          },
        ],
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
}
