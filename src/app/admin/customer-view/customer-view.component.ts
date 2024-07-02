import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ErrorCode } from 'src/app/model/ErrorCode';
import { KhachHangDto } from 'src/app/model/khachHangDto';
import { TaiKhoanDto } from 'src/app/model/tai-khoan-dto.model';
import { AuthenticationService } from 'src/app/service/AuthenticationService';
import { KhachHangService } from 'src/app/service/KhachHangService';
import { TaiKhoanService } from 'src/app/service/TaiKhoanService';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  template:`<input type="text" [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Search khachHang"/>`,
  
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit{
  // khachHang: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  showSuccessAlert = false;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  khachHangForm: FormGroup; 
  id: string;
  successMessage = '';
  selectedDanhMuc: KhachHangDto | null = null;
  isEditMode = false;
  taiKhoanList: TaiKhoanDto[] = [];

  // searchTerm: string = '';
  // search: any;
  // keyword: any;

  ten: string = '';
  khachHangs: any = [];

  constructor(
    private apiService: KhachHangService, 
    private formBuilder: FormBuilder,
    private router: Router, 
    private auth: AuthenticationService, 
    private route: ActivatedRoute,
    private taiKhoanService: TaiKhoanService
  ) {
    this.khachHangForm = this.formBuilder.group({
      ten: ['', [Validators.required]],
      ma: [''],
      id: [''],
      // taiKhoan:[''],
      taiKhoan: Object,
      email:[''],
      sdt:[''],
      gioiTinh:[''],
      ngaySinh:[''],
      diaChi:[''],
      trangThai: ['']
    });

    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadKhachHang();
    if (this.id) {
      this.findById(this.id);
    }
    this.loadTaiKhoan();
    this.loadVoucher();
    
  }

  get f() {
    return this.khachHangForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.khachHangForm.invalid) {
      return;
    }
    if (this.isEditMode) {
      this.updateKhachHang();
    } else {
      this.createKhachHang();
    }
  }

  loadKhachHang(): void {
    this.apiService.getKhs(this.currentPage, this.pageSize)
      .subscribe(response => {
        
        this.khachHangs = response.result.content;
    
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadKhachHang();
    this.loadVoucher();
  }

  createKhachHang(): void {
    this.submitted = true;
    if (this.khachHangForm.invalid) {
      return;
    }
    const khachHangData: KhachHangDto = this.khachHangForm.value;
    this.apiService.createKhachHang(khachHangData)
      .subscribe(
        (data: ApiResponse<KhachHangDto>) => {
          this.showSuccessAlert = true;
          this.successMessage = 'Thêm thành công'
          this.loadKhachHang();
          setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
          this.khachHangForm.reset();
          this.isEditMode = false;
        },
        (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  updateKhachHang(): void {
    this.submitted = true;
    if (this.khachHangForm.invalid) {
      return;
    }
    const khachHangData: KhachHangDto = this.khachHangForm.value;
    this.apiService.updateKhachHang(khachHangData.id, khachHangData).subscribe(
      () => {
        this.showSuccessAlert = true;
        this.successMessage = 'Sửa thành công'
        this.loadKhachHang();
        setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
        this.khachHangForm.reset();
        this.isEditMode = false; // Đặt lại chế độ
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);
      }
    );
  }

  

  findById(id: string): void {
    this.apiService.findById(id)
      .subscribe(
        (response: ApiResponse<KhachHangDto>) => {
          this.khachHangForm.patchValue({
            id: response.result.id,
            ma: response.result.ma,
            ten: response.result.ten,
            taiKhoan: response.result.taiKhoan,
            email: response.result.email,
            sdt: response.result.sdt,
            gioiTinh: response.result.gioiTinh,
            ngaySinh: response.result.ngaySinh,
            diaChi: response.result.diaChi,
            trangThai: response.result.trangThai.toString() // Chuyển đổi boolean thành string
          });
          this.isEditMode = true;
        },
        (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  handleError(error: HttpErrorResponse): void {
    console.error(error);
    if (error.error.code === ErrorCode.PASSWORD_INVALID) {
      this.errorMessage = 'Mã khách hàng không được để trống';
    } else {
      this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau.';
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/log-in']).then(() => {
      console.log('Redirected to /log-in');
    }).catch(err => {
      console.error('Error navigating to /log-in:', err);
    });
  }

  delete(id: any): void {
    this.apiService.deleteKhachHang(id).subscribe(() => {
      this.loadKhachHang();
      this.router.navigate(['/admin/khach-hang']);
    });
  }

  openKhachHang(id: any): void {
    this.apiService.openKhachHang(id).subscribe(() => {
      this.loadKhachHang();
      this.router.navigate(['/admin/khach-hang']);
    });
  }

  closeSuccessAlert(): void {
    this.showSuccessAlert = false;
  }

  loadTaiKhoan(): void {
    this.taiKhoanService.getAllTaiKhoan().subscribe(
      (response: ApiResponse<TaiKhoanDto[]>) => {
        if (response.result) {
          this.taiKhoanList = response.result;
          console.log(this.taiKhoanList)
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading tai khoan:', error);
      }
    );
  }

  loadVoucher():void{
    this.apiService.getKhs(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.khachHangs = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
        console.log("view khs");
      });
  }

  createVoucher(){

  }

  search() {
    this.apiService.searchKhachHang(this.ten).subscribe(data => {
      this.khachHangs = data;
    });
  }


}
