import { ApiServiceUrl } from "../../../core/enums/api-service-url.enum";

export interface ReportSettings {
  name: string;
  service: ApiServiceUrl;
  path: string;
  docUrl?: string;
  parameters: any[];
}
