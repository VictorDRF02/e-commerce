import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../shared/components/base/base.component';
import { Product, Rating } from '../../core/interfaces/product';
import { ProductService } from '../../core/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { finalize, takeUntil } from 'rxjs';
import { CurrencyPipe, Location, UpperCasePipe } from '@angular/common';
import { CartActionDirective } from '../../shared/directives/cart-action.directive';
import { ProductDetailsPlaceholderComponent } from './product-details-placeholder/product-details-placeholder.component';
import { ProductDetailsEmptyComponent } from './product-details-empty/product-details-empty.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    UpperCasePipe,
    CurrencyPipe,
    CartActionDirective,
    ProductDetailsPlaceholderComponent,
    ProductDetailsEmptyComponent,
  ],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent extends BaseComponent implements OnInit {
  activeRoute = inject(ActivatedRoute);
  productService = inject(ProductService);
  location = inject(Location);
  isLoading = signal(false);
  product?: Product;

  override ngOnInit(): void {
    super.ngOnInit();
    const id = this.activeRoute.snapshot.params['id'];
    if (id) {
      this.isLoading.set(true);
      this.productService
        .get(id)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isLoading.set(false))
        )
        .subscribe((res) => (this.product = res));
    }
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
    let starts: Array<'full' | 'half' | 'empty'> = [];
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
