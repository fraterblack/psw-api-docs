import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cloneDeep, isArray } from 'lodash';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  static readonly NOT_FOUND_MESSAGE = 'Não encontrado';
  static readonly FORBIDDEN_MESSAGE = 'Você não possui permissão para fazer esta ação';
  static readonly TOO_MANY_REQUESTS_MESSAGE = 'O limite de consultas na API foi atingido. Aguarde um instante e tente novamente';

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * When setted, request will set this token to Authorization header
   * Use withToken('your_token') method to use this feature
   *
   * @private
   * @type {string}
   * @memberof ApiService
   */
  private token: string;

  /**
   * When setted add custom headers to all requests
   */
  private customHeaders: Map<string, string>;

  /**
   * Create a get HTTP request
   *
   * @param {string} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {boolean | HttpStatusCode[]} [skipFormatError=false]
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  get(endpoint: string, params: HttpParams = new HttpParams(), skipFormatError: boolean | HttpStatusCode[] = false): Observable<any> {
    const headers = this.handleHeaders();

    return this.http.get(`${endpoint}`, { params, headers })
      .pipe(catchError(this.formatErrors.bind(this, skipFormatError)));
  }

  /**
   * Create a put HTTP request
   *
   * @param {string} endpoint
   * @param {{}} body
   * @param {boolean | HttpStatusCode[]} [skipFormatError=false]
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  put(endpoint: string, body: {}, skipFormatError: boolean | HttpStatusCode[] = false): Observable<any> {
    const headers = this.handleHeaders();

    return this.http.put(
      `${endpoint}`,
      body,
      { headers }
    ).pipe(catchError(this.formatErrors.bind(this, skipFormatError)));
  }

  /**
   * Create a patch HTTP request
   *
   * @param {string} endpoint
   * @param {{}} body
   * @param {boolean | HttpStatusCode[]} [skipFormatError=false]
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  patch(endpoint: string, body: {}, skipFormatError: boolean | HttpStatusCode[] = false): Observable<any> {
    const headers = this.handleHeaders();

    return this.http.patch(
      `${endpoint}`,
      body,
      { headers }
    ).pipe(catchError(this.formatErrors.bind(this, skipFormatError)));
  }

  /**
   * Create a post HTTP request
   *
   * @param {string} endpoint
   * @param {{}} body
   * @param {HttpParams} [params=new HttpParams()]
   * @param {boolean | HttpStatusCode[]} [skipFormatError=false]
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  post(endpoint: string, body: {}, params: HttpParams = new HttpParams(), skipFormatError: boolean | HttpStatusCode[] = false): Observable<any> {
    const headers = this.handleHeaders();

    return this.http.post(
      `${endpoint}`,
      body,
      { headers, params }
    ).pipe(catchError(this.formatErrors.bind(this, skipFormatError)));
  }

  /**
   * Create a delete HTTP request
   *
   * @param {*} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {boolean | HttpStatusCode[]} [skipFormatError=false]
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  delete(endpoint, params: HttpParams = new HttpParams(), skipFormatError: boolean | HttpStatusCode[] = false): Observable<any> {
    const headers = this.handleHeaders();

    return this.http.delete(
      `${endpoint}`,
      { headers, params }
    ).pipe(catchError(this.formatErrors.bind(this, skipFormatError)));
  }

  /**
   * Create request
   *
   * @param {HttpRequest<any>} req
   * @param {boolean | HttpStatusCode[]} [skipFormatError=false]
   * @returns {Observable<HttpEvent<any>>}
   * @memberof ApiService
   */
  request(req: HttpRequest<any>, skipFormatError: boolean | HttpStatusCode[] = false): Observable<HttpEvent<any>> {
    return this.http.request(req)
      .pipe(catchError(this.formatErrors.bind(this, skipFormatError)));
  }

  /**
   * Returns a copy of API service instance with a token setted that will overwrite global app token on each request
   *
   * @param {string} token
   * @returns
   * @memberof ApiService
   */
  withToken(token: string) {
    const clonedInstance = cloneDeep(this);
    clonedInstance.token = token;

    return clonedInstance;
  }

  /**
   * Returns a copy of API service instance with a empty token that will clear global app token on each request
   *
   * @returns
   * @memberof ApiService
   */
  withoutToken() {
    const clonedInstance = cloneDeep(this);
    clonedInstance.token = null;

    return clonedInstance;
  }

  /**
   * Returns a copy of API service instance with a custom header
   *
   * @returns
   * @memberof ApiService
   */
  withCustomHeaders(customHeaders: Map<string, string>) {
    const clonedInstance = cloneDeep(this);
    clonedInstance.customHeaders = customHeaders;

    return clonedInstance;
  }

  /**
   * Get custom token (use to override global token)
   * @returns
   */
  getCustomToken(): string {
    return this.token;
  }

  /**
   * Format HTTP requests errors
   *
   * @param {boolean | HttpStatusCode[]} skipFormatError
   * @param {*} error
   * @returns
   * @memberof ApiService
   */
  formatErrors(skipFormatError: boolean | HttpStatusCode[], error: any) {
    error = error.error;

    if (skipFormatError && !isArray(skipFormatError)) {
      return throwError(error);
    }

    if (skipFormatError && isArray(skipFormatError) && skipFormatError.some(x => x === error.statusCode)) {
      return throwError(error);
    }

    if (error && error.statusCode === 404) {
      return throwError(ApiService.NOT_FOUND_MESSAGE);
    }

    if (error && error.statusCode === 403) {
      return throwError(ApiService.FORBIDDEN_MESSAGE);
    }

    if (error && error.statusCode === 429) {
      return throwError(ApiService.TOO_MANY_REQUESTS_MESSAGE);
    }

    if (error && error.message && error.statusCode !== 400) {
      return throwError(error.message);
    }

    if (error && error.error && error.statusCode !== 400) {
      return throwError(error.error);
    }

    return throwError(error);
  }

  /**
   * Handle token passed to all requests
   */
  private handleHeaders(headers = new HttpHeaders()): HttpHeaders {
    headers = this.handleContentTypeHeader(headers);

    if (this.customHeaders) {
      for (let [key, value] of this.customHeaders) {
        headers = headers.set(key, value);
      }
    }

    return headers;
  }

  /**
   * Set token to the request overwriting global app token
   */
  private handleContentTypeHeader(headers = new HttpHeaders()): HttpHeaders {
    headers = headers.set('Content-Type', 'application/json');
    return headers;
  }
}
