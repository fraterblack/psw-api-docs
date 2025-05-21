import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: { [propName: string]: any } = {};

  set(key: string, value: any) {
    this.cache[key] = value;
  }

  get(key: string) {
    return this.cache[key];
  }

  all() {
    return this.cache;
  }

  reset() {
    this.cache = {};
  }
}
