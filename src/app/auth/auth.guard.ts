import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../service/AuthenticationService";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private authService: AuthenticationService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getRole();
      const url: string = state.url;

      if (url.startsWith('/admin')) {
        if (role === 'ROLE_ADMIN') {
          return true;
        } else {
          this.router.navigate(['/trang-chu']);
          return false;
        }
      }
      if (url.startsWith('/customer')) {
        if (role === 'ROLE_CUSTOMER') {
          return true;
        } else {
          this.router.navigate(['/trang-chu']);
          return false;
        }
      }

      this.router.navigate(['/trang-chu']);
      return false;
    } else {
      this.router.navigate(['/log-in']);
      return false;
    }
  }

}