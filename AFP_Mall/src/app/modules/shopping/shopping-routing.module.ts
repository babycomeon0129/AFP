import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShoppingComponent } from './shopping/shopping.component';



const routes: Routes = [
  { path: '', component: ShoppingComponent },
  { path: 'ProductList/:ProductDir_Code', component: ProductListComponent },
  { path: 'ProductDetail/:ProductDir_Code/:Product_Code', component: ProductDetailComponent },
  { path: 'ShoppingCart', component: ShoppingCartComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule {}
