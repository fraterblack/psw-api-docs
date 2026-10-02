import { Component } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
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
import { EndpointParams } from '../directory/interfaces/endpoint-params.interface';

@Component({
  selector: 'app-rep-p-data',
  templateUrl: 'rep-p-data.component.html'
})
export class RepPDataComponent extends AppComponent {
  // Single endpoint of the view
  endpoint: EndpointParams = {
    type: 'LIST',
    name: 'Exportar dados REP-P',
    service: ApiServiceUrl.REP_P_REPORT,
    path: '/external/v1/arp/data',
    queryParams: [
      {
        name: 'key',
        type: 'text',
        description: 'Chave de conexão com o REP. É propriedade "keyRepP" retornada na consulta por coletores (Obrigatório)',
      },
      {
        name: 'startAt',
        type: 'text',
        description: 'Data de gravação inicial (Opcional). Formatos: AAAA-MM-DD (início do dia) ou AAAA-MM-DDThh:mm:ss',
        placeholder: '2026-01-01',
      },
      {
        name: 'endAt',
        type: 'text',
        description: 'Data de gravação final (Opcional). Formatos: AAAA-MM-DD (fim do dia) ou AAAA-MM-DDThh:mm:ss',
        placeholder: '2026-01-31T23:59:59',
      },
      {
        name: 'startNsr',
        type: 'number',
        description: 'NSR inicial, inclusivo (Opcional)',
      },
      {
        name: 'endNsr',
        type: 'number',
        description: 'NSR final, inclusivo (Opcional)',
      },
      {
        name: 'cpf',
        type: 'text',
        description: 'CPFs separados por vírgula, máximo de 30 (Opcional) (Aceita valores com E sem caracteres de formatação). '
          + 'Retorna somente registros dos tipos 5 e 7, portanto a sequência de NSR não será contínua',
        placeholder: '000.000.000-00,11111111111',
      },
      {
        name: 'cursor',
        type: 'number',
        description: 'Cursor de paginação (Opcional). Informe o pagination.next_cursor da resposta anterior. Omitir para a primeira página',
      },
    ],
    docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#a70c6b6b-6d22-8fca-abe1-a3fe9b6db817',
  };

  // Save authentication data
  authentication: Auth;

  requestUrl: string;
  requestResult: any;
  isBusy = false;

  // Next page request, available when the response has a next cursor
  nextPageUrl: string;
  private nextPageParameters: any;

  parametersFormGroup = new UntypedFormGroup(
    Object.fromEntries(this.endpoint.queryParams.map(param => [param.name, new UntypedFormControl()])),
  );

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

  async onSend() {
    this.requestUrl = null;
    this.requestResult = null;
    this.nextPageUrl = null;
    this.nextPageParameters = null;

    const rawParameters = this.parametersFormGroup.getRawValue();

    if (!rawParameters.key) {
      this.emitWarningMessage('Informe a chave de conexão com o REP (key)');
      return;
    }

    const rawHttpParam: any = {};
    this.endpoint.queryParams.forEach(param => {
      // Number inputs give 0 as a number, so check against empty instead of falsy
      if (rawParameters[param.name] !== null && rawParameters[param.name] !== '') {
        rawHttpParam[param.name] = rawParameters[param.name];
      }
    });

    const httpParams = new HttpParams({
      fromObject: rawHttpParam,
    });

    this.requestUrl = `${this.endpoint.service}${this.endpoint.path}?${httpParams.toString()}`;

    const response = await this.runGetRequest(
      this.endpoint.service + this.endpoint.path,
      httpParams,
      (active: boolean) => this.isBusy = active,
    );

    this.requestResult = JSON.stringify(response || {}, null, 2);

    // Same parameters of the sent request, moving only the cursor
    const nextCursor = response?.pagination?.next_cursor;
    if (nextCursor) {
      this.nextPageParameters = { ...rawHttpParam, cursor: nextCursor };
      this.nextPageUrl = `${this.endpoint.service}${this.endpoint.path}?${new HttpParams({
        fromObject: this.nextPageParameters,
      }).toString()}`;
    }
  }

  onSendNextPage() {
    // The next page replaces the current request, so the form must reflect what is sent
    this.parametersFormGroup.reset(this.nextPageParameters);

    document.getElementById('repPDataTop')?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

    this.onSend();
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
