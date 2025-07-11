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
    const existingProduct = state.products.find((p) => p.id === product.id);

    if (existingProduct) {
      return {
        products: state.products.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        ),
        total: state.total + product.price,
        totalItems: state.totalItems + 1,
      };
    } else {
      return {
        products: [...state.products, { ...product, quantity: 1 }],
        total: state.total + product.price,
        totalItems: state.totalItems + 1,
      };
    }
  }),

  on(removeProduct, (state, { productId }) => {
    const productToRemove = state.products.find((p) => p.id === productId);
    if (!productToRemove) return state;

    return {
      products: state.products.filter((p) => p.id !== productId),
      total: state.total - productToRemove.price * (productToRemove.quantity || 1),
      totalItems: state.totalItems - (productToRemove.quantity || 1),
    };
  }),
  
  on(changeProductQuantity, (state, { productId, newQuantity }) => {
    const productIndex = state.products.findIndex((p) => p.id === productId);
    if (productIndex === -1) return state;

    const products = [...state.products];
    const oldQuantity = products[productIndex].quantity || 1;
    products[productIndex] = {
      ...products[productIndex],
      quantity: newQuantity,
    };

    const quantityDifference = newQuantity - oldQuantity;

    return {
      products,
      total: state.total + products[productIndex].price * quantityDifference,
      totalItems: state.totalItems + quantityDifference,
    };
  })
);