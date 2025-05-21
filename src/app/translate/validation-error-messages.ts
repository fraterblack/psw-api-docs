import { ErrorMessage } from 'ng-bootstrap-form-validation';

export const CUSTOM_ERRORS: ErrorMessage[] = [
  {
    error: 'required',
    format: label => `${label} é obrigatório`
  },
  {
    error: 'pattern',
    format: label => `${label} é inválido`
  },
  {
    error: 'minlength',
    format: (label, error) =>
      `${label} deve ter ao menos ${error.requiredLength} caracteres`
  },
  {
    error: 'maxlength',
    format: (label, error) =>
      `${label} não deve ter mais que ${error.requiredLength} caracteres`
  },
  {
    error: 'requiredTrue',
    format: (label, error) => `${label} é obrigatório`
  },
  {
    error: 'email',
    format: (label, error) => `Endereço de email inválido`
  },
  {
    error: 'max',
    format: (label, error) => `${label} não deve ser maior que ${error.max}`
  },
  {
    error: 'min',
    format: (label, error) => `${label} não deve ser menor que ${error.min}`
  },
  {
    error: 'equalTo',
    format: (label, error) => {
      return `${label} não contém o valor esperado`;
    }
  },
  {
    error: 'invalid',
    format: (label, error) => {
      return `${label} é inválido`;
    }
  },
  {
    error: 'digits',
    format: label => `${label} aceita somente números`
  },
  {
    error: 'pis',
    format: label => `Formato de PIS inválido`
  },
  {
    error: 'cpf',
    format: label => `Formato de CPF inválido`
  },
  {
    error: 'bsDate',
    format: label => `Formato de data inválido`
  },
];
