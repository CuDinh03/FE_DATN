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
  noProductsFound = false;
  noCartDetail = false;
  hoaDons: any[] = [];
  startDate: string = '';
  endDate: string = '';
  @ViewChild('searchInput') searchInputRef!: ElementRef;

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

  onDateChange(): void {
    if (this.startDate && this.endDate) {
      this.hoaDonService.getHoaDonBetweenDates(this.startDate, this.endDate).subscribe(
        response => {
          this.hoaDons = response.result;
          console.log(this.hoaDons)

          const hoaDonObservables = this.hoaDons.map(hoaDon => {
            return this.hoaDonChiTietService.getAllBỵKhachHang(hoaDon.id);
          });
          // Use forkJoin to execute all observables concurrently
          forkJoin(hoaDonObservables).subscribe(
            (results: any[]) => {
              // Flatten the results into hoaDonChiTiet array
              results.forEach(result => {
                this.hoaDonChiTiet.push(...result.result);
                console.log(this.hoaDonChiTiet)
              });
            },
            (error) => {
              console.error('Error fetching order details:', error);
            }
          );
        },
        error => {
          console.error('Error fetching data', error);
        }
      );
    }
  }

  getHoaDons(): void {
    const tenDangNhap = this.auth.getTenDangNhap();
    if (tenDangNhap) {
      this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).subscribe(
        (response) => {
          const khachHang = response.result;
          this.khachHang = response.result;
          if (khachHang && khachHang.id) {
            this.apiService.getHoaDonsByTrangThaiAndKhachHang(this.trangThai, khachHang.id).subscribe(
              (response: any) => {
                if (response.result) {
                  this.hoaDons = response.result;
                  this.noProductsFound = false;

                  const hoaDonObservables = this.hoaDons.map(hoaDon => {
                    return this.hoaDonChiTietService.getAllBỵKhachHang(hoaDon.id);
                  });

                  // Use forkJoin to execute all observables concurrently
                  forkJoin(hoaDonObservables).subscribe(
                    (results: any[]) => {
                      // Flatten the results into hoaDonChiTiet array
                      results.forEach(result => {
                        this.hoaDonChiTiet.push(...result.result);
                      });
                    },
                    (error) => {
                      console.error('Error fetching order details:', error);
                    }
                  );
                  this.hoaDonChiTiet = [];
                } else {
                  this.noProductsFound = true;
                  this.hoaDons = [];
                  this.hoaDonChiTiet = []; // Ensure hoaDonChiTiet is also cleared if no products found
                }
              }, (error: HttpErrorResponse) => {
                if (error.error.code === ErrorCode.NO_ORDER_FOUND) {
                  this.noProductsFound = true;
                  this.hoaDons = [];
                  this.hoaDonChiTiet = [];
                } else {
                  console.error('Unexpected error:', error);
                }
              });
          }
        })
    }
  }

  onTabChange(trangThai: number): void {
    this.trangThai = trangThai;
    this.getHoaDons();
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
                this.onSearch('')
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

  onSearch(ma: string) {
    if (ma) {
      const hoaDonObservable = this.hoaDonService.getHoaDonByMaKH(ma);
      hoaDonObservable.subscribe(
        (response) => {
          if (response.result) {
            this.hoaDons = [response.result];
            this.noProductsFound = false;

            const hoaDonObservables = this.hoaDons.map(hoaDon => {
              return this.hoaDonChiTietService.getAllBỵKhachHang(hoaDon.id);
            });

            // Use forkJoin to execute all observables concurrently
            forkJoin(hoaDonObservables).subscribe(
              (results: any[]) => {
                // Flatten the results into hoaDonChiTiet array
                results.forEach(result => {
                  this.hoaDonChiTiet.push(...result.result);
                });
              },
              (error) => {
                console.error('Error fetching order details:', error);
              }
            );
          } else {
            this.hoaDonChiTiet = [];
            this.noProductsFound = true;
          }
        },
        (error) => {
          console.error('Error fetching invoice:', error);
          this.hoaDonChiTiet = [];
          this.noProductsFound = true;
        }
      );
    } else {
      // Tạo một mảng các observable để lấy chi tiết hóa đơn
      const hoaDonChiTietObservables = this.listHoaDon.map(hoaDon =>
        this.hoaDonChiTietService.getAllBỵKhachHang(hoaDon.id)
      );

      // Sử dụng forkJoin để thực hiện tất cả các yêu cầu đồng thời
      forkJoin(hoaDonChiTietObservables).subscribe(
        (hoaDonChiTietResponses) => {
          this.hoaDonChiTiet = hoaDonChiTietResponses.flatMap(response => response.result);
          this.noProductsFound = this.hoaDonChiTiet.length === 0;
        },
        (error) => {
          console.error('Error fetching order details:', error);
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
        return 'Đã xử lý';
      case 3:
        return 'Đang giao';
      case 4:
        return 'Đã nhận hàng';
      case 5:
        return 'Hoàn thành';
      case 6:
        return 'Hủy đơn';
      default:
        return '';
    }
  }

  getTrangThaiColor(trangThai: number): string {
    switch (trangThai) {
      case 0:
        return '#FFD700';
      case 1:
        return '#FF6347';
      case 2:
        return '#228B22';
      case 3:
        return '#ADD8E6';
      case 4:
        return '#228B22';
      case 5:
        return '#228B22';
      case 6:
        return '#FF0000';

      default:
        return '';
    }
  }
}
