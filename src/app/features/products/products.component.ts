import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../core/interfaces/product';
import { ProductService } from '../../core/services/product.service';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../shared/components/base/base.component';
import { ProductPlaceholderComponent } from "./product-placeholder/product-placeholder.component";
import { ProductCardComponent } from "./product-card/product-card.component";
import { NoProductsFoundComponent } from "../../shared/components/no-products-found/no-products-found.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductPlaceholderComponent, ProductCardComponent, NoProductsFoundComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent extends BaseComponent implements OnInit {
  private productService = inject(ProductService);
  isLoading = signal<boolean>(true);
  products = signal<Product[]>([]);
  selectedCategory = signal<string>('all');

  categories = computed(() => {
    const categories = this.products()
      .map((product) => product.category.trim())
      .filter((category) => category.length > 0);

    return Array.from(new Set(categories)).sort((a, b) => a.localeCompare(b));
  });

  filteredProducts = computed(() => {
    const category = this.selectedCategory();

    if (category === 'all') {
      return this.products();
    }

    return this.products().filter(
      (product) => product.category.trim() === category
    );
  });
  
  override ngOnInit(): void {
    super.ngOnInit();
    this.isLoading.set(true);
    this.productService.all().pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading.set(false))
    ).subscribe((products) => {
      this.products.set(products);
    });
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(value);
  }
}