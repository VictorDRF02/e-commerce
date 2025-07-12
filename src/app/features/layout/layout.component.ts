import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CartComponent } from './cart/cart.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, CartComponent, RouterOutlet],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {}
