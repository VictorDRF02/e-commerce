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
    image: new FormControl('placeholder.svg'),
  });
  imagePreview = 'placeholder.svg';
  selectedImageName = '';
  isUploadingImage = false;

  ngOnInit(): void {
    if (this.product) {
      this.form.patchValue(this.product);
      this.imagePreview = this.product.image;
      this.selectedImageName = this.extractImageName(this.product.image);
    } else {
      this.imagePreview = 'placeholder.svg';
    }

    this.cdr.detectChanges();
  }

  /**
   * Upload image and assign its filename to the form value.
   */
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.isUploadingImage = true;
    this.productService.uploadImage(file).subscribe({
      next: ({ filename, url }) => {
        this.form.patchValue({ image: filename });
        this.imagePreview = url;
        this.selectedImageName = filename;
        this.isUploadingImage = false;
      },
      error: () => {
        this.isUploadingImage = false;
      },
    });
  }

  /**
   * Save the product
   */
  save() {
    if (this.form.valid && !this.isUploadingImage) {
      this.productService.save(this.form.value!).subscribe(() => {
        this.close.emit(true);
      });
    }
  }

  private extractImageName(image: string) {
    const normalizedImage = String(image ?? '').trim();
    if (!normalizedImage) {
      return '';
    }

    const lastSlash = normalizedImage.lastIndexOf('/');
    return lastSlash === -1 ? normalizedImage : normalizedImage.slice(lastSlash + 1);
  }
}
