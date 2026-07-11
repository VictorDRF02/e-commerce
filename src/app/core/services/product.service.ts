import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Product } from '../interfaces/product';
import { map, Observable } from 'rxjs';

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
    return this.http.get<Product[]>(this.url).pipe(
      map((products) => {
        products.forEach(this.parseProductImage);
        return products;
      })
    );
  }

  /**
   * Get a product by its id
   * @param id - Product id
   * @returns {Observable<Product>}
   */
  get(id: number) {
    return this.http.get<Product>(`${this.url}`, { params: { id } }).pipe(
      map((product) => {
        this.parseProductImage(product);
        return product;
      })
    );
  }

  /**
   * Save a product to the api
   * @param product - Product to save
   * @returns {Observable<Product>} An observable of the saved product
   */
  save(product: Product): Observable<Product> {
    if (product.id) {
      return this.http.put<Product>(this.url, product, { params: { id: product.id } });
    } else {
      return this.http.post<Product>(this.url, product);
    }
  }

  /**
   * Delete a product
   * @param id - Product id
   * @returns {Observable<Product>} An observable of the deleted product
   */
  delete(id: any) {
    return this.http.delete<Product>(`${this.url}`, { params: { id } });
  }

  /**
   * Set the product image url
   * @param product - The product to set the image
   */
  parseProductImage(product: Product) {
    if (product.image) {
      product.image = environment.apiUrl + '/uploads/' + product.image;
    }
  }
}
