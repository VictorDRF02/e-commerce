import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { AsyncPipe } from '@angular/common';
import { Toast } from '../../core/interfaces/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts$ = this.toastService.toasts$;

  /**
   * Get the class by the toast type
   * @param {Toast["type"]} type - Toast type to get the class
   * @returns The background and text color classes
   */
  getToastClass(type: Toast["type"]): string {
    const types: { [key: string]: string } = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500'
    };
    return `${types[type]}`;
  }

  /**
   * Removes a toast by its id
   * @param id - Id of the toast to remove
   */
  remove(id: string): void {
    this.toastService.remove(id);
  }
}
