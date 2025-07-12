import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  protected http = inject(HttpClient);

  get url() {
    return `${environment.apiUrl}/products`;
  }

  /**
   * Get all products from the api
   * @returns {Observable<Product[]>} An observable of the products
   */
  all() {
    return this.http.get<Product[]>(this.url);
  }

  /**
   * Get a product by its id
   * @param id - Product id
   * @returns {Observable<Product>}
   */
  get(id: number) {
    return this.http.get<Product>(`${this.url}/${id}`);
  }
}
