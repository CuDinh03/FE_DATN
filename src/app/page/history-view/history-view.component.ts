import {KhachHangService} from './../../service/KhachHangService';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiResponse} from './../../model/ApiResponse';
import {HoaDonChiTietService} from './../../service/HoaDonChiTietService';
import {HoaDonService} from './../../service/HoaDonService';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthenticationService} from './../../service/AuthenticationService';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ErrorCode} from "../../model/ErrorCode";
import {forkJoin} from 'rxjs';
import {SanPhamCTService} from "../../service/SanPhamCTService";

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
  trangThai: number = 0;
  page: number = 0;
  size: number = 5;
  khachHang: any = {};
  listHoaDon: any[] = [];
  hoaDonSingle: any = {};
  findSanPhamChiTiet: any = {};


  constructor(
    private apiService: HoaDonService,
    private hoaDonChiTietService: HoaDonChiTietService,
    private hoaDonService: HoaDonService,
    private router: Router,
    private auth: AuthenticationService,
    private snackBar: MatSnackBar,
    private khachHangService: KhachHangService,
    private sanPhamCTService: SanPhamCTService
  ) {

  }

  ngOnInit(): void {
    this.findOrder();
  }

  findSanPhamById(id: string): void {
    this.sanPhamCTService.getChiTietSanPhamById(id).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result) {
          this.findSanPhamChiTiet = response.result
          localStorage.setItem('sanPhamChiTiet', JSON.stringify(response.result))
          this.router.navigate(['/san-pham']);
        }
      })
  }

  findOrderDetailByid(id: string): void {
    this.hoaDonChiTietService.findById(id).subscribe((response) => {
      if (response.result) {
        localStorage.setItem('hoaDonChiTiet', JSON.stringify(response.result))
        this.router.navigate(['/danh-gia']);
      }
    })
  }

  suaTrangThaiModal(id: string): void {
    this.hoaDonChiTietService.findById(id).subscribe(response => {
      if (response.result) {
        this.hoaDonSingle = response.result.hoaDon
        this.showModalUpdate();
      }
    })
  }

  updateTrangThai(id: string, trangThai: number): void {
    this.hoaDonService.updateTrangThai(id, trangThai).subscribe(
      (response) => {
        if (response) {
          this.snackBar.open('Cập nhật trạng thái thành công', 'Đóng', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        } else {
          this.snackBar.open('Cập nhật trạng thái thất bại', 'Đóng', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      (error) => {
        console.error('Error updating status:', error);
        this.snackBar.open('Cập nhật trạng thái thất bại', 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );

    this.findOrder();
    this.closeconfirmUpdate();
  }

  showModalUpdate(): void {
    if (this.confirmUpdate && this.confirmUpdate.nativeElement) {
      this.confirmUpdate.nativeElement.classList.add('show');
      this.confirmUpdate.nativeElement.style.display = 'block';
    }
  }

  closeconfirmUpdate(): void {
    if (this.confirmUpdate && this.confirmUpdate.nativeElement) {
      this.confirmUpdate.nativeElement.classList.remove('show');
      this.confirmUpdate.nativeElement.style.display = 'none';
    }
  }

  findOrder() {
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
