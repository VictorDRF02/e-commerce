import { Routes } from '@angular/router';
import { LayoutComponent } from './features/layout/layout.component';
import { ProductsComponent } from './features/products/products.component';
import { ProductDetailsComponent } from './features/product-details/product-details.component';
import { LoginComponent } from './features/login/login.component';
import { AccountComponent } from './features/account/account.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ProductsComponent,
      },
      {
        path: 'product/:id',
        component: ProductDetailsComponent,
      },
      {
        path: 'account',
        canActivate: [authGuard],
        component: AccountComponent
      }
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
