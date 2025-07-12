import { Directive, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from '../../core/interfaces/product';
import { addProduct, removeProduct } from '../../core/stores/cart/cart.actions';

type CartAction = 'add' | 'remove';

@Directive({
  selector: '[cartAction]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class CartActionDirective {
  @Input() cartAction!: CartAction;
  @Input() product!: Product;
  store = inject(Store);

  /**
   * Handles the click event and dispatches the corresponding action
   * 
   * - If the cart action is 'add', the product is added to the cart
   * - If the cart action is 'remove', the product is removed from the cart
   */
  onClick(): void {
    switch (this.cartAction) {
      case 'add':
        this.store.dispatch(addProduct({ product: this.product }));
        break;
      case 'remove':
        this.store.dispatch(removeProduct({ productId: this.product.id }));
        break;
    }
  }
}
