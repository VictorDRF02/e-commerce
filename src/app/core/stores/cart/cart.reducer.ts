import { createReducer, on } from '@ngrx/store';
import { addProduct, changeProductQuantity, removeProduct } from './cart.actions';
import { Product } from '../../interfaces/product';

export interface CartState {
  products: Product[];
  total: number;
  totalItems: number;
}

export const initialState: CartState = {
  products: [],
  total: 0,
  totalItems: 0,
};

export const cartReducer = createReducer(
  initialState,
  on(addProduct, (state, { product }) => {
    // Check if product is already in the cart
    const existingProduct = state.products.find((p) => p.id === product.id);

    if (existingProduct) {
      // If product is already in the cart, increment its quantity
      return {
        products: state.products.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        ),
        total: state.total + product.price,
        totalItems: state.totalItems + 1,
      };
    } else {
      // If product is not in the cart, add it
      return {
        products: [...state.products, { ...product, quantity: 1 }],
        total: state.total + product.price,
        totalItems: state.totalItems + 1,
      };
    }
  }),

  on(removeProduct, (state, { productId }) => {
    // Find the product to remove
    const productToRemove = state.products.find((p) => p.id === productId);
    if (!productToRemove) return state;

    // Remove the product from the cart and update the totals
    return {
      products: state.products.filter((p) => p.id !== productId),
      total: state.total - productToRemove.price * (productToRemove.quantity || 1),
      totalItems: state.totalItems - (productToRemove.quantity || 1),
    };
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
    return {
      products,
      total: state.total + products[productIndex].price * quantityDifference,
      totalItems: state.totalItems + quantityDifference,
    };
  })
);