export class ValidationError {
  statusCode: number;
  error: string;
  details?: OrmValidationErrorDetail[];
  message?: ValidationErrorDetail[];
}

export class OrmValidationErrorDetail {
  message: string;
  type: string;
  validatorKey: string;
  validatorArgs: any;
  path: string;
  value: string;
  origin: string;
}

export class ValidationErrorDetail {
  target: {};
  value: string;
  property: string;
  children: any[];
  constraints: {};
}
