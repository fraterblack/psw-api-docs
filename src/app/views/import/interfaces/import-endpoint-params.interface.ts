import { ApiServiceUrl } from '../../../core/enums/api-service-url.enum';

export interface ImportEndpointParams {
  name: string;
  service: ApiServiceUrl;
  path: string;
  // Path of the GET endpoint that returns the fields accepted in the import
  importFieldsPath: string;
  // Example of request body
  bodyExample: any;
  docUrl?: string;
  // Documentation of the GET endpoint that returns the fields accepted in the import
  importFieldsDocUrl?: string;
}
