import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DanhMucDto } from 'src/app/model/danh-muc-dto.model';
import { DanhMucService } from 'src/app/service/DanhMucService';
import { TaiKhoanService } from 'src/app/service/TaiKhoanService';
import { SanPhamDto } from 'src/app/model/san-pham-dto.model';
import { SanPhamService } from 'src/app/service/SanPhamService';
import { AuthenticationService } from 'src/app/service/AuthenticationService';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorCode } from 'src/app/model/ErrorCode';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit{

  sanPham: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  showSuccessAlert = false;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  sanPhamForm: FormGroup; 
  id: string;
  successMessage = '';
  selectedSanPham: SanPhamDto | null = null;
  isEditMode = false;


  constructor(private apiService: SanPhamService, private formBuilder: FormBuilder,

    private router: Router,private auth: AuthenticationService, 
    private route: ActivatedRoute) {
      this.sanPhamForm = this.formBuilder.group({
        ten: ['', [Validators.required]],
        ma: [''],
        id: [''],
        trangThai: ['']
      });
  
      this.id = this.route.snapshot.params['id'];
     }

     ngOnInit(): void {
      this.loadSanPham();
      if (this.id) {
        this.findById(this.id);
      }
    }
  
    get f() {
      return this.sanPhamForm.controls;
    }
  
    onSubmit(): void {
      this.submitted = true;
      if (this.sanPhamForm.invalid) {
        return;
      }
      if (this.isEditMode) {
        this.updateSanPham();
      } else {
        this.createSanPham();
      }
    }
  
    loadSanPham(): void {
      this.apiService.getSanPham(this.currentPage, this.pageSize)
        .subscribe(response => {
          this.sanPham = response.result.content;
          this.totalElements = response.result.totalElements;
          this.totalPages = response.result.totalPages;
        });
    }
  
    onPageChange(page: number): void {
      this.currentPage = page;
      this.loadSanPham();
    }
  
    createSanPham(): void {
      this.submitted = true;
      if (this.sanPhamForm.invalid) {
        return;
      }
      const sanPhamData: SanPhamDto = this.sanPhamForm.value;
      this.apiService.createSanPham(sanPhamData)
        .subscribe(
          (data: ApiResponse<SanPhamDto>) => {
            this.showSuccessAlert = true;
            this.successMessage = 'Thêm thành công'
            this.loadSanPham();
            setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
            this.sanPhamForm.reset();
            this.isEditMode = false;
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        );
    }
  
    updateSanPham(): void {
      this.submitted = true;
      if (this.sanPhamForm.invalid) {
        return;
      }
      const sanPhamData: SanPhamDto = this.sanPhamForm.value;
      this.apiService.updateSanPham(sanPhamData.id, sanPhamData).subscribe(
        () => {
          this.showSuccessAlert = true;
          this.successMessage = 'Sửa thành công'
          this.loadSanPham();
          setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
          this.sanPhamForm.reset();
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
          (response: ApiResponse<SanPhamDto>) => {
            this.sanPhamForm.patchValue({
              id: response.result.id,
              ma: response.result.ma,
              ten: response.result.ten,
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
        this.errorMessage = 'Mã sản phẩm không được để trống';
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
      this.apiService.deleteSanPham(id).subscribe(() => {
        this.loadSanPham();
        this.router.navigate(['/admin/san-pham']);
      });
    }
  
    openSanPham(id: any): void {
      this.apiService.openSanPham(id).subscribe(() => {
        this.loadSanPham();
        this.router.navigate(['/admin/san-pham']);
      });
    }
  
    closeSuccessAlert(): void {
      this.showSuccessAlert = false;
    }
}
