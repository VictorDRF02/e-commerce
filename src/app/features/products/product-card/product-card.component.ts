import { Component, Input } from '@angular/core';
import { Product, Rating } from '../../../core/interfaces/product';
import { CurrencyPipe } from '@angular/common';
import { ShortDescriptionPipe } from '../../../shared/pipes/short-description.pipe';
import { CartActionDirective } from '../../../shared/directives/cart-action.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, ShortDescriptionPipe, CartActionDirective, RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() product!: Product;

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
