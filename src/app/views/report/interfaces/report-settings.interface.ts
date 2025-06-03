import { ApiServiceUrl } from "../../../core/enums/api-service-url.enum";

export interface ReportSettings {
  name: string;
  description?: string;
  service: ApiServiceUrl;
  path: string;
  docUrl?: string;
  parameters: any[];
  reportProgressLabel?: string;
}
