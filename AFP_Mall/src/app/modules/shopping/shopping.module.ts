import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { NgxMasonryModule } from 'ngx-masonry';

import { ShoppingRoutingModule } from './shopping-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForAppModule } from '../for-app/for-app.module';

import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShoppingComponent } from './shopping/shopping.component';

@NgModule({
  declarations: [
    ShoppingComponent,
    ProductListComponent,
    ProductDetailComponent,
    ShoppingCartComponent
  ],
  exports: [
    ShoppingComponent,
    ProductListComponent,
    ProductDetailComponent,
    ShoppingCartComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShoppingRoutingModule,
    FormsModule,
    LazyLoadImageModule,
    NgxUsefulSwiperModule,
    SharedModule,
    ForAppModule,
    NgxMasonryModule
  ]
})
export class ShoppingModule {}
