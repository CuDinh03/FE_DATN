import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {TaiKhoanService} from '../../service/TaiKhoanService';
import {TaiKhoanDto} from '../../model/tai-khoan-dto.model';
import {ApiResponse} from '../../model/ApiResponse';
import {ErrorCode} from '../../model/ErrorCode';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    errorMessage: string = '';
    successMessage: string = '';
    accountForm: FormGroup;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: TaiKhoanService,
        private router: Router
    ) {
        this.accountForm = this.formBuilder.group({
            tenDangNhap: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
            matKhau: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
            xacNhanMatKhau: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
        });
    }

    get f() {
        return this.accountForm.controls;
    }

    createAccount(): void {
        this.submitted = true;
        this.errorMessage = '';
        this.successMessage = '';

        if (this.accountForm.invalid) {
            return;
        }

        const accountData: TaiKhoanDto = this.accountForm.value;
        if (accountData.matKhau !== accountData.xacNhanMatKhau) {
            this.errorMessage = 'Mật khẩu và xác nhận mật khẩu không khớp';
            return;
        }

        const username = this.accountForm.value.tenDangNhap;

        this.accountService.checkUsernameExists(username).subscribe(
            (response: ApiResponse<any>) => {
                if (response.result) {
                    this.errorMessage = 'Tên đăng nhập đã tồn tại.';
                } else {
                    this.accountService.createAccount(accountData)
                        .subscribe(
                            (response: ApiResponse<TaiKhoanDto>) => {
                                this.successMessage = 'Đăng ký thành công! Chuyển hướng đến trang đăng nhập...';
                                setTimeout(() => {
                                    this.router.navigate(['/log-in']);
                                }, 2000);
                            },
                            (error: HttpErrorResponse) => {
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
            },
            (error: HttpErrorResponse) => {
                this.errorMessage = 'Đã xảy ra lỗi khi kiểm tra tên đăng nhập, vui lòng thử lại sau.';
            }
        );
    }
}
