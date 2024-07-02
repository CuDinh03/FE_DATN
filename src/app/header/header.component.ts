import {SanPhamCTService} from './../service/SanPhamCTService';
import {ErrorCode} from './../model/ErrorCode';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiResponse} from './../model/ApiResponse';
import {KhachHangService} from './../service/KhachHangService';
import {AuthenticationService} from './../service/AuthenticationService';
import {GioHangService} from 'src/app/service/GioHangService';
import {GioHangChiTietService} from './../service/GioHangChiTietService';
import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showSearch: boolean = false;
  isLoggedInCart: boolean = false;
  isCartHovered = false;
  khachHang: any = {};
  gioHang: any
  gioHangChiTiet: any[] = [];

  constructor(private auth: AuthenticationService, private router: Router,
              private gioHangChiTietService: GioHangChiTietService,
              private gioHangService: GioHangService,
              private khachHangService: KhachHangService,
              private sanPhamCTService: SanPhamCTService
  ) {
    //   const tenDangNhap = localStorage.getItem('tenDangNhap');
    // if (tenDangNhap) {
    //   this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).subscribe(
    //     (response) => {
    //       this.customer = response.result;
    //       // Xử lý dữ liệu khách hàng ở đây
    //       console.log(this.customer);
    //     },
    //     (error) => {
    //       console.error('Error fetching customer:', error);
    //     }
    //   );
    // }

  }

  ngOnInit() {
    // Kiểm tra trạng thái đăng nhập của người dùng
    this.checkLoginStatus();
    this.findShoppingCart()
  }


  findShoppingCart() {
    const tenDangNhap = this.auth.getTenDangNhap();
    if (tenDangNhap) {
      this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).subscribe(
        (response) => {
          const khachHang = response.result;
          this.khachHang = response.result;
          if (khachHang && khachHang.id) {
            this.gioHangService.findGioHangByIdKhachHang(khachHang.id).subscribe(
              (response) => {
                const gioHang = response.result;
                if (gioHang && gioHang.id) {
                  this.loadGioHangChiTiet(gioHang.id);
                }
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

  loadGioHangChiTiet(idGioHang: string): void {
    this.gioHangChiTietService.getAllBỵKhachHang(idGioHang).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result && response.result.length > 0) {
          this.gioHangChiTiet = response.result;
          console.log(this.gioHangChiTiet);
        } else {
          this.gioHangChiTiet = [];
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Unexpected error:', error);
      }
    );
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedInCart = !!token;
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  getAccount(): boolean {
    if (this.auth.getRole() == 'ADMIN') {
      return true;
    }
    return false;

  }

  onMouseOver() {
    this.isCartHovered = true;
  }

  onMouseLeave() {
    this.isCartHovered = false;
  }

  getCartTotal(): number {
    return this.gioHangChiTiet.reduce((total, item) => {
      return total + item.soLuong * item.chiTietSanPham.giaBan;
    }, 0);
  }

  logout() {
    // Gọi phương thức logout từ AuthenticationService
    this.auth.logout();
    // Redirect đến trang đăng nhập sau khi đăng xuất
    this.router.navigate(['/trang-chu']).then(() => {
      console.log('Redirected to /trang-chu');
      this.router.navigate(['/trang-chu']).then(() => {
        console.log('Redirected to /trang-chu');
      }).catch(err => {
        console.error('Error navigating to /trang-chu:', err);
      });
    }).catch(err => {
      console.error('Error navigating to /trang-chu:', err);
    });
    window.location.reload();
  }

  getTotalQuantity(): number {
    return this.gioHangChiTiet.reduce((total, item) => total + item.soLuong, 0);
  }

}
