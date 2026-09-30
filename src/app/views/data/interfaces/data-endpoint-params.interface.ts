import { ApiServiceUrl } from '../../../core/enums/api-service-url.enum';

export interface DataEndpointParams {
  type: 'IMPORT' | 'DELETE';
  name: string;
  service: ApiServiceUrl;
  path: string;
  // Summary of what the endpoint does, including its restrictions
  description: string;
  // Path of the GET endpoint that returns the fields accepted in the import (IMPORT only)
  importFieldsPath?: string;
  // Example of request body (IMPORT only)
  bodyExample?: any;
  docUrl?: string;
  // Documentation of the GET endpoint that returns the fields accepted in the import (IMPORT only)
  importFieldsDocUrl?: string;
}
