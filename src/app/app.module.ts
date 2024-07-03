import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {AppRoutingModule} from './app-routing.module';
import {AngularFireModule} from '@angular/fire/compat';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {environment} from '../environments/environment';

import {HomeComponent} from './home/home.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {ShoppingCartViewComponent} from './page/shopping-cart-view/shopping-cart-view.component';
import {ProductDetailComponent} from './page/product-detail/product-detail.component';
import {MainViewComponent} from './page/main-view/main-view.component';
import {BannerComponent} from './page/banner/banner.component';
import {PreviewProductComponent} from './page/preview-product/preview-product.component';
import {TrendingProductComponent} from './page/trending-product/trending-product.component';
import {BestSellingProductComponent} from './page/best-selling-product/best-selling-product.component';
import {OfferSectionComponent} from './page/offer-section/offer-section.component';
import {ShopCategoryComponent} from './page/shop-category/shop-category.component';
import {AdminViewComponent} from './admin/admin-view/admin-view.component';
import {AuthenticationLoginComponent} from './auth/authentication-login/authentication-login.component';
import {ShoppingCartComponent} from './page/shopping-cart/shopping-cart.component';
import {RegisterComponent} from './auth/register/register.component';
import {SidebarComponent} from './admin/sidebar/sidebar.component';
import {ProfileComponent} from './page/profile/profile.component';
import {ProductViewComponent} from './admin/product-view/product-view.component';
import {AccountViewComponent} from './admin/account-view/account-view.component';
import {CategoryViewComponent} from './admin/category-view/category-view.component';
import {ShoppingViewComponent} from './admin/shopping-view/shopping-view.component';
import {VoucherViewComponent} from './admin/voucher-view/voucher-view.component';
import {AdminHeaderComponent} from './admin/admin-header/admin-header.component';
import {OrdersViewComponent} from './admin/orders-view/orders-view.component';
import {CustomerViewComponent} from './admin/customer-view/customer-view.component';
import {SidebarProfileComponent} from './page/sidebar-profile/sidebar-profile.component';
import {HistoryViewComponent} from './page/history-view/history-view.component';
import {OrderDetailComponent} from './page/order-detail/order-detail.component';
import {PaymentViewComponent} from './page/payment-view/payment-view.component';
import {ProductDetailViewComponent} from './admin/product-detail-view/product-detail-view.component';
import {ChatLieuViewComponent} from './admin/chatlieu-view/chatlieu-view.component';
import {MauSacViewComponent} from './admin/mausac-view/mausac-view.component';
import {KichThuocViewComponent} from './admin/kichthuoc-view/kichthuoc-view.component';
import {ThuongHieuViewComponent} from './admin/thuonghieu-view/thuonghieu-view.component';
import {HinhAnhViewComponent} from './admin/hinhanh-view/hinhanh-view.component';
import {RatingViewComponent} from './page/rating-view/rating-view.component';
import {MaskValuePipe} from './page/profile/mask-value-pipe';
import {TaiKhoanService} from './service/TaiKhoanService';
import {NgSelectModule} from "@ng-select/ng-select";

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
    AccountViewComponent,
    CategoryViewComponent,
    ShoppingViewComponent,
    VoucherViewComponent,
    AdminHeaderComponent,
    OrdersViewComponent,
    CustomerViewComponent,
    PaymentViewComponent,
    SidebarProfileComponent,
    HistoryViewComponent,
    OrderDetailComponent,
    ChatLieuViewComponent,
    MauSacViewComponent,
    KichThuocViewComponent,
    ThuongHieuViewComponent,
    HinhAnhViewComponent,
    ProductDetailViewComponent,
    RatingViewComponent,
    MaskValuePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    NgSelectModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [
    TaiKhoanService,
    AngularFireAuth,
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [HomeComponent]
})
export class AppModule { }
