import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected http = inject(HttpClient);
  token$ = new BehaviorSubject<string | null>(null);

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.token$.next(token);
    }
  }

  get url() {
    return environment.apiUrl + '/auth';
  }

  get token() {
    return this.token$.value;
  }

  /**
   * Login the user by sending the username and password
   * @returns {Observable<LoginResponse>} An observable of the login response
   */
  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.url}/login`, { username, password })
      .pipe(
        switchMap((response) => {
          localStorage.setItem('token', response.token);
          this.token$.next(response.token);
          return of(response);
        })
      );
  }

  /**
   * Logout the user by removing the token from local storage
   */
  logout() {
    localStorage.removeItem('token');
    this.token$.next(null);
  }
}
