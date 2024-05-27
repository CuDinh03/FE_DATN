import {RouterModule,Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {MainViewComponent} from "./page/main-view/main-view.component";
import {AdminViewComponent} from "./admin/admin-view/admin-view.component";
import {AuthenticationLoginComponent} from "./auth/authentication-login/authentication-login.component";
import {ShopCategoryComponent} from "./page/shop-category/shop-category.component";
import {ProductDetailComponent} from "./page/product-detail/product-detail.component";
import {RegisterComponent} from "./auth/register/register.component";
import {AuthGuard} from "./auth/auth.guard";
import {ShoppingCartComponent} from "./page/shopping-cart/shopping-cart.component";
import {ProfileComponent} from "./page/profile/profile.component";
import {AdminSanphamComponent} from "./admin/admin-sanpham/admin-sanpham.component";

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard], // Sử dụng canActivate với AuthGuard
    children: [
      { path: '', component: AdminViewComponent },
      { path:'san-pham', component: AdminSanphamComponent},
      { path:'hoa-don', component: AdminSanphamComponent},

      // {path:':id', component:AdminViewComponent}
      // Các route con khác của trang admin
    ]
  },
  // Các route khác của ứng dụng
  {path:'trang-chu',component:MainViewComponent},
  {path:'',component:MainViewComponent},
  {path:'log-in',component:AuthenticationLoginComponent},
  {path:'list-p',component:ShopCategoryComponent},
  {path:'detail/:id',component:ProductDetailComponent},
  {path:'register',component:RegisterComponent},
  {path:'shopping-cart',component:ShoppingCartComponent},
  {path:'sign-up',component:RegisterComponent},
  {path:'profile',component:ProfileComponent},
  // { path: '**', redirectTo: '/trang-chu' } // Đường dẫn cho các trang không tồn tại

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
