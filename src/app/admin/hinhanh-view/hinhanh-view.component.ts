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
import { HinhAnhDto } from 'src/app/model/hinh-anh-dto.model';
import { HinhAnhService } from 'src/app/service/HinhAnhService';



@Component({
  selector: 'app-hinhanh-view',
  templateUrl: './hinhanh-view.component.html',
  styleUrls: ['./hinhAnh-view.component.css']
})
export class HinhAnhViewComponent implements OnInit{

  hinhAnh: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  showSuccessAlert = false;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  hinhAnhForm: FormGroup; 
  id: string;
  successMessage = '';
  selectedHinhAnh: HinhAnhDto | null = null;
  isEditMode = false;
//   chiTietSanPhamList: [] = [];


  constructor(private apiService: HinhAnhService, private formBuilder: FormBuilder,

    private router: Router,private auth: AuthenticationService, 
    private route: ActivatedRoute) {
      this.hinhAnhForm = this.formBuilder.group({
        
        url: ['', [Validators.required]],
        ma: [''],
        id: [''],
        // chiTietSanPham:[''],
      chiTietSanPham: Object,
        trangThai: ['',Validators.required]
      });
  
      this.id = this.route.snapshot.params['id'];
     }

     ngOnInit(): void {
      this.loadHinhAnh();
      if (this.id) {
        this.findById(this.id);
      }
    }
  
    get f() {
      return this.hinhAnhForm.controls;
    }
  
    onSubmit(): void {
      this.submitted = true;
      if (this.hinhAnhForm.invalid) {
        return;
      }
      if (this.isEditMode) {
        this.updateHinhAnh();
      } else {
        this.createHinhAnh();
      }
    }
  
    loadHinhAnh(): void {
      this.apiService.getHinhAnh(this.currentPage, this.pageSize)
        .subscribe(response => {
          this.hinhAnh = response.result.content;
          this.totalElements = response.result.totalElements;
          this.totalPages = response.result.totalPages;
        });
    }
  
    onPageChange(page: number): void {
      this.currentPage = page;
      this.loadHinhAnh();
    }
  
    createHinhAnh(): void {
      this.submitted = true;
      if (this.hinhAnhForm.invalid) {
        return;
      }
      const hinhAnhData: HinhAnhDto = this.hinhAnhForm.value;
      this.apiService.createHinhAnh(hinhAnhData)
        .subscribe(
          (data: ApiResponse<HinhAnhDto>) => {
            this.showSuccessAlert = true;
            this.successMessage = 'Thêm thành công'
            this.loadHinhAnh();
            setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
            this.hinhAnhForm.reset();
            this.isEditMode = false;
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        );
    }
  
    updateHinhAnh(): void {
      this.submitted = true;
      if (this.hinhAnhForm.invalid) {
        return;
      }
      const hinhAnhData: HinhAnhDto = this.hinhAnhForm.value;
      this.apiService.updateHinhAnh(hinhAnhData.id, hinhAnhData).subscribe(
        () => {
          this.showSuccessAlert = true;
          this.successMessage = 'Sửa thành công'
          this.loadHinhAnh();
          setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
          this.hinhAnhForm.reset();
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
          (response: ApiResponse<HinhAnhDto>) => {
            this.hinhAnhForm.patchValue({
              id: response.result.id,
              ma: response.result.ma,
              url: response.result.url,
              chiTietSanPham: response.result.chiTietSanPham,
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
        this.errorMessage = 'Mã hình ảnh không được để trống';
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
      this.apiService.deleteHinhAnh(id).subscribe(() => {
        this.loadHinhAnh();
        this.router.navigate(['/admin/hinh-anh']);
      });
    }
  
    openHinhAnh(id: any): void {
      this.apiService.openHinhAnh(id).subscribe(() => {
        this.loadHinhAnh();
        this.router.navigate(['/admin/hinh-anh']);
      });
    }
  
    closeSuccessAlert(): void {
      this.showSuccessAlert = false;
    }
}
