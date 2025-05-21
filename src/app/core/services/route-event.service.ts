import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteEventsService {

  private previousRoutePath = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
    private location: Location
  ) {
    this.previousRoutePath.next(this.location.path());

    this.router.events.pipe(
      filter(e => e instanceof RoutesRecognized),
      pairwise(),
    )
      .subscribe((event: any[]) => {
        this.previousRoutePath.next(event[0].urlAfterRedirects);
      });
  }

  getPreviousUrl(): string {
    return this.previousRoutePath.value;
  }
}
