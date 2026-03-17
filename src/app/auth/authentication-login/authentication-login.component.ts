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
      tenDangNhap: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      matKhau: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.snackBar.open('Vui lòng nhập tên đăng nhập và mật khẩu.', 'Đóng', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const { tenDangNhap, matKhau } = this.loginForm.value;

    this.authService.login(tenDangNhap, matKhau).subscribe({
      next: () => {
        this.snackBar.open('Đăng nhập thành công!', 'Đóng', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        const role = this.authService.getRole();
        if (role != null && role.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin/dash-board']);
        } else {
          this.router.navigate(['/trang-chu']);
        }
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'Đăng nhập thất bại. Kiểm tra lại tên đăng nhập và mật khẩu.';
        this.snackBar.open(msg, 'Đóng', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
