import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import {AdminViewComponent} from "./admin/admin-view/admin-view.component";
import {AccountViewComponent} from "./admin/account-view/account-view.component";
import {ProductViewComponent} from "./admin/product-view/product-view.component";
import {CategoryViewComponent} from "./admin/category-view/category-view.component";
import {ChatLieuViewComponent} from "./admin/chatlieu-view/chatlieu-view.component";
import {MauSacViewComponent} from "./admin/mausac-view/mausac-view.component";
import {ProductDetailViewComponent} from "./admin/product-detail-view/product-detail-view.component";
import {KichThuocViewComponent} from "./admin/kichthuoc-view/kichthuoc-view.component";
import {ThuongHieuViewComponent} from "./admin/thuonghieu-view/thuonghieu-view.component";
import {HinhAnhViewComponent} from "./admin/hinhanh-view/hinhanh-view.component";
import {ShoppingViewComponent} from "./admin/shopping-view/shopping-view.component";
import {VoucherViewComponent} from "./admin/voucher-view/voucher-view.component";
import {OrdersViewComponent} from "./admin/orders-view/orders-view.component";
import {CustomerViewComponent} from "./admin/customer-view/customer-view.component";

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminViewComponent,
    canActivate: [AuthGuard],
    children: [
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
      {path: 'hoa-don', component: OrdersViewComponent},
      {path: 'khach-hang', component: CustomerViewComponent},
      {path: 'san-pham-chi-tiet', component: ProductDetailViewComponent}
    ],

  }
];


@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
