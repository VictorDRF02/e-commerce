import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  protected http = inject(HttpClient);

  get url() {
    return `${environment.apiUrl}/users`;
  }

  /**
   * Get all users from the api
   * @returns {Observable<User[]>} An observable of the users
   */
  all() {
    return this.http.get<User[]>(this.url);
  }

  /**
   * Get a user by its id
   * @param id - user id
   * @returns {Observable<user>}
   */
  get(id: number) {
    return this.http.get<User>(`${this.url}/${id}`);
  }
}
