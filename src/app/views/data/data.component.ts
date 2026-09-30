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
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AppComponent } from '../../shared/views/extendable/app-component';
import { DataEndpointParams } from './interfaces/data-endpoint-params.interface';

@Component({
  selector: 'app-data',
  templateUrl: 'data.component.html'
})
export class DataComponent extends AppComponent implements OnInit {
  // List of data endpoint parameters
  endpoints: DataEndpointParams[] = [];

  // Selected endpoint
  selectedEndpoint: DataEndpointParams;

  // Save authentication data
  authentication: Auth;

  // Import (POST) or delete (DELETE) request
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

  parametersFormGroup = new UntypedFormGroup({
    body: new UntypedFormControl(),
    id: new UntypedFormControl(),
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

  get selectedEndpointMethod(): string {
    return this.selectedEndpoint?.type === 'DELETE' ? 'DELETE' : 'POST';
  }

  ngOnInit(): void {
    this.populateEndpoints();
  }

  onEndpointChange() {
    this.requestResult = null;
    this.requestUrl = null;
    this.importFieldsResult = null;
    this.showImportFieldTypes = false;
    this.parametersFormGroup.reset({
      body: this.selectedEndpoint?.bodyExample ? JSON.stringify(this.selectedEndpoint.bodyExample, null, 2) : null,
      id: null,
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

    switch (this.selectedEndpoint.type) {
      case 'IMPORT':
        await this.sendImport();
        break;

      case 'DELETE':
        await this.sendDelete();
        break;
    }
  }

  private async sendImport() {
    let body: any;

    try {
      body = JSON.parse(this.parametersFormGroup.getRawValue().body || '');
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

  private async sendDelete() {
    const id = (this.parametersFormGroup.getRawValue().id || '').trim();

    if (!id) {
      this.emitWarningMessage('Informe um ID');
      return;
    }

    if (!this.authentication?.token) {
      this.emitWarningMessage('Autentique-se para continuar');
      return;
    }

    const confirmed = await lastValueFrom(this.dialogService.openDialog(ConfirmationDialogComponent, {
      data: {
        message: `Os dados serão excluídos permanentemente do sistema. Deseja realmente excluir o registro <b>${id}</b>?`,
      },
      maxWidth: '90dvw',
      panelClass: 'confirmation-dialog',
      closeOnNavigation: false,
    })
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe)));

    if (!confirmed) {
      return;
    }

    const deleteEndpoint = `${this.selectedEndpoint.service}${this.selectedEndpoint.path}`
      .replace('{id}', encodeURIComponent(id));

    this.requestUrl = deleteEndpoint;
    this.requestResult = null;
    this.isSending = true;

    const result = await this.runRequest(
      this.apiService.delete(deleteEndpoint, null, this.generateHeaders()),
    ).finally(() => this.isSending = false);

    this.requestResult = JSON.stringify(result ?? {}, null, 2);
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
      // Employees
      {
        type: 'IMPORT',
        name: 'Empregados (Importar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/employees',
        description: 'Importa empregados registrados.',
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
        type: 'DELETE',
        name: 'Empregados (Excluir)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/employees/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#997ee62f-0b74-f094-14ef-4a69ab3621d4',
        description: 'Exclui empregado registrado por ID. Exclui o registro e, quando não restar outro registro, também o empregado. '
          + 'Não é possível excluir registro com batidas, abonos parciais, justificativas de faltas, documentos, '
          + 'atribuído a ciclo de Banco de Horas ou a Conciliação de Marcações.',
      },
      // Companies
      {
        type: 'IMPORT',
        name: 'Empresas (Importar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/companies',
        description: 'Importa empresas.',
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
        type: 'DELETE',
        name: 'Empresas (Excluir)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/companies/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#f12d2202-de49-68e5-658c-881223a5ce44',
        description: 'Exclui empresa por ID. Não é possível excluir empresa com registros de empregados ou relacionada com equipamentos.',
      },
      // Departments
      {
        type: 'IMPORT',
        name: 'Departamentos (Importar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/departments',
        description: 'Importa departamentos.',
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
        type: 'DELETE',
        name: 'Departamentos (Excluir)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/departments/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#82283e48-5e7a-3f7f-2d20-403ebbf687ad',
        description: 'Exclui departamento por ID. Não é possível excluir departamento atribuído a registros de empregados.',
      },
      // Roles
      {
        type: 'IMPORT',
        name: 'Funções (Importar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/roles',
        description: 'Importa funções.',
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
        type: 'DELETE',
        name: 'Funções (Excluir)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/roles/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#851909e7-44f0-8082-a20d-35ec33f6a3d4',
        description: 'Exclui função por ID. Não é possível excluir função atribuída a registros de empregados.',
      },
      // Structures
      {
        type: 'IMPORT',
        name: 'Estruturas (Importar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/structures',
        description: 'Importa estruturas.',
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
        type: 'DELETE',
        name: 'Estruturas (Excluir)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/structures/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#6824aa29-1a61-114a-78e6-52b17e0d6370',
        description: 'Exclui estrutura por ID. Não é possível excluir estrutura que possui estruturas filhas ou que está atribuída a registros de empregados.',
      },
      // Groups
      {
        type: 'IMPORT',
        name: 'Grupos (Importar)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/groups',
        description: 'Importa grupos.',
        importFieldsPath: '/external/v1/groups/import-fields',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#a6210037-30fa-0020-39f6-73365dd0227a',
        importFieldsDocUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#b0817641-ad1e-b0b9-b007-30c58beda49d',
        bodyExample: [
          {
            name: 'Nome do Grupo',
          },
        ],
      },
      {
        type: 'DELETE',
        name: 'Grupos (Excluir)',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/groups/{id}',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#4ca8cfe0-2ada-716a-e2d3-2c3a727015ff',
        description: 'Exclui grupo por ID. Não é possível excluir grupo atribuído a registros de empregados.',
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
