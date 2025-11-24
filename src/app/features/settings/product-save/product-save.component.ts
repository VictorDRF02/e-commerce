import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from "@angular/forms";
import { Product } from '../../../core/interfaces/product';

@Component({
  selector: 'app-product-save',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-save.component.html',
})
export class ProductSaveComponent {
  @Input() product?: Product;
  @Output() close = new EventEmitter<void>()
  form!: FormGroup;
}
