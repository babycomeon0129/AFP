import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionAliveGuard } from 'src/app/shared/auth/session-alive.guard';

import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShoppingComponent } from './shopping/shopping.component';

const routes: Routes = [
  { path: '', canActivate: [SessionAliveGuard],
    children: [
      { path: 'Shopping', canActivate: [SessionAliveGuard], component: ShoppingComponent },
      { path: 'ProductList/:ProductDir_Code', canActivate: [SessionAliveGuard], component: ProductListComponent },
      { path: 'ProductDetail/:ProductDir_Code/:Product_Code', canActivate: [SessionAliveGuard], component: ProductDetailComponent },
      { path: 'ShoppingCart', canActivate: [SessionAliveGuard], component: ShoppingCartComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule {}
