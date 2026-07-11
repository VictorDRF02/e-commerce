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

  get uploadsUrl() {
    return `${environment.apiUrl}/uploads`;
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
    const payload = {
      ...product,
      image: this.toStoredImageValue(product.image),
    };

    if (product.id) {
      return this.http.put<Product>(this.url, payload, { params: { id: product.id } });
    } else {
      return this.http.post<Product>(this.url, payload);
    }
  }

  /**
   * Upload a product image to the API.
   * @param file - Image file selected by the user.
   */
  uploadImage(file: File): Observable<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ filename: string; url: string }>(this.uploadsUrl, formData);
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
    if (!product.image) {
      return;
    }

    const image = String(product.image).trim();
    if (/^https?:\/\//i.test(image)) {
      product.image = image;
      return;
    }

    product.image = `${this.uploadsUrl}/${image}`;
  }

  /**
   * Convert API image URL back to the persisted filename when needed.
   */
  private toStoredImageValue(image: string): string {
    const normalizedImage = String(image ?? '').trim();
    if (!normalizedImage) {
      return 'placeholder.svg';
    }

    const uploadsPrefix = `${this.uploadsUrl}/`;
    if (normalizedImage.startsWith(uploadsPrefix)) {
      return normalizedImage.slice(uploadsPrefix.length);
    }

    return normalizedImage;
  }
}
