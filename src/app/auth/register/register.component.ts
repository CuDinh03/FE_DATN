import {Component} from '@angular/core';
import {TaiKhoanDto} from "../../model/tai-khoan-dto.model";
import {TaiKhoanService} from "../../service/TaiKhoanService";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiResponse} from "../../model/ApiResponse";
import {Router} from "@angular/router";
import {ErrorCode} from "../../model/ErrorCode";
import {HttpErrorResponse} from "@angular/common/http";


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {

    errorMessage: string = '';
    accountForm: FormGroup; // Sử dụng FormGroup để quản lý form và validation
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: TaiKhoanService,
        private router: Router
    ) {
        this.accountForm = this.formBuilder.group({
            tenDangNhap: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
            matKhau: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
            xacNhanMatKhau: ['', [Validators.required,Validators.minLength(8), Validators.maxLength(16)]]
        });
    }

    get f() {
        return this.accountForm.controls;
    }

    createAccount(): void {
      this.submitted = true;
      if (this.accountForm.invalid) {
        return;
      }
      const accountData: TaiKhoanDto = this.accountForm.value;
      if (accountData.matKhau !== accountData.xacNhanMatKhau) {
        console.error('Mật khẩu và xác nhận mật khẩu không khớp');
        this.errorMessage = 'Mật khẩu và xác nhận mật khẩu không khớp';
        return;
      }

      this.accountService.createAccount(accountData)
        .subscribe(
          (response: ApiResponse<TaiKhoanDto>) => {
            console.log(response);
            this.router.navigate(['/log-in']);
          },
          (error: HttpErrorResponse) => {
            console.error(error);
            if (error.error.code === ErrorCode.ACCOUNT_EXISTED) {
              this.errorMessage = 'Tài khoản đã tồn tại.';
            } else if (error.error.code === ErrorCode.USERNAME_INVALID) {
              this.errorMessage = 'Tên đăng nhập không hợp lệ.';
            } else if (error.error.code === ErrorCode.PASSWORD_INVALID) {
              this.errorMessage = 'Mật khẩu không hợp lệ.';
            } else {
              this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau.';
            }
          }
        );
    }


}
