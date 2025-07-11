import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectProducts = createSelector(
  selectCartState,
  (state) => state.products
);

export const selectTotalPrice = createSelector(
  selectCartState,
  (state) => state.total
);

export const selectTotalItems = createSelector(
  selectCartState,
  (state) => state.totalItems
);

export const selectUniqueProductsCount = createSelector(
  selectProducts,
  (products) => products.length
);