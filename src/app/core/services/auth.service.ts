import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response';
import { UserService } from './user.service';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected http = inject(HttpClient);
  protected userService = inject(UserService);
  protected router = inject(Router)
  token$ = new BehaviorSubject<string | null>(null);
  user$ = new BehaviorSubject<User | null>(null);

  constructor() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token) {
      this.token$.next(token);
    }
    if (user) {
      this.user$.next(JSON.parse(user))
    }
  }

  get url() {
    return environment.apiUrl + '/auth';
  }

  get token() {
    return this.token$.value;
  }

  get user() {
    return this.user$.value
  }

  /**
   * Login the user by sending the username and password
   * @returns {Observable<User>} An observable of the login response
   */
  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.url}/login`, { username, password })
      .pipe(
        switchMap((response) => {
          localStorage.setItem('token', response.token);
          this.token$.next(response.token);
          return this.userService.all();
        }),
        switchMap((users) => {
          const user =
            users.find(
              (u) => u.username == username && u.password == password
            ) || null;
          localStorage.setItem('user', JSON.stringify(user));
          this.user$.next(user)
          return of(user);
        })
      );
  }

  /**
   * Logout the user by removing the token from local storage
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    this.token$.next(null);
    this.user$.next(null);
    this.router.navigate(['/'])
  }
}
