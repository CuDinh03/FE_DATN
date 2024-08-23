import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin-routing.module').then(m => m.AdminRoutingModule) },
  { path: 'customer', loadChildren: () => import('./customer-routing.module').then(m => m.CustomerRoutingModule) },
  { path: '', loadChildren: () => import('./guest-routing.module').then(m => m.GuestRoutingModule) },
  { path: '**', redirectTo: '/trang-chu' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
