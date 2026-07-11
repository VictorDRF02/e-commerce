export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  /** TODO: Add ratings */
  rating?: Rating;
  // Inner logic
  quantity?: number;
}

export interface Rating {
  rate: number;
  count: number;
}
