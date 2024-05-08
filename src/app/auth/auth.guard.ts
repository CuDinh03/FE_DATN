import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../service/AuthenticationService";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      if (this.authService.getRole() == 'ADMIN'){
        return true
      }else {
        this.router.navigate(['trang-chu']);
        return false;
      }
    } else {
      this.router.navigate(['/log-in']);
      return false;
    }
  }

}
