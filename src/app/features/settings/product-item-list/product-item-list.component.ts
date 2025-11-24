import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../core/interfaces/product';
import { CurrencyPipe } from '@angular/common';
import { ShortDescriptionPipe } from "../../../shared/pipes/short-description.pipe";

@Component({
  selector: 'app-product-item-list',
  standalone: true,
  imports: [CurrencyPipe, ShortDescriptionPipe],
  templateUrl: './product-item-list.component.html',
})
export class ProductItemListComponent {
  @Input() product!: Product;
  @Output() edit = new EventEmitter<void>()
  @Output() remove = new EventEmitter<void>()
}
