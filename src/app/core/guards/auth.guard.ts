import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router)
  const canActivate = !!authService.token && !!authService.user
  if (!canActivate) {
    router.navigate(['/login'])
  }
  return canActivate
};
