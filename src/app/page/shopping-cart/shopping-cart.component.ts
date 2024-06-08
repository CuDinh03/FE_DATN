import { ApiResponse } from './../../model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { KhachHangService } from './../../service/KhachHangService';
import { GioHangService } from 'src/app/service/GioHangService';
import { GioHangChiTietService } from './../../service/GioHangChiTietService';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../service/AuthenticationService';
import { Component } from '@angular/core';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  showSearch: boolean = false;
  isLoggedInCart: boolean = false;
  isCartHovered = false;
  khachHang: any;
  gioHang: any
  gioHangChiTiet: any[] = [];


  constructor(private auth: AuthenticationService, private router: Router,
    private gioHangChiTietService: GioHangChiTietService,
    private gioHangService: GioHangService,
    private khachHangService: KhachHangService
  ) {
    

  }

  ngOnInit() {
    // Kiểm tra trạng thái đăng nhập của người dùng
    this.checkLoginStatus();
    this.findShoppingCart();
  }

  calculateSubtotal(item: any): number {
    return item.chiTietSanPham.giaBan * item.soLuong;
  }
  
  findShoppingCart() {
    const tenDangNhap = this.auth.getTenDangNhap();
    if (tenDangNhap) {
      this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).subscribe(
        (response) => {
          const khachHang = response.result;
          if (khachHang && khachHang.id) {
            this.gioHangService.findGioHangByIdKhachHang(khachHang.id).subscribe(
              (response) => {
                const gioHang = response.result;
                console.log(gioHang);
                if (gioHang && gioHang.id){
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
    this.gioHangChiTietService.getAll(idGioHang).subscribe(
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


  getTotalQuantity(): number {
    return this.gioHangChiTiet.reduce((total, item) => total + item.soLuong, 0);
  }
}
