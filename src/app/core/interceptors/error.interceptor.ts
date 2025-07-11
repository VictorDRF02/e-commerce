import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

/**
 * Error interceptor function that handles errors and displays toasts
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        const msg = error.error || 'Something went wrong';

        switch (error.status) {
          case 0:
            toastService.error('There is no connection with the server');
            break;
          case 404:
            toastService.error('Resource not found');
            break;
          default:
            toastService.error(msg);
            break;
        }
      }
      return throwError(() => error);
    })
  );
};
