import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductPlaceholderComponent } from '../products/product-placeholder/product-placeholder.component';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../../core/interfaces/product';
import { ProductService } from '../../core/services/product.service';
import { BaseComponent } from '../../shared/components/base/base.component';
import { finalize, takeUntil } from 'rxjs';
import { NoProductsFoundComponent } from "../../shared/components/no-products-found/no-products-found.component";
import { Location } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ProductPlaceholderComponent,
    ProductCardComponent,
    ReactiveFormsModule,
    NoProductsFoundComponent
],
  templateUrl: './search.component.html',
})
export class SearchComponent extends BaseComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _productService = inject(ProductService);
  location = inject(Location)
  isLoading = signal<boolean>(false);
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  searchForm: FormGroup = this._fb.group(
    {
      search: ['', [Validators.minLength(3)]],
      minPrice: [null, [Validators.min(0)]],
      maxPrice: [null, [Validators.min(0)]],
    },
    { validator: this.priceRangeValidator }
  );

  override ngOnInit() {
    super.ngOnInit();

    this.isLoading.set(true);
    this._productService.all().pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading.set(false))
    ).subscribe((products) => {
      this.allProducts = products;
      this.filteredProducts = [...products];
    });
  }

  /**
   * Validates the price range
   * @returns Error if the min price is greater than the max price
   */
  priceRangeValidator(form: FormGroup) {
    const min = form.get('minPrice')?.value;
    const max = form.get('maxPrice')?.value;

    if (min !== null && max !== null && min > max) {
      return { minMax: true };
    }
    return null;
  }

  /**
   * Applies the search filters to the products
   */
  applyFilters() {
    if (this.searchForm.invalid) return;

    this.filteredProducts = this.allProducts.filter((product) => {
      // Text search filter
      const searchTerm =
        this.searchForm.get('search')?.value?.toLowerCase() || '';
      const matchesSearch =
        searchTerm === '' ||
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm);

      // Price range filter
      const minPrice = this.searchForm.get('minPrice')?.value;
      const maxPrice = this.searchForm.get('maxPrice')?.value;

      const matchesMinPrice = minPrice === null || product.price >= minPrice;
      const matchesMaxPrice = maxPrice === null || product.price <= maxPrice;

      return matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

  }

  /**
   * Clear the filters fields
   */
  clearFilters() {
    this.searchForm.reset({
      search: '',
      minPrice: null,
      maxPrice: null,
    });
    this.filteredProducts = [...this.allProducts];
  }

  /**
   * Get if any field of the form has a value
   */
  hasFiltersApplied(): boolean {
    return this.searchForm.dirty;
  }
}
