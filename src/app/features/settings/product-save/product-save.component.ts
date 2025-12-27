import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../../../core/interfaces/product';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-save',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-save.component.html',
})
export class ProductSaveComponent implements OnInit {
  productService = inject(ProductService);
  cdr = inject(ChangeDetectorRef);

  @Input() product?: Product;
  @Output() close = new EventEmitter<boolean>();
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    image: new FormControl('placeholder.png'),
  });

  ngOnInit(): void {
    if (this.product) {
      this.form.patchValue(this.product);
      // TODO: Add logic of import image
      this.form.patchValue({ image: 'placeholder.png' });
      this.cdr.detectChanges();
    }
  }

  /**
   * Save the product
   */
  save() {
    if (this.form.valid) {
      this.productService.save(this.form.value!).subscribe(() => {
        this.close.emit(true);
      });
    }
  }
}
