import { capitalize, find, isString, keys, sortBy, startsWith } from 'lodash';

import { OrmValidationConstraint } from './../enums/orm-validation-constraint.enum';
import { ValidationConstraint } from './../enums/validation-constraint.enum';
import { OrmValidationErrorDetail, ValidationError, ValidationErrorDetail } from './../interfaces/validation-error.interface';

export class ErrorHelper {
  static parseError(error: ValidationError | string, labels?: {}): string {
    if (error && typeof error === 'object' && error.statusCode === 400) {
      if (error.details && Array.isArray(error.details)) {
        const mappedError = error.details.map(e => {
          return ErrorHelper.parseValidationErrorMessage(e, labels);
        });
        return mappedError.join(', ');

      } else if (error.error && isString(error.error) && startsWith(error.error, 'DatabaseError')) {
        return ErrorHelper.parseMessage(error.error);

      } else if (error.message && Array.isArray(error.message)) {
        const normalizedErrors = ErrorHelper.normalizeValidationErrors(error.message);
        const mappedError = normalizedErrors.map(e => {
          return ErrorHelper.parseValidationErrorMessage(e, labels);
        });
        return mappedError.join(', ');

      } else if (error.message) {
        return ErrorHelper.parseMessage(error.message);

      } else {
        return ErrorHelper.parseMessage(error.error || error);
      }
    }

    if (error instanceof ProgressEvent) {
      return 'Não foi possível se conectar com a API. Verifique sua conexão';
    }

    return ErrorHelper.parseMessage(error);
  }

  /**
   * Handle validation error messages
   * @param error
   * @param labels
   */
  static parseValidationErrorMessage(error: any, labels?: {}): any {
    // ORM errors
    const ormError = error as OrmValidationErrorDetail;

    if (ormError && ormError.validatorKey && ormError.path) {
      const errorLabel = ErrorHelper.getErrorLabel(ormError.path, labels || {});

      switch (ormError.validatorKey) {
        case OrmValidationConstraint.NOT_UNIQUE:
          return `${errorLabel} deve ser único`;
        case OrmValidationConstraint.LENGTH:
          const args = ormError.validatorArgs;
          return `${errorLabel} deve ter entre ${args[0]} e ${args[1]} caracteres`;
        default:
          return 'Houve um erro';
      }
    }

    // Validation errors
    const validationError = error as ValidationErrorDetail;

    if (validationError && validationError.constraints) {
      const errorLabel = ErrorHelper.getErrorLabel(validationError.property, labels || {});
      const errorKeys: string[] = ErrorHelper.getErrorKeys(validationError.constraints);
      const constraint = validationError.constraints[errorKeys[0]];

      let charLimit, limit: any;

      switch (errorKeys[0]) {
        case ValidationConstraint.IS_NOT_EMPTY:
          return `${errorLabel} é obrigatório`;
        case ValidationConstraint.IS_DEFINED:
          return `${errorLabel} não pode ser vazio`;
        case ValidationConstraint.IS_STRING:
          return `${errorLabel} deve ser um string`;
        case ValidationConstraint.IS_EMAIL:
          return `${errorLabel} deve ser um email válido`;
        case ValidationConstraint.IS_NUMBER:
          return `${errorLabel} deve ser um número`;
        case ValidationConstraint.IS_INT:
          return `${errorLabel} deve ser um número inteiro`;
        case ValidationConstraint.IS_DATE_STRING:
          return `${errorLabel} deve estar no formato ISOString`;
        case ValidationConstraint.IS_UUID:
          return `${errorLabel} deve ser um UUID válido`;
        case ValidationConstraint.IS_POSITIVE:
          return `${errorLabel} deve ser um número positivo`;
        case ValidationConstraint.DATE:
          return `Formato de data inválido`;
        case ValidationConstraint.MAX_LENGTH:
          charLimit = (constraint || '').match(/ ([0-9]+) characters/)[1];

          return `${errorLabel} não deve possuir mais que ${charLimit} caracteres`;
        case ValidationConstraint.MIN_LENGTH:
          charLimit = (constraint || '').match(/ ([0-9]+) characters/)[1];

          return `${errorLabel} não deve possuir menos que ${charLimit} caracteres`;
        case ValidationConstraint.MIN:
          limit = (constraint || '').match(/be less than ([0-9]+)/)[1];

          return `${errorLabel} não pode ser menor que ${limit}`;
        case ValidationConstraint.MAX:
          limit = (constraint || '').match(/be greater than ([0-9]+)/)[1];

          return `${errorLabel} não pode ser maior que ${limit}`;
        case ValidationConstraint.LENGTH:
          charLimit = (constraint || '').match(/ ([0-9]+) characters/)[1];

          if (constraint.includes('must be longer than or equal')) {
            return `${errorLabel} deve possuir ao menos ${charLimit} caracteres`;
          } else {
            return `${errorLabel} não deve possuir mais que ${charLimit} caracteres`;
          }
        case ValidationConstraint.ARRAY_MIN_SIZE:
          limit = (constraint || '').match(/must contain at least ([0-9]+)/)[1];
          return `${errorLabel} deve conter ao menos ${limit} elemento${limit > 1 ? 's' : ''}`;
        case ValidationConstraint.ARRAY_MAX_SIZE:
          limit = (constraint || '').match(/must contain not more than ([0-9]+)/)[1];
          return `${errorLabel} não deve conter mais que ${limit} elemento${limit > 1 ? 's' : ''}`;

        default:
          return `${errorLabel} é inválido: ${constraint}`;
      }
    }

    return ErrorHelper.parseMessage(error || 'Houve um erro');
  }

