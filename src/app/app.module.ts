import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HomeComponent} from './home/home.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {ShoppingCartViewComponent} from './page/shopping-cart-view/shopping-cart-view.component';
import {ProductDetailComponent} from './page/product-detail/product-detail.component';
import {MainViewComponent} from "./page/main-view/main-view.component";
import { BannerComponent } from './page/banner/banner.component';
import { PreviewProductComponent } from './page/preview-product/preview-product.component';
import { TrendingProductComponent } from './page/trending-product/trending-product.component';
import { BestSellingProductComponent } from './page/best-selling-product/best-selling-product.component';
import { OfferSectionComponent } from './page/offer-section/offer-section.component';
import { ShopCategoryComponent } from './page/shop-category/shop-category.component';
import {AppRoutingModule} from "./app-routing.module";
import { AdminViewComponent } from './admin/admin-view/admin-view.component';
import { AuthenticationLoginComponent } from './auth/authentication-login/authentication-login.component';
import {FormsModule} from "@angular/forms";
import {TaiKhoanService} from "./service/TaiKhoanService";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [

    HomeComponent,
    HeaderComponent,
    MainViewComponent,
    FooterComponent,
    ShoppingCartViewComponent,
    ProductDetailComponent,
    BannerComponent,
    PreviewProductComponent,
    TrendingProductComponent,
    BestSellingProductComponent,
    OfferSectionComponent,
    ShopCategoryComponent,
    AdminViewComponent,
    AuthenticationLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [TaiKhoanService],
  bootstrap: [HomeComponent]
})
export class AppModule {
}
