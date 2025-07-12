import { Routes } from '@angular/router';
import { LayoutComponent } from './features/layout/layout.component';
import { ProductsComponent } from './features/products/products.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: ProductsComponent
            }
        ]
    }
];
