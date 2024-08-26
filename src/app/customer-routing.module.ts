import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartComponent } from './page/shopping-cart/shopping-cart.component';
import { ProfileComponent } from './page/profile/profile.component';
import { HistoryViewComponent } from './page/history-view/history-view.component';
import { OrderDetailComponent } from './page/order-detail/order-detail.component';
import { PaymentViewComponent } from './page/payment-view/payment-view.component';
import { AuthGuard } from './auth/auth.guard';
import {MainViewComponent} from "./page/main-view/main-view.component";
import {ProductDetailComponent} from "./page/product-detail/product-detail.component";
import {RatingViewComponent} from "./page/rating-view/rating-view.component";

const customerRoutes: Routes = [
  {
    path: '',
    component:MainViewComponent,
    canActivate: [AuthGuard], // Bảo vệ bằng AuthGuard
    children: [
      { path: 'shopping-cart', component: ShoppingCartComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'don-mua', component: HistoryViewComponent },
      { path: 'order-detail', component: OrderDetailComponent },
      { path: 'thanh-toan', component: PaymentViewComponent },
      {path: 'san-pham', component:ProductDetailComponent},
      { path: 'order-detail/:id', component: OrderDetailComponent },
      { path: 'danh-gia', component: RatingViewComponent },

    ],
  }

];

@NgModule({
  imports: [RouterModule.forChild(customerRoutes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {}
