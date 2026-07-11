import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectProducts, selectTotalItems, selectTotalPrice } from '../../../core/stores/cart/cart.selectors';
import { changeProductQuantity, removeProduct } from '../../../core/stores/cart/cart.actions';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { first, forkJoin, pipe, takeUntil } from 'rxjs';
import { Product } from '../../../core/interfaces/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './cart.component.html',
})
export class CartComponent extends BaseComponent implements OnInit {
  private store = inject(Store);

  products$ = this.store.select(selectProducts);
  totalPrice$ = this.store.select(selectTotalPrice);
  totalItems$ = this.store.select(selectTotalItems);
  products: Product[] = [];
  totalPrice = 0;

  isOpen = false;


  override ngOnInit(): void {
    super.ngOnInit();
    this.products$.pipe(takeUntil(this.destroy$)).subscribe((products) => {
      this.products = products;
    });
    this.totalPrice$.pipe(takeUntil(this.destroy$)).subscribe((price) => {
      this.totalPrice = price;
    });
  }
  /**
   * Removes a product from the cart by id
   * @param productId - The id of the product to remove
   */
  removeItem(productId: number) {
    this.store.dispatch(removeProduct({ productId }));
  }

  /**
   * Updates the quantity of a product in the cart
   * @param productId - The id of the product to update
   * @param quantity - The new quantity of the product
   */
  updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      this.removeItem(productId);
    } else {
      this.store.dispatch(
        changeProductQuantity({ productId, newQuantity: quantity })
      );
    }
  }

  /**
   * Toggles the visibility of the cart
   */
  toggleCart() {
    this.isOpen = !this.isOpen;
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  /**
   * Closes the cart
   */
  closeCart() {
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  sendWhatsAppMessage() {
      // TODO: Environment variables
      const phoneNumber = '+5352466400';
      const message = `Hola, quiero comprar:\n${this.products.map(p => `${p.title} - $${p.price}x${p.quantity} -> $${(p.price*(p.quantity || 1)).toFixed(2)}`).join('\n')}\nTotal: $${this.totalPrice.toFixed(2)}`;
      window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
  }
}
