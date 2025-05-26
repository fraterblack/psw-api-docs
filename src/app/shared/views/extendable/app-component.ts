
import { isString, startsWith } from 'lodash';
import { environment } from '../../../../environments/environment';
import { AlertType } from '../../../core/enums/alert-type.enum';
import {
  OrmValidationErrorDetail,
  ValidationError,
  ValidationErrorDetail,
} from '../../../core/interfaces/validation-error.interface';
import { AlertService } from '../../../core/services/alert.service';
import { ErrorHelper } from '../../../core/utils/error-helper';
import { Unsubscrable } from './unsubscrable';

/**
 * Abstract class to easily implements Form behaviors
 */
export abstract class AppComponent extends Unsubscrable {
  protected abstract alertService: AlertService;

  /**
   * Emits a info message
   *
   * @param message Message to be showed
   * @param duration Message autohide delay
   * @param id Message ID
   */
  emitWarningMessage(message: string, duration = 7000, id?: string) {
    this.alertService.show(message, AlertType.WARNING, duration, id);
  }

  /**
   * Emits a success message
   *
   * @param message Message to be showed
   * @param duration Message autohide delay
   * @param id Message ID
   */
  emitSuccessMessage(message: string, duration = 3000, id?: string) {
    this.alertService.show(message, AlertType.SUCCESS, duration, id);
  }

  /**
   * Emits a error message
   *
   * @param message Message to be showed
   * @param duration Message autohide delay
   * @param id Message ID
   */
  emitErrorMessage(message: string, duration = 5000, id?: string) {
    this.alertService.show(message, AlertType.ERROR, duration, id);
  }

  /**
   * Handle error message (show error message)
   *
   * @param error Error message
   * @param labels labels translation
   */
  protected handleError(error: ValidationError | string, labels?: {}): any | void {
    if (!environment.production) {
      console.log('Error to be handled:');
      console.log(error);
    }

    if (error && typeof error === 'object' && error.statusCode === 400) {
      if (error.details && Array.isArray(error.details)) {
        return this.handleValidationError<OrmValidationErrorDetail>(error.details, labels);
      } else if (error.error && isString(error.error) && startsWith(error.error, 'DatabaseError')) {
        this.handleDatabaseError(error.error);
      } else if (error.message && Array.isArray(error.message)) {
        const normalizedErrors = ErrorHelper.normalizeValidationErrors(error.message);
        return this.handleValidationError<ValidationErrorDetail>(normalizedErrors, labels);
      } else if (error.message) {
        return this.handleBadRequestError(error.message);
      } else {
        return this.handleBadRequestError(error.error || error);
      }
    } else {
      return this.handleNonDefinedError(error);
    }
  }

  /**
   * Handle validation error message (show error message)
   *
   * @param errors Validation errors
   *
   */
  protected handleValidationError<T>(errors: T[], labels?: {}): any | void {
    errors.forEach(e => {
      this.emitErrorMessage(ErrorHelper.parseValidationErrorMessage(e, labels), 10000);
    });
  }

  /**
   * Handle database error message
   *
   * @param error Validation error
   *
   */
  protected handleDatabaseError(error: any): any | void {
    this.emitErrorMessage(ErrorHelper.parseMessage(error), 10000);
  }

  /**
   * Handle bad request error message
   *
   * @param error Validation error
   *
   */
  protected handleBadRequestError(error: any): any | void {
    this.emitErrorMessage(ErrorHelper.parseMessage(error), 10000);
  }

  /**
   * Handle non defined error message
   *
   * @param error Validation error
   *
   */
  protected handleNonDefinedError(error: any): any | void {
    this.emitErrorMessage(ErrorHelper.parseMessage(error), 10000);
  }
}
