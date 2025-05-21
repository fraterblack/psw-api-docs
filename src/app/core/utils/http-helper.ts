import { HttpParams } from '@angular/common/http';

export class HttpHelper {
  /**
   * Generate Http Params
   *
   * @param params Object with params to generate HTTP params
   */
  static generateQueryParams(params: {}): HttpParams {

    let httpParams = new HttpParams();

    Object.keys(params)
      .forEach(key => {
        const value = typeof params[key] === 'string' ? params[key] : JSON.stringify(params[key]);

        httpParams = httpParams.set(key, value);
      });

    return httpParams;
  }
}
