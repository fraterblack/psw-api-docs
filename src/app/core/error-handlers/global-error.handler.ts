import { ErrorHandler, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AlertService } from '../services/alert.service';
import { AlertType } from './../enums/alert-type.enum';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private alertService: AlertService,
  ) {
  }

  handleError(error: any): void {
    if (environment.environment === 'LOCAL' || environment.environment === 'DEV') {
      console.error('=> ERROR', error);
    }

    const chunkFailedMessage = /ChunkLoadError:/;
    if (chunkFailedMessage.test(error.message)) {
      this.alertService.show('Não foi possível carregar a página. Aguarde a tela ser atualizada e tente novamente', AlertType.WARNING, 3000, 'ChunkLoadError');
      setTimeout(() => document.location.reload(), 3500);
    }
  }
}
