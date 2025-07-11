import { createAction, props } from '@ngrx/store';
import { Product } from '../../interfaces/product';

export const addProduct = createAction(
  '[Cart] Add Product',
  props<{ product: Product }>()
);

export const removeProduct = createAction(
  '[Cart] Remove Product',
  props<{ productId: number }>()
);

export const changeProductQuantity = createAction(
  '[Cart] Change Product Quantity',
  props<{ productId: number; newQuantity: number }>()
);