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
import { MauSacDto } from 'src/app/model/mau-sac-dto.model';
import { MauSacService } from 'src/app/service/MauSacService';


@Component({
  selector: 'app-mausac-view',
  templateUrl: './mausac-view.component.html',
  styleUrls: ['./mauSac-view.component.css']
})
export class MauSacViewComponent implements OnInit{

  mauSac: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  showSuccessAlert = false;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  mauSacForm: FormGroup; 
  id: string;
  successMessage = '';
  selectedMauSac: MauSacDto | null = null;
  isEditMode = false;


  constructor(private apiService: MauSacService, private formBuilder: FormBuilder,

    private router: Router,private auth: AuthenticationService, 
    private route: ActivatedRoute) {
      this.mauSacForm = this.formBuilder.group({
        ten: ['', [Validators.required]],
        ma: [''],
        id: [''],
        trangThai: ['']
      });
  
      this.id = this.route.snapshot.params['id'];
     }

     ngOnInit(): void {
      this.loadMauSac();
      if (this.id) {
        this.findById(this.id);
      }
    }
  
    get f() {
      return this.mauSacForm.controls;
    }
  
    onSubmit(): void {
      this.submitted = true;
      if (this.mauSacForm.invalid) {
        return;
      }
      if (this.isEditMode) {
        this.updateMauSac();
      } else {
        this.createMauSac();
      }
    }
  
    loadMauSac(): void {
      this.apiService.getMauSac(this.currentPage, this.pageSize)
        .subscribe(response => {
          this.mauSac = response.result.content;
          this.totalElements = response.result.totalElements;
          this.totalPages = response.result.totalPages;
        });
    }
  
    onPageChange(page: number): void {
      this.currentPage = page;
      this.loadMauSac();
    }
  
    createMauSac(): void {
      this.submitted = true;
      if (this.mauSacForm.invalid) {
        return;
      }
      const mauSacData: MauSacDto = this.mauSacForm.value;
      this.apiService.createMauSac(mauSacData)
        .subscribe(
          (data: ApiResponse<MauSacDto>) => {
            this.showSuccessAlert = true;
            this.successMessage = 'Thêm thành công'
            this.loadMauSac();
            setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
            this.mauSacForm.reset();
            this.isEditMode = false;
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        );
    }
  
    updateMauSac(): void {
      this.submitted = true;
      if (this.mauSacForm.invalid) {
        return;
      }
      const mauSacData: MauSacDto = this.mauSacForm.value;
      this.apiService.updateMauSac(mauSacData.id, mauSacData).subscribe(
        () => {
          this.showSuccessAlert = true;
          this.successMessage = 'Sửa thành công'
          this.loadMauSac();
          setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
          this.mauSacForm.reset();
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
          (response: ApiResponse<MauSacDto>) => {
            this.mauSacForm.patchValue({
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
        this.errorMessage = 'Mã màu sắc không được để trống';
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
      this.apiService.deleteMauSac(id).subscribe(() => {
        this.loadMauSac();
        this.router.navigate(['/admin/mau-sac']);
      });
    }
  
    openMauSac(id: any): void {
      this.apiService.openMauSac(id).subscribe(() => {
        this.loadMauSac();
        this.router.navigate(['/admin/mau-sac']);
      });
    }
  
    closeSuccessAlert(): void {
      this.showSuccessAlert = false;
    }
}
