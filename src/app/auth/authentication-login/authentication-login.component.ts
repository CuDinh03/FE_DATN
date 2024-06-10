import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from "../../service/AuthenticationService";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-authentication-login',
  templateUrl: './authentication-login.component.html',
  styleUrls: ['./authentication-login.component.css']
})
export class AuthenticationLoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      tenDangNhap: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      matKhau: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    const { tenDangNhap, matKhau } = this.loginForm.value;

    if (tenDangNhap === 'admin' && matKhau === 'admin') {
      this.authService.login(tenDangNhap, matKhau)
        .subscribe(
          response => {
            localStorage.setItem('token', response.result.token); // Simulating token storage for admin
            this.router.navigate(['/admin']).then(() => {
              this.snackBar.open('Đăng nhập thành công!', 'Đóng', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
            }).catch(err => {
              console.error('Lỗi chuyển hướng đến /admin:', err);
            });
          },
          error => {
            this.snackBar.open('Đăng nhập thất bại', 'Đóng', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
            console.error('Đăng nhập thất bại:', error);
          }
        );
    } else {
      if (this.loginForm.invalid) {
        this.snackBar.open('Vui lòng kiểm tra lại thông tin đăng nhập', 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      this.authService.login(tenDangNhap, matKhau)
        .subscribe(
          response => {
            localStorage.setItem('token', response.result.token);
            this.router.navigate(['/trang-chu']).then(() => {
              this.snackBar.open('Đăng nhập thành công!', 'Đóng', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
            }).catch(err => {
              console.error('Lỗi chuyển hướng đến /trang-chu:', err);
            });
          },
          error => {
            this.snackBar.open('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập', 'Đóng', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
            console.error('Đăng nhập thất bại:', error);
          }
        );
    }
  }
}
