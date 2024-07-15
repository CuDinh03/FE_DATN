import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiResponse} from './../../model/ApiResponse';
import {HoaDonChiTietService} from './../../service/HoaDonChiTietService';
import {HoaDonService} from './../../service/HoaDonService';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthenticationService} from './../../service/AuthenticationService';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ErrorCode} from "../../model/ErrorCode";
import {HoaDonDto} from "../../model/hoa-don-dto.model";

@Component({
  selector: 'app-orders-view',
  templateUrl: './orders-view.component.html',
  styleUrls: ['./orders-view.component.css']
})
export class OrdersViewComponent implements OnInit{
  @ViewChild('confirmUpdate') confirmUpdate!: ElementRef;
  @ViewChild('deleteHoaDon') deleteHoaDon!: ElementRef;
  @ViewChild('detailHoaDon') detailHoaDon!: ElementRef;
  listHoaDon: any[] = [];
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
  hoaDonSelect!: any;
  noProductsFound = false;
  noCartDetail = false;
  hoaDons: any[] = [];
  trangThai: number = 0;
  page: number = 0;
  size: number = 5;
  selectedTab: number = 0;


  constructor(
    private apiService: HoaDonService,
    private hoaDonChiTietService: HoaDonChiTietService,
    private hoaDonService: HoaDonService,
    private router: Router,
    private auth: AuthenticationService,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
    this.getHoaDons();
    this.loadHoaDon();

  }


  getHoaDons(): void {
    this.apiService.getHoaDonsByTranThai(this.trangThai, this.page, this.size).subscribe((response: ApiResponse<any>) => {
      if (response.result && response.result.content.length > 0) {
        this.hoaDons = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
        this.noProductsFound = false;
      } else {
        this.noProductsFound = true;
        // Khởi tạo lại this.hoaDons để đảm bảo nó trống nếu không có hóa đơn nào
        this.hoaDons = [];
      }
    }, (error: HttpErrorResponse) => {
      if (error.error.code === ErrorCode.NO_ORDER_FOUND) {
        this.noProductsFound = true;
        this.hoaDons = [];
      } else {
        console.error('Unexpected error:', error);
      }
    });
  }

  onTabChange(trangThai: number): void {
    this.trangThai = trangThai;
    this.getHoaDons();
  }

  loadHoaDon(): void {
    this.apiService.getHoaDon(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.listHoaDon = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
        this.getHoaDons();
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

  loadHoaDonChiTiet(idHoaDon: string): void {
    this.hoaDonChiTietService.getAll(idHoaDon).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result && response.result.length > 0) {
          this.hoaDonChiTiet = response.result;
          this.noCartDetail = false;
        } else {
          this.noCartDetail = true;
          this.hoaDonChiTiet = [];
        }
      },
      (error: HttpErrorResponse) => {
        if (error.error.code === ErrorCode.NO_ORDER_DETAIL_FOUND) {
          this.noCartDetail = true;
          this.hoaDonChiTiet = [];
        } else {
          console.error('Unexpected error:', error);
        }
      }
    );
  }

  loadHoaDonByidHoaDon(hoaDon: string){
    this.showModalHoaDonDetail();
    this.hoaDonSelect = null;
    this.hoaDonService.getHoaDonById(hoaDon).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result) {
          this.hoaDonSelect = response.result;
        }
    });
  }
  showModalHoaDonDetail(): void {
    if (this.detailHoaDon && this.detailHoaDon.nativeElement) {
      this.detailHoaDon.nativeElement.classList.add('show');
      this.detailHoaDon.nativeElement.style.display = 'block';
    }
  }

  showModal(): void {
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

  onPageChange(page: number): void {
    this.page = page;
    this.getHoaDons();
  }


  onPageChangeAll(page: number): void {
    this.currentPage = page;
    this.loadHoaDon();
  }

  suaTrangThaiModal(): void {
    const storedHoaDon = this.hoaDonSelect
    if (storedHoaDon) {
      const hoaDon = storedHoaDon
      let trangThaiMoi = hoaDon.trangThai + 1
      this.updateTrangThai(hoaDon.id, trangThaiMoi);
      this.closeconfirmUpdate();
      this.closeDetailHoaDon();
    } else {
      this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau.';
    }
  }


  // loadHoaDonById(idHoaDon: string): void {
  //   this.apiService.getHoaDonById(idHoaDon)
  //     .subscribe(
  //       (response: ApiResponse<any>) => {
  //         if (response.result) {
  //           this.hoaDon = response.result;
  //           localStorage.setItem('hoaDon', JSON.stringify(response.result));
  //           this.router.navigate(['/admin/hoa-don'])
  //         }
  //       })
  // }


  // handleError(error: HttpErrorResponse): void {
  //   console.error(error);
  //   if (error.error.code === ErrorCode.PASSWORD_INVALID) {
  //     this.errorMessage = 'Mã danh mục không được để trống';
  //   } else {
  //     this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau.';
  //   }
  // }

  updateTrangThai(id: string, trangThai: number): void {
    this.apiService.updateTrangThai(id, trangThai).subscribe(
      (response) => {
        if (response) {
          this.snackBar.open('Cập nhật trạng thái thành công', 'Đóng', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.getHoaDons();
          this.loadHoaDon();
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


  closeconfirmDelete() {
    if (this.deleteHoaDon && this.deleteHoaDon.nativeElement) {
      this.deleteHoaDon.nativeElement.classList.remove('show');
      this.deleteHoaDon.nativeElement.style.display = 'none';
    }
  }
  closeDetailHoaDon() {
    if (this.detailHoaDon && this.detailHoaDon.nativeElement) {
      this.detailHoaDon.nativeElement.classList.remove('show');
      this.detailHoaDon.nativeElement.style.display = 'none';
    }
  }

  huyHoaDon() {
    const storedHoaDon = this.hoaDonSelect
    if (storedHoaDon) {
      const hoaDon = storedHoaDon;
      let trangThaiMoi = 6
      this.updateTrangThai(hoaDon.id, trangThaiMoi);
      this.closeconfirmDelete();
      this.closeDetailHoaDon();
    } else {
      this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau.';
    }
  }

  showDeleteModal(): void {
    if (this.deleteHoaDon && this.deleteHoaDon.nativeElement) {
      this.deleteHoaDon.nativeElement.classList.add('show');
      this.deleteHoaDon.nativeElement.style.display = 'block';
    }
  }


}
