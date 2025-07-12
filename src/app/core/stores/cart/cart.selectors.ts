import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

/**
 * Select the products from the cart state
 */
export const selectProducts = createSelector(
  selectCartState,
  (state) => state.products
);

/**
 * Select the total price from the cart state
 */
export const selectTotalPrice = createSelector(
  selectCartState,
  (state) => state.total
);

/**
 * Select the total items from the cart state
 */
export const selectTotalItems = createSelector(
  selectCartState,
  (state) => state.totalItems
);

/**
 * Select the unique products count from the cart state
 */
export const selectUniqueProductsCount = createSelector(
  selectProducts,
  (products) => products.length
);