import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, EMPTY, throwError } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ServerErrorsInterceptor implements HttpInterceptor {
  constructor(private messageService: MessageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(retry(0))
      .pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            if (event.body.status == 'ERROR') {
              new Error(event.body.msg);
            }
          }
        })
      )
      .pipe(
        catchError((err) => {
          window.alert(err.msg);
          return EMPTY;
        })
      );
  }

  showInfo(msg: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: msg,
    });
  }
}
