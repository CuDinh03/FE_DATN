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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TaiKhoanService} from "./service/TaiKhoanService";
import {HttpClientModule} from "@angular/common/http";
import { ShoppingCartComponent } from './page/shopping-cart/shopping-cart.component';
import { RegisterComponent } from './auth/register/register.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { ProfileComponent } from './page/profile/profile.component';
import { ProductViewComponent } from './admin/product-view/product-view.component';
import { AccountViewComponent } from './admin/account-view/account-view.component';

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
    AuthenticationLoginComponent,
    ShoppingCartComponent,
    RegisterComponent,
    SidebarComponent,
    ProfileComponent,
    ProductViewComponent,
    AccountViewComponent
    
    ],
  imports: [
    BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
  ],
  providers: [TaiKhoanService],
  bootstrap: [HomeComponent]
})
export class AppModule {
}
