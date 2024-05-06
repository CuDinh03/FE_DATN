import {RouterModule,Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {MainViewComponent} from "./page/main-view/main-view.component";
import {AdminViewComponent} from "./admin/admin-view/admin-view.component";
import {AuthenticationLoginComponent} from "./auth/authentication-login/authentication-login.component";

const routes: Routes = [
  {path:'trang-chu',component:MainViewComponent},
  {path:'admin',component:AdminViewComponent},
  {path:'log-in',component:AuthenticationLoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
