import { environment } from './../../../environments/environment';

export abstract class ApiServiceUrl {
  static CORE = environment.core_api;
  static TIMESHEET = environment.timesheet_api;
  static COLLECTOR = environment.collector_api;
  static REP_P_REPORT = environment.rep_p_report_api;
}
