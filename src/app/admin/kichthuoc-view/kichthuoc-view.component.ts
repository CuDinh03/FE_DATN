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
import { KichThuocDto } from 'src/app/model/kich-thuoc-dto.model';
import { KichThuocService } from 'src/app/service/KichThuocService';



@Component({
  selector: 'app-kichthuoc-view',
  templateUrl: './kichthuoc-view.component.html',
  styleUrls: ['./kichThuoc-view.component.css']
})
export class KichThuocViewComponent implements OnInit{

  kichThuoc: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  showSuccessAlert = false;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  kichThuocForm: FormGroup; 
  id: string;
  successMessage = '';
  selectedKichThuoc: KichThuocDto | null = null;
  isEditMode = false;


  constructor(private apiService: KichThuocService, private formBuilder: FormBuilder,

    private router: Router,private auth: AuthenticationService, 
    private route: ActivatedRoute) {
      this.kichThuocForm = this.formBuilder.group({
        ten: ['', [Validators.required]],
        ma: [''],
        id: [''],
        trangThai: ['']
      });
  
      this.id = this.route.snapshot.params['id'];
     }

     ngOnInit(): void {
      this.loadKichThuoc();
      if (this.id) {
        this.findById(this.id);
      }
    }
  
    get f() {
      return this.kichThuocForm.controls;
    }
  
    onSubmit(): void {
      this.submitted = true;
      if (this.kichThuocForm.invalid) {
        return;
      }
      if (this.isEditMode) {
        this.updateKichThuoc();
      } else {
        this.createKichThuoc();
      }
    }
  
    loadKichThuoc(): void {
      this.apiService.getKichThuoc(this.currentPage, this.pageSize)
        .subscribe(response => {
          this.kichThuoc = response.result.content;
          this.totalElements = response.result.totalElements;
          this.totalPages = response.result.totalPages;
        });
    }
  
    onPageChange(page: number): void {
      this.currentPage = page;
      this.loadKichThuoc();
    }
  
    createKichThuoc(): void {
      this.submitted = true;
      if (this.kichThuocForm.invalid) {
        return;
      }
      const kichThuocData: KichThuocDto = this.kichThuocForm.value;
      this.apiService.createKichThuoc(kichThuocData)
        .subscribe(
          (data: ApiResponse<KichThuocDto>) => {
            this.showSuccessAlert = true;
            this.successMessage = 'Thêm thành công'
            this.loadKichThuoc();
            setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
            this.kichThuocForm.reset();
            this.isEditMode = false;
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        );
    }
  
    updateKichThuoc(): void {
      this.submitted = true;
      if (this.kichThuocForm.invalid) {
        return;
      }
      const kichThuocData: KichThuocDto = this.kichThuocForm.value;
      this.apiService.updateKichThuoc(kichThuocData.id, kichThuocData).subscribe(
        () => {
          this.showSuccessAlert = true;
          this.successMessage = 'Sửa thành công'
          this.loadKichThuoc();
          setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
          this.kichThuocForm.reset();
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
          (response: ApiResponse<KichThuocDto>) => {
            this.kichThuocForm.patchValue({
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
        this.errorMessage = 'Mã kích thước không được để trống';
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
      this.apiService.deleteKichThuoc(id).subscribe(() => {
        this.loadKichThuoc();
        this.router.navigate(['/admin/kich-thuoc']);
      });
    }
  
    openKichThuoc(id: any): void {
      this.apiService.openKichThuoc(id).subscribe(() => {
        this.loadKichThuoc();
        this.router.navigate(['/admin/kich-thuoc']);
      });
    }
  
    closeSuccessAlert(): void {
      this.showSuccessAlert = false;
    }
}
