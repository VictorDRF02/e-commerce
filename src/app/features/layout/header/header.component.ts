import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartComponent } from "../cart/cart.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

}
