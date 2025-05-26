import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Unsubscrable } from '../../shared/views/extendable/unsubscrable';

/**
 * Store authenticated user data
 *
 * @export
 * @class UserStore
 * @extends {Store<UserModel>}
 */
export abstract class Store<T> extends Unsubscrable {
  protected source = new ReplaySubject<T>(null);

  data = this.source.asObservable();

  private value: T;

  constructor() {
    super();

    this.data
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(src => this.value = src);

    const previousStoredData = localStorage.getItem('auth_data');
    if (previousStoredData) {
      this.changeSource(JSON.parse(previousStoredData));
    }
  }

  changeSource(source: T, saveInSession = false) {
    this.source.next(source);

    if (saveInSession) {
      localStorage.setItem('auth_data', JSON.stringify(source));
    }
  }

  getValue(): T {
    return this.value;
  }

  reset(): void {
    this.changeSource(null);

    localStorage.removeItem('auth_data');
  }
}
