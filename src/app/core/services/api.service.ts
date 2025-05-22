import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
   * Create a get HTTP request
   *
   * @param {string} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {HttpHeaders} [headers=new HttpHeaders()]
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  get(endpoint: string, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders()): Observable<any> {
    return this.http.get(`${endpoint}`, { params, headers })
      .pipe(catchError(this.formatErrors.bind(this)));
  }

  /**
   * Create a put HTTP request
   *
   * @param {string} endpoint
   * @param {{}} body
   * @param {HttpHeaders} [headers=new HttpHeaders()]
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  put(endpoint: string, body: {}, headers: HttpHeaders = new HttpHeaders()): Observable<any> {
    return this.http.put(
      `${endpoint}`,
      body,
      { headers }
    ).pipe(catchError(this.formatErrors.bind(this)));
  }

  /**
   * Create a patch HTTP request
   *
   * @param {string} endpoint
   * @param {{}} body
   * @param {HttpHeaders} [headers=new HttpHeaders()]
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  patch(endpoint: string, body: {}, headers: HttpHeaders = new HttpHeaders()): Observable<any> {
    return this.http.patch(
      `${endpoint}`,
      body,
      { headers }
    ).pipe(catchError(this.formatErrors.bind(this)));
  }

  /**
   * Create a post HTTP request
   *
   * @param {string} endpoint
   * @param {{}} body
   * @param {HttpParams} [params=new HttpParams()]
   * @param {HttpHeaders} [headers=new HttpHeaders()]
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  post(endpoint: string, body: {}, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders()): Observable<any> {
    return this.http.post(
      `${endpoint}`,
      body,
      { headers, params }
    ).pipe(catchError(this.formatErrors.bind(this)));
  }

  /**
   * Create a delete HTTP request
   *
   * @param {string} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {HttpHeaders} [headers=new HttpHeaders()]
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  delete(endpoint: string, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders()): Observable<any> {
    return this.http.delete(
      `${endpoint}`,
      { headers, params }
    ).pipe(catchError(this.formatErrors.bind(this)));
  }

  /**
   * Create request
   *
   * @param {HttpRequest<any>} req
   * @returns {Observable<HttpEvent<any>>}
   * @memberof ApiService
   */
  request(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.http.request(req)
      .pipe(catchError(this.formatErrors.bind(this)));
  }

  /**
   * Format HTTP requests errors
   *
   * @param {*} error
   * @returns
   * @memberof ApiService
   */
  formatErrors(error: any) {
    error = error.error;

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
}
