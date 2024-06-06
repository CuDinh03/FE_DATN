import { HoaDonChiTietService } from './../../service/HoaDonChiTietService';
import { HoaDonService } from './../../service/HoaDonService';
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
  selector: 'app-orders-view',
  templateUrl: './orders-view.component.html',
  styleUrls: ['./orders-view.component.css']
})
export class OrdersViewComponent {

  listHoaDon: any[] = [];
  hoaDonChiTiet: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  showSuccessAlert = false;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  successMessage = '';
  isEditMode = false;
  hoaDon = ''
  noProductsFound = false;

  constructor(
    private apiService: HoaDonService, 
    private hoaDonChiTietService: HoaDonChiTietService,
    private router: Router, 
    private auth: AuthenticationService, 

  ) {

  }

  ngOnInit(): void {
    this.loadHoaDon();
  }

  loadHoaDonChiTiet(idHoaDon: string): void {
    this.hoaDonChiTietService.getAll(idHoaDon).subscribe(
            (response: ApiResponse<any>) => {
        if (response.result && response.result.length > 0) {
            this.hoaDonChiTiet = response.result;
            this.noProductsFound = false;
        } else {
            this.noProductsFound = true;
            this.hoaDonChiTiet = [];
        }
    },
    (error: HttpErrorResponse) => {
        if (error.error.code === ErrorCode.NO_ORDER_DETAIL_FOUND) {
            this.noProductsFound = true;
            this.hoaDonChiTiet = [];
        } else {
            console.error('Unexpected error:', error);
        }
    }
);
}


  loadHoaDon(): void {
    this.apiService.getHoaDon(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.listHoaDon = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadHoaDon();
  }
  

  loadHoaDonById(idHoaDon: string): void {
    this.apiService.getHoaDonById(idHoaDon)
        .subscribe(
          (response: ApiResponse<any>) => {
            if (response.result) {
              this.hoaDon = response.result;
              localStorage.setItem('hoaDon', JSON.stringify(response.result));
              this.router.navigate(['/admin/hoa-don'])
            }
          })
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
  closeSuccessAlert(): void {
    this.showSuccessAlert = false;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear(); // Get full year

    const hours = date.getHours().toString().padStart(2, '0'); 
    const minutes = date.getMinutes().toString().padStart(2, '0'); 

    return `${day}/${month}/${year} || ${hours}:${minutes}`; 
}

  
}
