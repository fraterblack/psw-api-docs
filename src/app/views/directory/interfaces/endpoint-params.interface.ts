import { ApiServiceUrl } from "../../../core/enums/api-service-url.enum";

export interface EndpointQueryParameters {
  name: string;
  type: string;
  description?: string;
  placeholder?: string;
}

export interface EndpointParams {
  type: string;
  name: string;
  service: ApiServiceUrl;
  path: string;
  queryParams?: EndpointQueryParameters[];
  // Path of the GET endpoint that returns the fields accepted in the import (IMPORT type only)
  importFieldsPath?: string;
  // Example of request body (IMPORT type only)
  bodyExample?: any;
  docUrl?: string;
}
