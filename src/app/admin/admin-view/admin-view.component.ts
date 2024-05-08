import { Component } from '@angular/core';
import {AuthenticationService} from "../../service/AuthenticationService";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent {

  accounts: any[] = []; // Định nghĩa mảng chứa danh sách tài khoản

  role:string = '';

  constructor(private http: HttpClient, private auth: AuthenticationService, private router:Router) {
    this.ngOnInit();

  }

  ngOnInit(): void {
    this.getAccounts(); // Gọi phương thức để lấy danh sách tài khoản khi component được khởi tạo
    console.log(this.auth.getRole());
  }

  getAccounts() {
    const token = this.auth.getToken();
    if (!token) {
      console.error('Token not found or invalid');
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.get<any>('http://localhost:9091/api/users/all', { headers }).subscribe(
      response => {
        this.accounts = response.result;
      },
      error => {
        if (error.status === 401) {
          console.error('Unauthorized access, redirecting to login page...');
          // Redirect or show login modal
        } else {
          console.error('Error getting accounts:', error);
        }
      }
    );
  }



  logout() {
    // Gọi phương thức logout từ AuthenticationService
    this.auth.logout();
    // Redirect đến trang đăng nhập sau khi đăng xuất
    this.router.navigate(['/log-in']).then(() => {
      console.log('Redirected to /login');
      this.router.navigate(['/log-in']).then(() => {
        console.log('Redirected to /log-in');
      }).catch(err => {
        console.error('Error navigating to /log-in:', err);
      });
    }).catch(err => {
      console.error('Error navigating to /login:', err);
    });
  }



}
