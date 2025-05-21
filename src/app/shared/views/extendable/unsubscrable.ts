import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Abstract class to easily implements Unsubscribe behaviors
 */
@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class Unsubscrable implements OnDestroy {
  protected ngUnsubscribe = new Subject<void>();

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
