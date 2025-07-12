import { Component, inject, OnInit, signal } from '@angular/core';
import { Product, Rating } from '../../core/interfaces/product';
import { ProductService } from '../../core/services/product.service';
import { CurrencyPipe } from '@angular/common';
import { finalize } from 'rxjs';
import { ShortDescriptionPipe } from "../../shared/pipes/short-description.pipe";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe, ShortDescriptionPipe],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  isLoading = signal<boolean>(true);
  products: Product[] = [];
  
  ngOnInit(): void {
    this.isLoading.set(true);
    this.productService.all().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe((products) => {
      this.products = products;
    });
  }
  
  /**
   * Get an array of stars based on the rating
   * @param rating - The rating object
   * @returns An array of stars ('full', 'half', 'empty')
   */
  getStarRating(rating: Rating | undefined): Array<'full' | 'half' | 'empty'> {
    const rate = rating?.rate || 0;
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 > 0.5;
    let starts: Array<'full' | 'half' | 'empty'> = []
    for (let i = 0; i < fullStars; i++) {
      starts.push('full');
    }
    if (hasHalfStar) {
      starts.push('half');
    }
    for (let i = starts.length; i < 5; i++) {
      starts.push('empty');
    }
    return starts;
  }
}