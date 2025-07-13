import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-product-details-empty',
  standalone: true,
  imports: [],
  templateUrl: './product-details-empty.component.html',
})
export class ProductDetailsEmptyComponent {
  location = inject(Location)
}
