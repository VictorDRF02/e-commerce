import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [],
  template: '',
})
export class BaseComponent implements OnInit, OnDestroy {
  protected authService = inject(AuthService);
  /**
   * Signal that indicates if the user is logged in
   */
  protected isLoggedIn = signal(false);
  /**
   * Signal that indicates if the component is being destroyed 
   * (can be used to unsubscribe from observables)
   */
  protected destroy$ = new Subject<boolean>();

  ngOnInit() {
    this.authService.token$.subscribe((token) => {
      this.isLoggedIn.set(token !== null);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
