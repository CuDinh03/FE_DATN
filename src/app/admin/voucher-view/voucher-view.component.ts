import {Component} from '@angular/core';
import {AuthenticationService} from "../../service/AuthenticationService";
import { Router} from "@angular/router";
import {FormGroup, FormBuilder} from "@angular/forms";
import {DanhMucService} from "../../service/DanhMucService";
import {VoucherService} from "../../service/VoucherService";

@Component({
    selector: 'app-voucher-view',
    templateUrl: './voucher-view.component.html',
    styleUrls: ['./voucher-view.component.css']
})
export class VoucherViewComponent {

    vouchers: any[] = [];
    totalElements = 0;
    totalPages = 0;
    currentPage = 0;
    pageSize = 5;
    startFrom = 1;
    submitted = false;
    errorMessage: string = '';
    voucherForm: FormGroup;

    constructor(private apiService: VoucherService, private formBuilder: FormBuilder,
                private router: Router, private auth: AuthenticationService) {

        this.voucherForm = this.formBuilder.group({
            ma: [''],
            ten: [''],
            loaiGiamGia: [''],
            ngayBatDau: [''],
            ngayKetThuc: [''],
            giaTriGiam: [''],
            giaTriToiThieu: [''],
            soLuong: [''],
            trangThai: [''],
        });

    };
    ngOnInit(): void {
        this.loadVoucher();
    }

    get f(){
        return this.voucherForm.controls;
    }

    loadVoucher():void{
        this.apiService.getVouchers(this.currentPage, this.pageSize)
            .subscribe(response => {
                this.vouchers = response.result.content;
                this.totalElements = response.result.totalElements;
                this.totalPages = response.result.totalPages;
                console.log("view voucher");
            });
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadVoucher();
    }
    createVoucher(){

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
