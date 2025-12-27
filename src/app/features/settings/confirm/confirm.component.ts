import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Product } from '../../../core/interfaces/product';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
  productService = inject(ProductService);
  cdr = inject(ChangeDetectorRef);
  isDeleting = signal<boolean>(false);
  @Input() product?: Product;
  @Output() close = new EventEmitter<boolean>();

  /**
   * Delete the product
   */
  remove() {
    if (this.product) {
      this.isDeleting.set(true);
      this.productService.delete(this.product.id).subscribe(() => {
        this.close.emit(true);
      });
    }
  }

  /**
   * Close the modal
   */
  closeModal() {
    this.close.emit(false);
  }
}
