import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, of } from 'rxjs';
import { Toast } from '../interfaces/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toasts.asObservable();

  /**
   * Show a toast with the given message and type
   * @param message - Message to show
   * @param type - Type of the toast (default: info)
   */
  show(message: string, type: Toast['type'] = 'info'): void {
    const id = Math.random().toString(36).substring(2);
    const newToast = { id, message, type };

    this.toasts.next([...this.toasts.value, newToast]);

    of(null)
      .pipe(delay(5000))
      .subscribe(() => this.remove(id));
  }

  /**
   * Removes a toast by its id from the toasts list
   * @param id - Id of the toast to remove
   */
  remove(id: string): void {
    this.toasts.next(this.toasts.value.filter((toast) => toast.id !== id));
  }

  /**
   * Show a toast of the type success with the given message
   * @param message - Message to show
   */
  success(message: string): void {
    this.show(message, 'success');
  }

  /**
   * Show a toast of the type error with the given message
   * @param message - Message to show
   */
  error(message: string): void {
    this.show(message, 'error');
  }

  /**
   * Show a toast of the type info with the given message
   * @param message - Message to show
   */
  info(message: string): void {
    this.show(message, 'info');
  }

  /**
   * Show a toast of the type warning with the given message
   * @param message - Message to show
   */
  warning(message: string): void {
    this.show(message, 'warning');
  }
}
