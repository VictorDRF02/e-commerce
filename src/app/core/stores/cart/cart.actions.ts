import { createAction, props } from '@ngrx/store';
import { Product } from '../../interfaces/product';

/**
 * Add the given product to the cart
 *
 * If the product is already in the cart, the quantity is incremented
 */
export const addProduct = createAction(
  '[Cart] Add Product',
  props<{ product: Product }>()
);

/**
 * Remove the product with the given id from the cart
 */
export const removeProduct = createAction(
  '[Cart] Remove Product',
  props<{ productId: number }>()
);

/**
 * Change the quantity of the product with the given id in the cart
 */
export const changeProductQuantity = createAction(
  '[Cart] Change Product Quantity',
  props<{ productId: number; newQuantity: number }>()
);
