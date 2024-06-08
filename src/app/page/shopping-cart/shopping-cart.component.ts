import { MatSnackBar } from '@angular/material/snack-bar';
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
  showConfirmationModal: boolean = false;
  itemToDeleteId: string = '';


  constructor(private auth: AuthenticationService, private router: Router,
    private gioHangChiTietService: GioHangChiTietService,
    private gioHangService: GioHangService,
    private khachHangService: KhachHangService,
    private snackBar: MatSnackBar
  ) {
    

  }

  ngOnInit() {
    // Kiểm tra trạng thái đăng nhập của người dùng
    this.checkLoginStatus();
    this.findShoppingCart();
  }

  
  confirmDelete(id: string) {
    this.itemToDeleteId = id;
    this.showConfirmationModal = true;
  }

  cancelDelete() {
    this.showConfirmationModal = false;
  }

  deleteConfirmed() {
    this.deleteGioHangChiTiet(this.itemToDeleteId);
    this.showConfirmationModal = false;
  }


  deleteGioHangChiTiet(idGioHangChiTiet: string): void {
    this.updateGioHangChiTiet(idGioHangChiTiet, 0);
  }

  updateGioHangChiTiet(idGioHangChiTiet: string, soLuong: number): void {
    const originalSoLuong = this.gioHangChiTiet.find(item => item.id === idGioHangChiTiet).soLuong;
    if (soLuong < 0) {
      alert('Số lượng không được nhỏ hơn 0. Vui lòng nhập lại!');
      const item = this.gioHangChiTiet.find(item => item.id === idGioHangChiTiet);
      if (item) {
        item.soLuong = originalSoLuong;
      }
      return;
    }
    this.gioHangChiTietService.updateGioHang(idGioHangChiTiet, soLuong).subscribe(
      (response: ApiResponse<any>) => {
          console.log(response.message);
          if (soLuong === 0) {
            this.snackBar.open('Xóa thành công!', 'Đóng', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            
          } else {
            this.snackBar.open('Sửa số lượng thành công!', 'Đóng', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
          this.loadGioHangChiTiet(response.result.gioHang.id);
          this.cancelDelete();
      },
      (error: HttpErrorResponse) => {
          if (error.status === 400 ) {
            this.snackBar.open('Số lượng nhập vào vượt quá số lượng còn trong kho. Vui lòng nhập lại!', 'Đóng', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
              const item = this.gioHangChiTiet.find(item => item.id === idGioHangChiTiet);
              if (item) {
                  item.soLuong = originalSoLuong;
              }
          } else {
              console.error('Error updating gio hang:', error);
          }
      }
    );
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

  increaseQuantity(item: any) {
    item.soLuong++;
  }

  decreaseQuantity(item: any) {
    if (item.soLuong > 0) {
      item.soLuong--;
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


  getTotalQuantity(): number {
    return this.gioHangChiTiet.reduce((total, item) => total + item.soLuong, 0);
  }
}
