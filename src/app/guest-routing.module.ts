import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticationLoginComponent} from "./auth/authentication-login/authentication-login.component";
import {ShopCategoryComponent} from "./page/shop-category/shop-category.component";
import {ProductDetailComponent} from "./page/product-detail/product-detail.component";
import {RegisterComponent} from "./auth/register/register.component";
import {RatingViewComponent} from "./page/rating-view/rating-view.component";
import {DemoComponent} from "./demo/demo.component";
import {TrangChuComponent} from "./page/trang-chu/trang-chu.component";


const guestRoutes: Routes = [
  { path: 'trang-chu', component: TrangChuComponent },
  { path: '', component: TrangChuComponent },
  { path: 'log-in', component: AuthenticationLoginComponent },
  { path: 'list-p', component: ShopCategoryComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sign-up', component: RegisterComponent },
  { path: 'danh-gia', component: RatingViewComponent },
  { path: 'demo', component: DemoComponent },
  {path: 'san-pham', component:ProductDetailComponent},
  { path: 'demo', component: DemoComponent },
  { path: 'san-pham', component: ProductDetailComponent },
  { path: 'list-product', component: ShopCategoryComponent }

];

@NgModule({
  imports: [RouterModule.forChild(guestRoutes)],
  exports: [RouterModule]
})
export class GuestRoutingModule {}
