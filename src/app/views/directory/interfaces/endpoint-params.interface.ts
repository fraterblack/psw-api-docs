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
  docUrl?: string;
}
