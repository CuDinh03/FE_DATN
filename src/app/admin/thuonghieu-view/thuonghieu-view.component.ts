import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DanhMucDto } from 'src/app/model/danh-muc-dto.model';
import { DanhMucService } from 'src/app/service/DanhMucService';
import { TaiKhoanService } from 'src/app/service/TaiKhoanService';
import { AuthenticationService } from 'src/app/service/AuthenticationService';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorCode } from 'src/app/model/ErrorCode';
import { ThuongHieuDto } from 'src/app/model/thuong-hieu-dto.model';
import { ThuongHieuService } from 'src/app/service/ThuongHieuService';



@Component({
  selector: 'app-thuonghieu-view',
  templateUrl: './thuonghieu-view.component.html',
  styleUrls: ['./thuongHieu-view.component.css']
})
export class ThuongHieuViewComponent implements OnInit{

  thuongHieu: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  showSuccessAlert = false;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  thuongHieuForm: FormGroup; 
  id: string;
  successMessage = '';
  selectedThuongHieu: ThuongHieuDto | null = null;
  isEditMode = false;


  constructor(private apiService: ThuongHieuService, private formBuilder: FormBuilder,

    private router: Router,private auth: AuthenticationService, 
    private route: ActivatedRoute) {
      this.thuongHieuForm = this.formBuilder.group({
        ten: ['', [Validators.required]],
        ma: [''],
        id: [''],
        trangThai: ['',Validators.required]
      });
  
      this.id = this.route.snapshot.params['id'];
     }

     ngOnInit(): void {
      this.loadThuongHieu();
      if (this.id) {
        this.findById(this.id);
      }
    }
  
    get f() {
      return this.thuongHieuForm.controls;
    }
  
    onSubmit(): void {
      this.submitted = true;
      if (this.thuongHieuForm.invalid) {
        return;
      }
      if (this.isEditMode) {
        this.updateThuongHieu();
      } else {
        this.createThuongHieu();
      }
    }
  
    loadThuongHieu(): void {
      this.apiService.getThuongHieu(this.currentPage, this.pageSize)
        .subscribe(response => {
          this.thuongHieu = response.result.content;
          this.totalElements = response.result.totalElements;
          this.totalPages = response.result.totalPages;
        });
    }
  
    onPageChange(page: number): void {
      this.currentPage = page;
      this.loadThuongHieu();
    }
  
    createThuongHieu(): void {
      this.submitted = true;
      if (this.thuongHieuForm.invalid) {
        return;
      }
      const thuongHieuData: ThuongHieuDto = this.thuongHieuForm.value;
      this.apiService.createThuongHieu(thuongHieuData)
        .subscribe(
          (data: ApiResponse<ThuongHieuDto>) => {
            this.showSuccessAlert = true;
            this.successMessage = 'Thêm thành công'
            this.loadThuongHieu();
            setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
            this.thuongHieuForm.reset();
            this.isEditMode = false;
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        );
    }
  
    updateThuongHieu(): void {
      this.submitted = true;
      if (this.thuongHieuForm.invalid) {
        return;
      }
      const thuongHieuData: ThuongHieuDto = this.thuongHieuForm.value;
      this.apiService.updateThuongHieu(thuongHieuData.id, thuongHieuData).subscribe(
        () => {
          this.showSuccessAlert = true;
          this.successMessage = 'Sửa thành công'
          this.loadThuongHieu();
          setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
          this.thuongHieuForm.reset();
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
          (response: ApiResponse<ThuongHieuDto>) => {
            this.thuongHieuForm.patchValue({
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
        this.errorMessage = 'Mã thương hiệu không được để trống';
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
      this.apiService.deleteThuongHieu(id).subscribe(() => {
        this.loadThuongHieu();
        this.router.navigate(['/admin/thuong-hieu']);
      });
    }
  
    openThuongHieu(id: any): void {
      this.apiService.openThuongHieu(id).subscribe(() => {
        this.loadThuongHieu();
        this.router.navigate(['/admin/thuong-hieu']);
      });
    }
  
    closeSuccessAlert(): void {
      this.showSuccessAlert = false;
    }
}