  static parseMessage(error: any) {
    if (error instanceof TypeError || error instanceof Error) {
      return error?.message ? error.message : JSON.stringify(error);
    }
    return error?.message || error;
  }

  static normalizeValidationErrors(errors: ValidationErrorDetail[], level?: string): ValidationErrorDetail[] {
    let normalizedErrors = [];

    // Put all error at the same root level
    errors.forEach(error => {
      if (error.children && error.children.length) {
        normalizedErrors = [
          ...normalizedErrors,
          ...ErrorHelper.normalizeValidationErrors(error.children, (level ? (level + '.') : '') + error.property)
        ];
      } else {
        error.property = (level ? (level + '.') : '') + error.property;

        normalizedErrors.push(error);
      }
    });

    return normalizedErrors;
  }

  private static getErrorLabel(errorField: string, labels: {}) {
    const parsedErrorField = errorField.toLowerCase();

    // Check if is a nested label
    const labelMatch = (errorField || '').match(/.([0-9]+)./);

    if (labelMatch && labelMatch[0]) {
      const explodedLabel = errorField.split(labelMatch[0]);

      let label: string;
      explodedLabel.forEach(i => {
        if (!label) {
          label = `${ErrorHelper.getErrorLabel(i, labels)}(${parseInt(labelMatch[1], 0) + 1}) - `;
        } else {
          label += ` ${ErrorHelper.getErrorLabel(i, labels)}`;
        }
      });

      return label;
    }

    // If a object with labels exists, try to get from that
    let errorLabel: string = labels ? find(labels, (i, k) => {
      return k.toLowerCase() === parsedErrorField;
    }) : null;

    return errorLabel || capitalize(errorField);
  }

  private static getErrorKeys(constraints: {}): string[] {
    const sort = {
      [ValidationConstraint.IS_NOT_EMPTY]: 0,
      [ValidationConstraint.IS_STRING]: 1,
      [ValidationConstraint.IS_INT]: 1,
      [ValidationConstraint.IS_EMAIL]: 1,
      [ValidationConstraint.IS_NUMBER]: 1,
      [ValidationConstraint.IS_DATE_STRING]: 1,
      [ValidationConstraint.IS_UUID]: 1,
    };

    const errorkeys = keys(constraints);

    return sortBy(errorkeys, (x) => {
      return sort[x] !== undefined ? sort[x] : 9;
    });
  }
}
