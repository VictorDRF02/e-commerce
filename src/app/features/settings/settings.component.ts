import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../shared/components/base/base.component';
import { takeUntil, finalize } from 'rxjs';
import { Product } from '../../core/interfaces/product';
import { ProductService } from '../../core/services/product.service';
import { ProductPlaceholderComponent } from '../products/product-placeholder/product-placeholder.component';
import { NoProductsFoundComponent } from '../../shared/components/no-products-found/no-products-found.component';
import { ProductItemListComponent } from './product-item-list/product-item-list.component';
import { ProductSaveComponent } from './product-save/product-save.component';
import { ConfirmComponent } from './confirm/confirm.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ProductPlaceholderComponent,
    NoProductsFoundComponent,
    ProductItemListComponent,
    ProductSaveComponent,
    ConfirmComponent,
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent extends BaseComponent implements OnInit {
  private productService = inject(ProductService);
  isLoading = signal<boolean>(true);
  showSave = signal<boolean>(false);
  showConfirm = signal<boolean>(false);
  products: Product[] = [];
  selectedProduct?: Product;

  override ngOnInit(): void {
    super.ngOnInit();
    this.getProducts();
  }

  /**
   * Gets all products from the api
   */
  private getProducts() {
    this.isLoading.set(true);
    this.productService
      .all()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((products) => {
        this.products = products;
      });
  }

  /**
   * Shows or hides the save component
   */
  toggleSave(reload?: boolean) {
    this.showSave.update((v) => !v);
    if (reload) {
      this.getProducts();
    }
  }

  /**
   * Shows or hides the confirm component
   */
  toggleConfirm(reload?: boolean) {
    this.showConfirm.update((v) => !v);
    if (reload) {
      this.getProducts();
    }
  }

  /**
   * Opens the edit product
   * @param product - Product to edit
   */
  edit(product: Product) {
    this.selectedProduct = product;
    this.toggleSave();
  }

  /** Opens the delete product */
  remove(product: Product) {
    this.selectedProduct = product;
    this.toggleConfirm();
  }

  /**
   * Opens the create product
   */
  add() {
    this.selectedProduct = undefined;
    this.toggleSave();
  }
}
