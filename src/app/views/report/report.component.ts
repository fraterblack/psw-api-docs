import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { lastValueFrom, takeUntil, timeout } from 'rxjs';
import { ApiServiceUrl } from '../../core/enums/api-service-url.enum';
import { Auth } from '../../core/models/auth.model';
import { AlertService } from '../../core/services/alert.service';
import { DialogService } from '../../core/services/dialog.service';
import { SseService } from '../../core/services/sse.service';
import { AuthStore } from '../../core/stores/auth.store';
import { ErrorHelper } from '../../core/utils/error-helper';
import { ViewComponent } from '../../shared/views/extendable/view-component';
import { ReportSettings } from './interfaces/report-settings.interface';

@Component({
  selector: 'app-report',
  templateUrl: 'report.component.html'
})
export class ReportComponent extends ViewComponent implements OnInit {
  // List of endpoint parameters
  endpoints: ReportSettings[] = [];

  // Selected endpoint
  selectedEndpoint: ReportSettings;

  // Save authentication data
  authentication: Auth;

  requestUrl: string;
  requestBody: string;
  requestResult: string;

  reportId: string;
  reportProgress: any;
  reportData: string;

  isBusy = false;

  settingsFormGroup = new UntypedFormGroup({
    param1: new UntypedFormControl(),
  });

  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
    private authStore: AuthStore,
    private apiService: ApiService,
    private sseService: SseService,
  ) {
    super();

    // Subscribe to listen auth store changes
    this.authStore.data
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(auth => {
        this.authentication = auth;
      });
  }

  ngOnInit(): void {
    this.populateReports();
  }

  onEndpointChangeChange() {
    this.requestUrl = null;
    this.requestBody = null;
    this.requestResult = null;

    this.reportId = null;
    this.reportData = null;
    this.reportProgress = null;

    this.settingsFormGroup.reset();
  }

  async onSend() {
    if (!this.selectedEndpoint) {
      return;
    }

    this.requestUrl = null;
    this.requestBody = null;
    this.requestResult = null;

    this.reportId = null;
    this.reportData = null;
    this.reportProgress = null;

    // TODO
    const rawParameters = this.settingsFormGroup.getRawValue();

    this.requestUrl = `${this.selectedEndpoint.service}${this.selectedEndpoint.path}`;

    const body = {
      "startAt": "2025-04-01",
      "endAt": "2025-04-30",
      "includeFiredEmployees": null,
      "showSummary": true,
      "showPartialAllowances": false,
      "columns": ["normal", "t-falta"],
      "filters": {
        "collectors": [],
        "employees": [],
        "companies": [],
        "departments": [],
        "structures": [],
        "roles": [],
        "schedules": [],
        "groups": []
      }
    };

    this.requestBody = JSON.stringify(
      body,
      null,
      2,
    );

    const requestResult = await this.runRequest(
      this.requestUrl,
      body,
    );

    this.requestResult = JSON.stringify(
      requestResult || {},
      null,
      2,
    );

    // Monitoring report progress
    this.reportId = requestResult?.id;

    if (requestResult?.id) {
      this.openReportMonitoring(requestResult.id);
    }
  }

  private openReportMonitoring(reportId: string) {
    const header = {
      authorization: `Bearer ${this.authentication.token}`,
      'x-request-origin': 'api/docs',
      'x-license-id': this.authentication.licenseId,
      'ngsw-bypass': true,
    };

    // Create a SSE request to monitor report progress
    this.sseService.get(
      `${this.selectedEndpoint.service}/v2/async-processing-monitor/${reportId}`,
      header,
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(timeout(180000))
      .subscribe(
        // On watching events
        (data: any) => {
          console.log(`Monitoring progress (${reportId})`, data);

          // If complete, means the processing is finished
          if (data.complete) {
            this.reportData = JSON.stringify(
              data.report,
              null,
              2,
            );

            this.reportProgress = {
              total: data.total,
              processed: data.processed,
              progress: 100,
            };

            this.emitSuccessMessage('Relatório completado com sucesso');

            // While is not completed, means is being processed
          } else if (data.total) {
            this.reportProgress = {
              total: data.total,
              processed: data.processed,
              progress: (data.processed * 100) / data.total,
            };
          }
        },
        // On error
        (error: any) => {
          console.error(`Monitoring error (${reportId})`, error);

          this.reportData = JSON.stringify(
            error?.data ? JSON.parse(error.data) : error,
            null,
            2,
          );

          this.emitErrorMessage('Houve um erro ao processar relatório');
        },
        // On finally
        () => {
          console.log(`Monitoring complete (${reportId})`);
        }
      );

    setTimeout(() => {
      const element = document.getElementById('reportProgress');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }, 500);
  }

  private async runRequest(endpointUrl: string, body: any, httpParams?: HttpParams): Promise<any> {
    this.isBusy = true;
    return lastValueFrom(
      this.apiService.post(
        endpointUrl,
        body,
        null,
        new HttpHeaders({
          Authorization: `Bearer ${this.authentication.token}`,
          'ContentType': 'application/json',
        }),
      ),
    )
      .then((data) => {
        return data;
      })
      .catch(error => this.handleError(error))
      .finally(() => this.isBusy = false);
  }

  private populateReports() {
    this.endpoints = [
      {
        name: 'Apuração de Ponto',
        service: ApiServiceUrl.TIMESHEET,
        path: '/external/v1/report/timesheet',
        docUrl: 'https://documenter.getpostman.com/view/44879535/2sB2jAbTrK#ea3d6a75-82a2-4df7-8a84-3486eae6f68e',
      },
    ];
  }

  protected handleBadRequestError(error: any): any | void {
    this.emitErrorMessage(ErrorHelper.parseMessage(error), 10000);
    return { error: ErrorHelper.parseMessage(error) };
  }

  protected handleNonDefinedError(error: any): any | void {
    this.emitErrorMessage(ErrorHelper.parseMessage(error), 10000);
    return { error: ErrorHelper.parseMessage(error) };
  }

  protected handleDatabaseError(error: any): any | void {
    this.emitErrorMessage(ErrorHelper.parseMessage(error), 10000);
    return { error: ErrorHelper.parseMessage(error) };
  }
}
