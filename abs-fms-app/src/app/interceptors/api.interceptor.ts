import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only modify requests to our API (ngrok URLs)
    if (
      req.url.includes('ngrok') ||
      (environment.apiBaseUrl && req.url.startsWith(environment.apiBaseUrl))
    ) {
      const modifiedReq = req.clone({
        setHeaders: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          // Add origin header to help with CORS
          Origin: 'http://localhost:4200',
        },
      });
      return next.handle(modifiedReq);
    }

    return next.handle(req);
  }
}
