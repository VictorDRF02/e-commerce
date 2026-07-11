import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Header interceptor function that adds the accept header and Bearer token when available.
 */
export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  req = req.clone({
    setHeaders: {
      Accept: 'application/json',
      ...(req.method !== 'GET' && authService.token
        ? { Authorization: `Bearer ${authService.token}` }
        : {}),
    },
  });
  return next(req);
};
