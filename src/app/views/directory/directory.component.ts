import { Component, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs';
import { ApiServiceUrl } from '../../core/enums/api-service-url.enum';
import { Auth } from '../../core/models/auth.model';
import { AlertService } from '../../core/services/alert.service';
import { DialogService } from '../../core/services/dialog.service';
import { AuthStore } from '../../core/stores/auth.store';
import { ViewComponent } from '../../shared/views/extendable/view-component';

type EndpointQueryParams = {
  name: string;
  type: string;
  description?: string;
  placeholder?: string;
}

type EndpointParams = {
  type: string;
  name: string;
  service: ApiServiceUrl;
  endpoint: string;
  queryParams?: EndpointQueryParams[],
};

@Component({
  selector: 'app-directory',
  templateUrl: 'directory.component.html'
})
export class DirectoryComponent extends ViewComponent implements OnInit {
  endpoint: EndpointParams;

  endpoints: EndpointParams[] = [];

  authentication: Auth;

  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
    private authStore: AuthStore,
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
    console.log('===>', this.endpoint);
  }

  onSend() {

  }

  populateEndpoints() {
    const paginationQueryParamsFragment = [
      {
        name: 'limit',
        type: 'NUMBER',
        description: 'Limite de resultados por página (Opcional)',
      },
      {
        name: 'page',
        type: 'NUMBER',
        description: 'Página a ser retornada (Opcional)',
      },
    ];

    this.endpoints = [
      {
        type: 'LIST',
        name: 'Empregados (Listar)',
        service: ApiServiceUrl.TIMESHEET,
        endpoint: '/external/v1/employees',
        queryParams: [
          ...paginationQueryParamsFragment,
          {
            name: 'pis',
            type: 'STRING',
            description: 'Quando informado, pesquisa empregados por PIS (Opcional) (Aceita valores com E sem caracteres de formatação)',
          },
          {
            name: 'cpf',
            type: 'STRING',
            description: 'Quando informado, pesquisa empregados por CPF (Opcional) (Aceita valores com E sem caracteres de formatação)',
          },
          {
            name: 'company',
            type: 'STRING',
            description: 'Quando informado, pesquisa empregados por CNPJ/CPF (Opcional) (Aceita valores com E sem caracteres de formatação)',
          },
        ],
      },
      /*
      {
        name: 'Empregados (Retornar por ID)',
      },
      {
        name: 'Empresas (Listar)',
      },
      {
        name: 'Empresas (Retornar por ID)',
      },
      {
        name: 'Horários (Listar)',
      },
      {
        name: 'Horários (Retornar por ID)',
      },
      {
        name: 'Configurações de Cálculos (Listar)',
      },
      {
        name: 'Configurações de Cálculos (Retornar por ID)',
      },
      {
        name: 'Configurações de DSR (Listar)',
      },
      {
        name: 'Configurações de DSR (Retornar por ID)',
      },
      {
        name: 'Configurações de Extras Diárias (Listar)',
      },
      {
        name: 'Configurações de Extras Diárias (Retornar por ID)',
      },
      {
        name: 'Configurações de Extras Mensais (Listar)',
      },
      {
        name: 'Configurações de Extras Mensais (Retornar por ID)',
      },
      {
        name: 'Faixas de Extras (Listar)',
      },
      {
        name: 'Faixas de Extras (Retornar por ID)',
      },
      {
        name: 'Departamentos (Listar)',
      },
      {
        name: 'Departamentos (Retornar por ID)',
      },
      {
        name: 'Funções (Listar)',
      },
      {
        name: 'Funções (Retornar por ID)',
      },
      {
        name: 'Estruturas (Listar)',
      },
      {
        name: 'Estruturas (Retornar por ID)',
      },
      {
        name: 'Grupos (Listar)',
      },
      {
        name: 'Grupos (Retornar por ID)',
      },
      {
        name: 'Justificativas (Listar)',
      },
      {
        name: 'Justificativas (Retornar por ID)',
      },
      {
        name: 'Coletores (Listar)',
      },
      {
        name: 'Coletores (Retornar por ID)',
      },
      {
        name: 'Afastamentos (Listar)',
      },
      {
        name: 'Afastamentos (Retornar por ID)',
      },
      */
    ];
  }
}
