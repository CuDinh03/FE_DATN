import {ShoppingViewComponent} from './admin/shopping-view/shopping-view.component';
import {CategoryViewComponent} from './admin/category-view/category-view.component';
import {AccountViewComponent} from './admin/account-view/account-view.component';
import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {MainViewComponent} from "./page/main-view/main-view.component";
import {AdminViewComponent} from "./admin/admin-view/admin-view.component";
import {AuthenticationLoginComponent} from "./auth/authentication-login/authentication-login.component";
import {ShopCategoryComponent} from "./page/shop-category/shop-category.component";
import {ProductDetailComponent} from "./page/product-detail/product-detail.component";
import {RegisterComponent} from "./auth/register/register.component";
import {AuthGuard} from "./auth/auth.guard";
import {ShoppingCartComponent} from "./page/shopping-cart/shopping-cart.component";
import {ProductViewComponent} from "./admin/product-view/product-view.component";
import {ProfileComponent} from "./page/profile/profile.component";
import {VoucherViewComponent} from "./admin/voucher-view/voucher-view.component";

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard], // Sử dụng canActivate với AuthGuard
    children: [
      {path: '', component: AdminViewComponent},
      {path: 'tai-khoan', component: AccountViewComponent},
      {path: 'san-pham', component: ProductViewComponent},
      {path: 'danh-muc', component: CategoryViewComponent},
      {path: 'shopping', component: ShoppingViewComponent},
      {path: 'voucher', component: VoucherViewComponent},
      // Các route con khác của trang admin
    ]
  },
  // Các route khác của ứng dụng
  {path: 'trang-chu', component: MainViewComponent},
  {path: '', component: MainViewComponent},
  {path: 'log-in', component: AuthenticationLoginComponent},
  {path: 'list-p', component: ShopCategoryComponent},
  {path: 'detail/:id', component: ProductDetailComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'sign-up', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  // { path: '**', redirectTo: '/trang-chu' } // Đường dẫn cho các trang không tồn tại

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
