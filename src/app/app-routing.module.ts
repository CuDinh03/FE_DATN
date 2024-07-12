import {OrderDetailComponent} from './page/order-detail/order-detail.component';
import {HistoryViewComponent} from './page/history-view/history-view.component';
import {OrdersViewComponent} from './admin/orders-view/orders-view.component';
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
import {VoucherViewComponent} from "./admin/voucher-view/voucher-view.component";
import {CustomerViewComponent} from "./admin/customer-view/customer-view.component";
import {PaymentViewComponent} from "./page/payment-view/payment-view.component";
import { ProductDetailViewComponent } from './admin/product-detail-view/product-detail-view.component';
import { ChatLieuViewComponent } from './admin/chatlieu-view/chatlieu-view.component';
import { MauSacViewComponent } from './admin/mausac-view/mausac-view.component';
import { KichThuocViewComponent } from './admin/kichthuoc-view/kichthuoc-view.component';
import { ThuongHieuViewComponent } from './admin/thuonghieu-view/thuonghieu-view.component';
import { HinhAnhViewComponent } from './admin/hinhanh-view/hinhanh-view.component';
import { SidebarProfileComponent } from './page/sidebar-profile/sidebar-profile.component';
import { ProfileComponent } from './page/profile/profile.component';
import {RatingViewComponent} from "./page/rating-view/rating-view.component";

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard], // Sử dụng canActivate với AuthGuard
    children: [
      {path: '', component: AdminViewComponent},
      {path: 'tai-khoan', component: AccountViewComponent},
      {path: 'san-pham', component: ProductViewComponent},
      {path: 'danh-muc', component: CategoryViewComponent},
      {path: 'chat-lieu', component: ChatLieuViewComponent},
      {path: 'mau-sac', component: MauSacViewComponent},
      {path: 'kich-thuoc', component: KichThuocViewComponent},
      {path: 'thuong-hieu', component: ThuongHieuViewComponent},
      {path: 'hinh-anh', component: HinhAnhViewComponent},
      {path: 'shopping', component: ShoppingViewComponent},
      {path: 'voucher', component: VoucherViewComponent},
      {path:'hoa-don',component:OrdersViewComponent},
      {path:'khach-hang',component:CustomerViewComponent},
      { path: 'san-pham-chi-tiet', component: ProductDetailViewComponent }

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
  {path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard]},
  {path: 'sign-up', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'san-pham', component: ProductDetailComponent},
  { path: 'don-mua', component: HistoryViewComponent },
  { path: 'order-detail', component: OrderDetailComponent },
  {path: 'thanh-toan', component: PaymentViewComponent, canActivate:[AuthGuard]},
  {path: 'danh-gia', component: RatingViewComponent,},
  // { path: '**', redirectTo: '/trang-chu' } // Đường dẫn cho các trang không tồn tại

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
