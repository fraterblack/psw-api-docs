import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Unsubscrable } from '../../shared/views/extendable/unsubscrable';
import { FragmentedStorage } from './fragmented-storage';

const AUTH_STORAGE_NAME = 'auth_data';

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

    const previousStoredData = this.restoreStoredData();
    if (previousStoredData) {
      this.changeSource(JSON.parse(previousStoredData));
    }
  }

  changeSource(source: T, saveInSession = false) {
    this.source.next(source);

    if (saveInSession) {
      FragmentedStorage.setItem(AUTH_STORAGE_NAME, JSON.stringify(source));
    }
  }

  getValue(): T {
    return this.value;
  }

  reset(): void {
    this.changeSource(null);

    FragmentedStorage.removeItem(AUTH_STORAGE_NAME);
  }

  /**
   * Recovers the stored data, migrating it from the previous single key storage when needed
   */
  private restoreStoredData(): string {
    const legacyStoredData = localStorage.getItem(AUTH_STORAGE_NAME);
    if (legacyStoredData) {
      localStorage.removeItem(AUTH_STORAGE_NAME);

      FragmentedStorage.setItem(AUTH_STORAGE_NAME, legacyStoredData);

      return legacyStoredData;
    }

    return FragmentedStorage.getItem(AUTH_STORAGE_NAME);
  }
}
