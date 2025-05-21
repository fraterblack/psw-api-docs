import { Injectable } from '@angular/core';

import { Auth } from '../models/auth.model';
import { Store } from './store';

/**
 * Store authenticated user data
 *
 * @export
 * @class AuthStore
 * @extends {Store<Auth>}
 */
@Injectable({
  providedIn: 'root'
})
export class AuthStore extends Store<Auth> {
}
