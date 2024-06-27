import { ErrorCode } from 'src/app/model/ErrorCode';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { AuthenticationService } from './../../service/AuthenticationService';
import { Router } from '@angular/router';
import { HoaDonChiTietService } from './../../service/HoaDonChiTietService';
import { Component } from '@angular/core';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent {
  currentStatus: number = 0;
  hoaDonChiTiet: any = {};
  hoaDon: any = {};
  listHoaDonChiTiet: any[] = [];
  noCartDetail = false;

  constructor(private auth: AuthenticationService, private router: Router,
    private hoaDonChiTietService: HoaDonChiTietService
  ) { }

  ngOnInit() {
    this.loadHoaDonChiTiet();
  }

  loadHoaDonChiTiet(): void {
    const storeHoaDon = localStorage.getItem('hoaDon');
    if (storeHoaDon) {
      const hoaDon = JSON.parse(storeHoaDon);
      this.hoaDon = hoaDon
      this.currentStatus = hoaDon.trangThai;
      this.hoaDonChiTietService.getAllBỵKhachHang(hoaDon.id).subscribe(
        (response: ApiResponse<any>) => {
          if (response.result && response.result.length > 0) {
            this.listHoaDonChiTiet = response.result;
            this.noCartDetail = false;
          } else {
            this.noCartDetail = true;
            this.listHoaDonChiTiet = [];
          }
        },
        (error: HttpErrorResponse) => {
          if (error.error.code === ErrorCode.NO_ORDER_DETAIL_FOUND) {
            this.noCartDetail = true;
            this.listHoaDonChiTiet = [];
          } else {
            console.error('Unexpected error:', error);
          }
        }
      );
    }else{
      console.log('khong tim thay hoa don');
    }
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
