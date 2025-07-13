import { Component, inject, OnInit, signal } from '@angular/core';
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
  products: Product[] = [];
  
  override ngOnInit(): void {
    super.ngOnInit();
    this.isLoading.set(true);
    this.productService.all().pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading.set(false))
    ).subscribe((products) => {
      this.products = products;
      this.products = []
    });
  }
}