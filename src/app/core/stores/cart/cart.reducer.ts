import { createReducer, on } from '@ngrx/store';
import {
  addProduct,
  changeProductQuantity,
  removeProduct,
} from './cart.actions';
import { Product } from '../../interfaces/product';

/**
 * Updates the local storage with the given state
 * @param state - The new state
 */
function _updateStorage(state: CartState) {
  localStorage.setItem('cart', JSON.stringify(state));
}

export interface CartState {
  products: Product[];
  total: number;
  totalItems: number;
}

export const initialState: CartState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart')!)
  : { products: [], total: 0, totalItems: 0 };

export const cartReducer = createReducer(
  initialState,
  on(addProduct, (state, { product }) => {
    // Check if product is already in the cart
    const existingProduct = state.products.find((p) => p.id === product.id);
    let stateUpdate: CartState;
    if (existingProduct) {
      // If product is already in the cart, increment its quantity
      stateUpdate = {
        products: state.products.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        ),
        total: state.total + product.price,
        totalItems: state.totalItems + 1,
      };
    } else {
      // If product is not in the cart, add it
      stateUpdate = {
        products: [...state.products, { ...product, quantity: 1 }],
        total: state.total + product.price,
        totalItems: state.totalItems + 1,
      };
    }
    _updateStorage(stateUpdate);
    return stateUpdate;
  }),

  on(removeProduct, (state, { productId }) => {
    // Find the product to remove
    const productToRemove = state.products.find((p) => p.id === productId);
    if (!productToRemove) return state;

    // Remove the product from the cart and update the totals
    const updatedState: CartState = {
      products: state.products.filter((p) => p.id !== productId),
      total:
        state.total - productToRemove.price * (productToRemove.quantity || 1),
      totalItems: state.totalItems - (productToRemove.quantity || 1),
    };
    _updateStorage(updatedState);
    return updatedState;
  }),

  on(changeProductQuantity, (state, { productId, newQuantity }) => {
    // Find the index of the product to update
    const productIndex = state.products.findIndex((p) => p.id === productId);
    if (productIndex === -1) return state;

    // Update the product quantity
    const products = [...state.products];
    const oldQuantity = products[productIndex].quantity || 1;
    products[productIndex] = {
      ...products[productIndex],
      quantity: newQuantity,
    };

    const quantityDifference = newQuantity - oldQuantity;

    // Update the totals and products
    const updatedState: CartState = {
      products,
      total: state.total + products[productIndex].price * quantityDifference,
      totalItems: state.totalItems + quantityDifference,
    };
    _updateStorage(updatedState);
    return updatedState;
  })
);
