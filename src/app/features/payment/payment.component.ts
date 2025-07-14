import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectTotalPrice,
  selectTotalItems,
} from '../../core/stores/cart/cart.selectors';
import { AsyncPipe, CurrencyPipe, Location } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CurrencyPipe, AsyncPipe],
  templateUrl: './payment.component.html',
})
export class PaymentComponent {
  store = inject(Store)
  location = inject(Location)
  totalPrice$: Observable<number> = this.store.select(selectTotalPrice);
  totalItems$: Observable<number> = this.store.select(selectTotalItems);

  shippingCost = 5.0; // Fixed shipping cost for demo

  /**
   * Handles the checkout process
   */
  completeOrder() {
    alert(
      'This is a practice store. No real payment was processed!\n\nThank you for testing the demo checkout flow.'
    );
  }
}
