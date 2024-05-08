import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from "../service/AuthenticationService";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {
  }
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Người dùng đã đăng nhập, cho phép truy cập
    } else {
      this.router.navigate(['/log-in']);
      return false;
    }
  }

}
