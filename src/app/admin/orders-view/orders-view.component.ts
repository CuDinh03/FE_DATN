import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiResponse} from './../../model/ApiResponse';
import {HoaDonChiTietService} from './../../service/HoaDonChiTietService';
import {HoaDonService} from './../../service/HoaDonService';
import {Router} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {AuthenticationService} from './../../service/AuthenticationService';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ErrorCode} from "../../model/ErrorCode";
import {HoaDonDto} from "../../model/hoa-don-dto.model";
import {NhanVienService} from "../../service/nhanVienService";
import {NguoiDung} from "../../model/NguoiDung";
import {SanPhamCTService} from "../../service/SanPhamCTService";
import {HoaDonSua} from "../../model/HoaDonSua";


interface MauSac {
  id: string;
  ten: string;
}

interface KichThuoc {
  id: string;
  ten: string;
}

@Component({
  selector: 'app-orders-view',
  templateUrl: './orders-view.component.html',
  styleUrls: ['./orders-view.component.css']
})


export class OrdersViewComponent {
  @ViewChild('confirmUpdate') confirmUpdate!: ElementRef;
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
  noProductsFound = false;
  noCartDetail = false;
  hoaDons: any[] = [];
  trangThai: number = 0;
  page: number = 0;
  size: number = 5;
  hoaDonSua: any = {};
  tenKhachHang: string = '';
  diaChiKhachHang: string = '';
  sdtKhachHang: string = '';
  ghiChu: string = '';
  nguoiDung: any = {}
  editingRow: number | null = null;
  mauSacOptions: any[] = [];
  kichThuocOptions: any = [];

  constructor(
    private apiService: HoaDonService,
    private hoaDonChiTietService: HoaDonChiTietService,
    private router: Router,
    private auth: AuthenticationService,
    private snackBar: MatSnackBar,
    private nhanVienService: NhanVienService,
    private ctSanPhamService: SanPhamCTService,
    private hoaDonService: HoaDonService,
  ) {

  }

  ngOnInit(): void {
    this.loadHoaDon();

  }

  enableEditing(index: number): void {
    this.editingRow = index;
  }

  saveChanges(): void {
    // Thực hiện lưu thay đổi
    this.editingRow = null;
  }

  saveChanges1(): void {
    const tenDangNhap = this.auth.getTenDangNhap();

    if (tenDangNhap) {
      this.nhanVienService.findByTenDangNhap(tenDangNhap).subscribe((response: ApiResponse<any>) => {
        this.nguoiDung = response.result;

        const request: HoaDonSua = {
          hoaDon: this.hoaDonSua,
          chiTietList: this.hoaDonChiTiet,
          nguoiDung: this.nguoiDung
        };

        console.log(request);
        this.hoaDonService.updateHoaDonSua(request).subscribe(
          (response: ApiResponse<any>) => {
            if (response.result) {
              console.log('Update successful', response.result);
              this.xacNhanSuaModal();
            }
          },
          (error) => {
            console.error('Error updating HoaDon', error);
          }
        );
      });
    } else {
      console.log("Lỗi: Không tìm thấy thông tin hóa đơn hoặc tên đăng nhập");
    }
  }

  updateMauSac(index: number, mauSacId: string): void {
    const selectedMauSac = this.mauSacOptions.find((mauSac: MauSac) => mauSac.id === mauSacId);
    if (selectedMauSac) {
      this.hoaDonChiTiet[index].chiTietSanPham.mauSac = selectedMauSac;
    }
  }

  updateKichThuoc(index: number, kichThuocId: string): void {
    const selectedKichThuoc = this.kichThuocOptions.find((kichThuoc: KichThuoc) => kichThuoc.id === kichThuocId);
    if (selectedKichThuoc) {
      this.hoaDonChiTiet[index].chiTietSanPham.kichThuoc = selectedKichThuoc;
    }
  }

  loadColors(ma: string): void {
    if (ma) {
      this.ctSanPhamService.getAllMauSacByMa(ma).subscribe(
        (response: ApiResponse<any>) => {
          if (response.result){
            this.mauSacOptions = response.result;
          }
        },
        (error) => {
          console.error('Error fetching colors', error);
        }
      );
    }
  }

  loadSize(ma: string): void {
    if (ma) {
      this.ctSanPhamService.getAllKichThuocByMa(ma).subscribe(
        (response: ApiResponse<any>) => {
          if (response.result){
            this.kichThuocOptions = response.result;
          }
        },
        (error) => {
          console.error('Error fetching sizes', error);
        }
      );
    }
  }

  enableEditingAndLoadData(i: number, ma: string): void {
    this.enableEditing(i);
    setTimeout(() => {
      this.loadColors(ma);
      this.loadSize(ma);
    }, 0);
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
        trangThai: hoaDon.trangThai + 1,
      };
      this.updateTrangThai(hoaDon.id, hoaDonDto.trangThai, hoaDonDto);
      this.loadHoaDon();
      this.closeconfirmUpdate();
      this.ghiChu = ''
    } else {
      this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau.';
    }
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
        trangThai: 5,
      };
      if (hoaDonDto.ghiChu){
        this.updateTrangThai(hoaDon.id, hoaDonDto.trangThai, hoaDonDto);
        this.loadHoaDon();
        this.closeconfirmUpdate();
        this.ghiChu = ''
      }else {
        this.snackBar.open('Cập nhật trạng thái thất bại. Vui Lòng nhập ghi chú', 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    } else {
      this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau.';
    }
  }

  xacNhanSuaModal(): void {
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
        trangThai: 2,
      };
      if (hoaDonDto.ghiChu){
        this.updateTrangThai(hoaDon.id, hoaDonDto.trangThai, hoaDonDto);
        this.loadHoaDon();
        this.closeconfirmUpdate();
        this.ghiChu = ''
      }else {
        this.snackBar.open('Cập nhật trạng thái thất bại. Vui Lòng nhập ghi chú', 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    } else {
      this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau.';
    }
  }


  loadHoaDonById(idHoaDon: string): void {
    this.apiService.getHoaDonById(idHoaDon)
        .subscribe(
        (response: ApiResponse<any>) => {
          if (response.result) {
            this.hoaDonSua = response.result;
            localStorage.setItem('hoaDon', JSON.stringify(response.result));
            this.tenKhachHang = this.hoaDonSua.khachHang.ten;
            this.diaChiKhachHang = this.hoaDonSua.khachHang.diaChi;
            this.sdtKhachHang = this.hoaDonSua.khachHang.sdt;
            console.log(this.hoaDonSua)
            this.router.navigate(['/admin/hoa-don'])
          }
        })
  }

  updateTrangThai(id: string, trangThai: number, hoaDonDto: HoaDonDto): void {
    this.apiService.updateTrangThainew(id, trangThai, hoaDonDto).subscribe(
      (response: ApiResponse<HoaDonDto>) => {
        if (response) {
          let message = '';
          switch (trangThai) {
            case 2:
              message = 'Đã xác nhận đơn hàng';
              break;
            case 4:
              message = 'Hoàn thành đơn hàng';
              break;
            case 5:
              message = 'Hủy đơn thành công';
              break;
            default:
              message = 'Cập nhật trạng thái thành công';
              break;
          }
          this.snackBar.open(message, 'Đóng', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.getHoaDons()
          this.loadHoaDon()
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
