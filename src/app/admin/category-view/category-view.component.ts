import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators } from '@angular/forms';
import { AuthenticationService } from './../../service/AuthenticationService';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DanhMucDto } from 'src/app/model/danh-muc-dto.model';
import { DanhMucService } from 'src/app/service/DanhMucService';
import { ApiResponse } from "../../model/ApiResponse";
import { ErrorCode } from "../../model/ErrorCode";


@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {

  danhMuc: DanhMucDto[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  showSuccessAlert = false;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  danhMucForm: FormGroup; 
  id: string;
  successMessage = '';
  selectedDanhMuc: DanhMucDto | null = null;
  isEditMode = false;

  constructor(
    private apiService: DanhMucService, 
    private formBuilder: FormBuilder,
    private router: Router, 
    private auth: AuthenticationService, 
    private route: ActivatedRoute
  ) {
    this.danhMucForm = this.formBuilder.group({
      ten: ['', [Validators.required]],
      ma: [''],
      id: [''],
      trangThai: ['']
    });

      this.id = this.router1.snapshot.params['id'];
  }
  
  ngOnInit(): void {
    this.loadDanhMuc();
    if (this.id) {
      this.findById(this.id);
    }
  }

  get f() {
    return this.danhMucForm.controls;
  }



  loadDanhMuc(): void {
    this.apiService.getDanhMuc(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.danhMuc = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
      });
  }



  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDanhMuc();
  }

  createDanhMuc(): void {
    this.submitted = true;
    if (this.danhMucForm.invalid) {
      return;
    }
    const danhMucData: DanhMucDto = this.danhMucForm.value;
    this.apiService.createDanhMuc(danhMucData)
      .subscribe(
        (data: ApiResponse<DanhMucDto>) => {
          this.showSuccessAlert = true;
          this.successMessage = 'Thêm thành công'
          this.loadDanhMuc();
          setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
          this.danhMucForm.reset();
          this.isEditMode = false;
        },
        (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  updateDanhMuc(): void {
    this.submitted = true;
    if (this.danhMucForm.invalid) {
      return;
    }
    const danhMucData: DanhMucDto = this.danhMucForm.value;
    this.apiService.updateDanhMuc(danhMucData.id, danhMucData).subscribe(
      () => {
        this.showSuccessAlert = true;
        this.successMessage = 'Sửa thành công'
        this.loadDanhMuc();
        setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
        this.danhMucForm.reset();
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
        (response: ApiResponse<DanhMucDto>) => {
          this.danhMucForm.patchValue({
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
      this.errorMessage = 'Mã danh mục không được để trống';
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
    this.apiService.deleteDanhMuc(id).subscribe(() => {
      this.loadDanhMuc();
      this.router.navigate(['/admin/danh-muc']);
    });
  }

  openDanhMuc(id: any): void {
    this.apiService.openDanhMuc(id).subscribe(() => {
      this.loadDanhMuc();
      this.router.navigate(['/admin/danh-muc']);
    });
  }

  closeSuccessAlert(): void {
    this.showSuccessAlert = false;
  }
}