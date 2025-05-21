import { Component } from '@angular/core';

import { BusyLoaderService } from '../../../core/services/busy-loader.service';

@Component({
  selector: 'app-busy-loader',
  template: `<div *ngIf="busyLoaderService.isLoaderActive" class="screen-busy-loader"></div>`
})
export class BusyLoaderComponent {

  constructor(public busyLoaderService: BusyLoaderService) { }
}
