import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusyLoaderService {
  /**
   * Indicate that busy loader is on. Does not matter that loader is being shown
   */
  isActive = false;
  /**
   * Indicate that loader is active
   */
  isLoaderActive = false;

  private intermediateLoaderOnStatus = false;
  private intermediateLoaderOffStatus = false;

  show(delay?: number) {
    setTimeout(() => {
      this.isActive = true;
    });

    delay = delay !== 0 ? (delay || environment.busy_loader_open_delay) : 0;

    this.intermediateLoaderOnStatus = true;
    this.intermediateLoaderOffStatus = false;

    setTimeout(() => {
      if (this.intermediateLoaderOnStatus) {
        this.isLoaderActive = true;
      }
    }, delay);
  }

  hide(delay?: number) {
    this.intermediateLoaderOnStatus = false;
    this.intermediateLoaderOffStatus = true;

    setTimeout(() => {
      if (this.intermediateLoaderOffStatus) {
        this.isActive = false;
        this.isLoaderActive = false;
      }
    }, delay !== 0 ? (delay || environment.busy_loader_close_delay) : 0);
  }
}
