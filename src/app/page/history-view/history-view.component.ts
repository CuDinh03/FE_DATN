import { KhachHangService } from './../../service/KhachHangService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from './../../model/ApiResponse';
import { HoaDonChiTietService } from './../../service/HoaDonChiTietService';
import { HoaDonService } from './../../service/HoaDonService';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './../../service/AuthenticationService';
import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ErrorCode } from '../../model/ErrorCode';
import { forkJoin } from 'rxjs';
import { SanPhamCTService } from '../../service/SanPhamCTService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getApiErrorMessage } from '../../util/error-message.util';
import { HoaDonDto } from '../../model/hoa-don-dto.model';

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
  ghiChu: string = '';
  @ViewChild('searchInput') searchInputRef!: ElementRef;
  private destroyRef = inject(DestroyRef);

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
    if (!this.startDate || !this.endDate) return;
    this.hoaDonChiTiet = [];
    this.hoaDonService.getHoaDonBetweenDates(this.startDate, this.endDate).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.hoaDons = response.result ?? [];
        const hoaDonObservables = this.hoaDons.map(hoaDon =>
          this.hoaDonChiTietService.getAllByKhachHang(hoaDon.id)
        );
        if (hoaDonObservables.length === 0) return;
        forkJoin(hoaDonObservables).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: (results: any[]) => {
            this.hoaDonChiTiet = results.flatMap(r => r.result ?? []);
          },
          error: (err) => {
            this.snackBar.open(getApiErrorMessage(err, 'Lỗi tải chi tiết đơn hàng.'), 'Đóng', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        });
      },
      error: (err) => {
        this.snackBar.open(getApiErrorMessage(err, 'Lỗi tải đơn theo ngày.'), 'Đóng', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  getHoaDons(): void {
    const tenDangNhap = this.auth.getTenDangNhap();
    if (!tenDangNhap) return;
    this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        const khachHang = response.result;
        this.khachHang = response.result;
        if (!khachHang?.id) return;
        this.apiService.getHoaDonsByTrangThaiAndKhachHang(this.trangThai, khachHang.id).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: (res: any) => {
            this.hoaDonChiTiet = [];
            if (res.result?.length) {
              this.hoaDons = res.result;
              this.noProductsFound = false;
              const hoaDonObservables = this.hoaDons.map(hoaDon =>
                this.hoaDonChiTietService.getAllByKhachHang(hoaDon.id)
              );
              forkJoin(hoaDonObservables).pipe(
                takeUntilDestroyed(this.destroyRef)
              ).subscribe({
                next: (results: any[]) => {
                  this.hoaDonChiTiet = results.flatMap(r => r.result ?? []);
                },
                error: (err) => {
                  this.snackBar.open(getApiErrorMessage(err, 'Lỗi tải chi tiết đơn hàng.'), 'Đóng', { duration: 3000, panelClass: ['error-snackbar'] });
                }
              });
            } else {
              this.noProductsFound = true;
              this.hoaDons = [];
            }
          },
          error: (error: HttpErrorResponse) => {
            if (error.error?.code === ErrorCode.NO_ORDER_FOUND) {
              this.noProductsFound = true;
              this.hoaDons = [];
              this.hoaDonChiTiet = [];
            } else {
              this.snackBar.open(getApiErrorMessage(error, 'Lỗi tải đơn hàng.'), 'Đóng', { duration: 3000, panelClass: ['error-snackbar'] });
            }
          }
        });
      }
    });
  }

  onTabChange(trangThai: number): void {
    this.trangThai = trangThai;
    this.getHoaDons();
  }

  findSanPhamById(id: string): void {
    this.sanPhamCTService.getChiTietSanPhamById(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.result) {
          this.findSanPhamChiTiet = response.result;
          localStorage.setItem('sanPhamChiTiet', JSON.stringify(response.result));
          this.router.navigate(['/san-pham']);
        }
      }
    });
  }

  findOrderDetailByid(id: string): void {
    this.hoaDonChiTietService.findById(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        if (response.result) {
          localStorage.setItem('hoaDonChiTiet', JSON.stringify(response.result));
          this.router.navigate(['/customer/danh-gia']);
        }
      }
    });
  }

  suaTrangThaiModal(id: string): void {
    this.hoaDonChiTietService.findById(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        if (response.result) {
          this.hoaDonSingle = response.result.hoaDon;
          this.showModalUpdate();
        }
      }
    });
  }


  huyDonModal(): void {
    const storedHoaDon = localStorage.getItem('hoaDon');
    if (storedHoaDon) {
      const hoaDon = JSON.parse(storedHoaDon);
      const hoaDonDto: HoaDonDto = {
        id: hoaDon.id,
        ma: hoaDon.ma,
        tongTien: hoaDon.tongTien,
        tongTienGiam: hoaDon.tongTienGiam,
        voucher: hoaDon.voucher,
        ghiChu: this.ghiChu,
        khachHangId: hoaDon.khachHangId,
        nhanVienId: hoaDon.nhanVienId,
        ngayTao: hoaDon.ngayTao,
        ngaySua: new Date(),
        trangThai: 5,
      };
      this.updateTrangThai(hoaDon.id, hoaDonDto.trangThai, hoaDonDto);
      this.findOrder();
      this.closeconfirmUpdate();
    } else {
      this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau.';
    }
  }

  updateTrangThai(id: string, trangThai: number, hoaDonDto: HoaDonDto): void {
    this.apiService.updateTrangThainew(id, trangThai, hoaDonDto).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: ApiResponse<HoaDonDto>) => {
        if (response?.result) {
          const messages: Record<number, string> = {
            2: 'Đã xác nhận đơn hàng',
            4: 'Hoàn thành đơn hàng',
            5: 'Hủy đơn thành công'
          };
          this.snackBar.open(messages[trangThai] ?? 'Cập nhật trạng thái thành công', 'Đóng', {
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
      error: (err) => {
        this.snackBar.open(getApiErrorMessage(err, 'Cập nhật trạng thái thất bại'), 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
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
    if (!tenDangNhap) return;
    this.hoaDonChiTiet = [];
    this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        const khachHang = response.result;
        this.khachHang = response.result;
        if (!khachHang?.id) return;
        this.hoaDonService.findHoaDonByIdKhachHang(khachHang.id).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: (res) => {
            this.listHoaDon = res.result ?? [];
            const hoaDonChiTietObservables = this.listHoaDon.map(hoaDon =>
              this.hoaDonChiTietService.getAllByKhachHang(hoaDon.id)
            );
            if (hoaDonChiTietObservables.length === 0) {
              this.hoaDonChiTiet = [];
              this.onSearch('');
              return;
            }
            forkJoin(hoaDonChiTietObservables).pipe(
              takeUntilDestroyed(this.destroyRef)
            ).subscribe({
              next: (hoaDonChiTietResponses) => {
                this.hoaDonChiTiet = hoaDonChiTietResponses.flatMap(r => r.result ?? []);
              },
              error: (err) => {
                this.snackBar.open(getApiErrorMessage(err, 'Lỗi tải chi tiết đơn hàng.'), 'Đóng', { duration: 3000, panelClass: ['error-snackbar'] });
              }
            });
            this.onSearch('');
          },
          error: (err) => {
            this.snackBar.open(getApiErrorMessage(err, 'Lỗi tải đơn hàng.'), 'Đóng', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        });
      },
      error: (err) => {
        this.snackBar.open(getApiErrorMessage(err, 'Lỗi tải thông tin khách hàng.'), 'Đóng', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  onSearch(ma: string) {
    if (ma) {
      const tenDangNhap = this.auth.getTenDangNhap();
      if (!tenDangNhap) return;
      this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (response) => {
          const khachHang = response.result;
          if (!khachHang?.id) return;
          this.hoaDonService.getHoaDonByMaKH(ma, khachHang.id).pipe(
            takeUntilDestroyed(this.destroyRef)
          ).subscribe({
            next: (res) => {
              this.hoaDonChiTiet = [];
              if (res.result) {
                this.noProductsFound = false;
                forkJoin([this.hoaDonChiTietService.getAllByKhachHang(res.result.id)]).pipe(
                  takeUntilDestroyed(this.destroyRef)
                ).subscribe({
                  next: (results: any[]) => {
                    this.hoaDonChiTiet = (results[0]?.result ?? []);
                  },
                  error: (err) => {
                    this.snackBar.open(getApiErrorMessage(err, 'Lỗi tải chi tiết đơn.'), 'Đóng', { duration: 3000, panelClass: ['error-snackbar'] });
                  }
                });
              } else {
                this.noProductsFound = true;
              }
            },
            error: () => {
              this.hoaDonChiTiet = [];
              this.noProductsFound = true;
            }
          });
        }
      });
    } else {
      this.hoaDonChiTiet = [];
      const hoaDonChiTietObservables = this.listHoaDon.map(hoaDon =>
        this.hoaDonChiTietService.getAllByKhachHang(hoaDon.id)
      );
      if (hoaDonChiTietObservables.length === 0) {
        this.noProductsFound = true;
        return;
      }
      forkJoin(hoaDonChiTietObservables).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (hoaDonChiTietResponses) => {
          this.hoaDonChiTiet = hoaDonChiTietResponses.flatMap(r => r.result ?? []);
          this.noProductsFound = this.hoaDonChiTiet.length === 0;
        },
        error: (err) => {
          this.snackBar.open(getApiErrorMessage(err, 'Lỗi tải chi tiết đơn hàng.'), 'Đóng', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }


  findHoaDonById(id: string): void {
    this.apiService.getHoaDonById(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.result) {
          this.hoaDon = response.result;
          localStorage.setItem('hoaDon', JSON.stringify(response.result));
          this.router.navigate(['/customer/order-detail', id]);
        }
      }
    });
  }

  findHoaDonById1(id: string): void {
    this.apiService.getHoaDonById(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.result) {
          this.hoaDon = response.result;
          localStorage.setItem('hoaDon', JSON.stringify(response.result));
        }
      }
    });
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
        return 'Hoàn thành';
      case 5:
        return 'Hủy đơn';
      case 6:
        return 'Sửa đơn';
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
        return '#FF0000';
      case 6:
        return '#FF0000';
      default:
        return '';
    }
  }
}
