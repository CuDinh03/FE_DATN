import { Component } from '@angular/core';
import {AuthenticationService} from "../service/AuthenticationService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private auth: AuthenticationService, private router: Router) {
  }

  isLoggedIn(): boolean {
   return this.auth.isLoggedIn();
  }

  getAccount(): boolean{
    if (this.auth.getRole() == 'ADMIN'){
      return true;
    }
    return false;

  }

  logout() {
    // Gọi phương thức logout từ AuthenticationService
    this.auth.logout();
    // Redirect đến trang đăng nhập sau khi đăng xuất
    this.router.navigate(['/trang-chu']).then(() => {
      console.log('Redirected to /trang-chu');
      this.router.navigate(['/trang-chu']).then(() => {
        console.log('Redirected to /trang-chu');
      }).catch(err => {
        console.error('Error navigating to /trang-chu:', err);
      });
    }).catch(err => {
      console.error('Error navigating to /trang-chu:', err);
    });
  }

}
