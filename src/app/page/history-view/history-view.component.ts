import { KhachHangService } from './../../service/KhachHangService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from './../../model/ApiResponse';
import { HoaDonChiTietService } from './../../service/HoaDonChiTietService';
import { HoaDonService } from './../../service/HoaDonService';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './../../service/AuthenticationService';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ErrorCode } from "../../model/ErrorCode";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-history-view',
  templateUrl: './history-view.component.html',
  styleUrls: ['./history-view.component.css']
})
export class HistoryViewComponent {
  @ViewChild('confirmUpdate') confirmUpdate!: ElementRef;
  hoaDonChiTiet: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  showSuccessAlert = false;
  pageSize = 5;
  startFrom = 1;
  errorMessage: string = '';
  successMessage = '';
  hoaDon = ''
  noProductsFound = false;
  noCartDetail = false;
  hoaDons: any[] = [];
  trangThai: number = 0;
  page: number = 0;
  size: number = 5;
  selectedTab: number = 0;
  khachHang: any = {};
  listHoaDon: any[] = [];


  constructor(
    private apiService: HoaDonService,
    private hoaDonChiTietService: HoaDonChiTietService,
    private hoaDonService: HoaDonService,
    private router: Router,
    private auth: AuthenticationService,
    private snackBar: MatSnackBar,
    private khachHangService: KhachHangService

  ) {

  }

  ngOnInit(): void {
    this.findShoppingCart();
  }

  findShoppingCart() {
    const tenDangNhap = this.auth.getTenDangNhap();
    if (tenDangNhap) {
      this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).subscribe(
        (response) => {
          const khachHang = response.result;
          this.khachHang = response.result;
          if (khachHang && khachHang.id) {
            this.hoaDonService.findHoaDonByIdKhachHang(khachHang.id).subscribe(
              (response) => {
                this.listHoaDon = response.result;
                console.log(this.listHoaDon);

                // Tạo một mảng các observable để lấy chi tiết hóa đơn
                const hoaDonChiTietObservables = this.listHoaDon.map(hoaDon =>
                  this.hoaDonChiTietService.getAllBỵKhachHang(hoaDon.id)
                );

                // Sử dụng forkJoin để thực hiện tất cả các yêu cầu đồng thời
                forkJoin(hoaDonChiTietObservables).subscribe(
                  (hoaDonChiTietResponses) => {
                    this.hoaDonChiTiet = hoaDonChiTietResponses.flatMap(response => response.result);
                    console.log(this.hoaDonChiTiet);
                  },
                  (error) => {
                    console.error('Error fetching order details:', error);
                  }
                );
              },
              (error) => {
                console.error('Error fetching shopping cart:', error);
              }
            );
          } else {
            console.error('Không tìm thấy thông tin khách hàng.');
          }
        },
        (error) => {
          console.error('Error fetching customer:', error);
        }
      );
    }
  }

  findHoaDonChiTietById(id: string): void {
    this.hoaDonChiTietService.findById(id)
      .subscribe(
        (response: ApiResponse<any>) => {
          if (response.result) {
            this.hoaDonChiTiet = response.result;
            localStorage.setItem('hoaDonChiTiet', JSON.stringify(response.result));
            this.router.navigate(['/order-detail'])
          }
        })
  }

  findHoaDonById(id: string): void {
    this.apiService.getHoaDonById(id)
      .subscribe(
        (response: ApiResponse<any>) => {
          if (response.result) {
            this.hoaDon = response.result;
            localStorage.setItem('hoaDon', JSON.stringify(response.result));
            this.router.navigate(['/order-detail'])
          }
        })
  }

  getTrangThaiText(trangThai: number): string {
    switch (trangThai) {
      case 0:
        return 'Chưa thanh toán';
      case 1:
        return 'Chờ xác nhận';
      case 2:
        return 'Chờ giao';
      case 3:
        return 'Hoàn thành';
      case 4:
        return 'Đã hủy';
      case 5:
        return 'Đã hủy 1 phần';
      default:
        return '';
    }
  }
}
