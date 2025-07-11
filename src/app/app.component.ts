import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './features/toast/toast.component';
import { Store } from '@ngrx/store';
import { addProduct } from './core/stores/cart/cart.actions';
import { selectProducts } from './core/stores/cart/cart.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
