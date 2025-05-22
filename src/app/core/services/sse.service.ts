import { Injectable, NgZone } from '@angular/core';
import { EventSourcePolyfill } from 'event-source-polyfill/src/eventsource.min.js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  constructor(
    private _zone: NgZone,
  ) { }

  get(url: string, headers: any, heartbeatTimeout: number = 30000): Observable<any> {
    try {
      const eventSource = new EventSourcePolyfill(url, {
        headers,
        heartbeatTimeout,
      });

      return new Observable(observer => {
        setTimeout(() => {
          if (eventSource.readyState === 2) {
            observer.error({
              error: 'Não foi possível estabelecer uma conexão com o monitor de progresso',
            });
            eventSource.close();
          }
        }, 5000)

        eventSource.onmessage = (event: any) => {
          const data = JSON.parse(event?.data || '{}');
          observer.next(data);

          // If event is reported as complete, close connection
          if (data.complete) {
            observer.complete();
            setTimeout(() => eventSource.close(), 1000);
          }
        };
        eventSource.onerror = (error: any) => {
          observer.error(error);
          eventSource.close();
        };
      });
    } catch (err) {
      console.log(err);
    }
  }
}
