import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Header interceptor function that adds the accept header to the request
 */
export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
      setHeaders: {
        Accept: 'application/json',
      },
    });
  return next(req);
};
