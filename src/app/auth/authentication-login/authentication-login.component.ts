import { Component } from '@angular/core';
import {AuthenticationService} from "../../service/AuthenticationService";
import { Router } from '@angular/router';


@Component({
  selector: 'app-authentication-login',
  templateUrl: './authentication-login.component.html',
  styleUrls: ['./authentication-login.component.css']
})
export class AuthenticationLoginComponent {
  tenDangNhap: string = '';
  matKhau: string = '';

  constructor(private authService: AuthenticationService,private router: Router) { }

  onSubmit() {
    this.authService.login(this.tenDangNhap, this.matKhau)
      .subscribe(
        response => {
          // Lưu token vào localStorage
          localStorage.setItem('token', response.result.token);
          if (this.authService.getRole()=='ADMIN'){
            // Redirect sau khi đăng nhập thành công
            this.router.navigate(['/admin']).then(() => {
              console.log('Redirected to /admin');
            }).catch(err => {
              console.error('Error navigating to /admin:', err);
            });
          }else {
            this.router.navigate(['trang-chu']).then(():void =>{
              console.log('Redirected to /trang-chu');
            }).catch(err =>{
              console.error('Error navigating to /trang-chu:', err);
            })
          }


        },
        error => {
          // Xử lý lỗi đăng nhập (hiển thị thông báo lỗi, v.v.)
          console.error('Đăng nhập thất bại:', error);
        }
      );
  }


}
