import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from './../../model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { KhachHangService } from './../../service/KhachHangService';
import { GioHangService } from 'src/app/service/GioHangService';
import { GioHangChiTietService } from './../../service/GioHangChiTietService';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../service/AuthenticationService';
import { Component, ElementRef, Renderer2, HostListener } from '@angular/core';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent {
  isLoggedInCart: boolean = false;
  isCartHovered = false;
  khachHang: any;
  gioHang: any
  gioHangChiTiet: any[] = [];
  showConfirmationModal: boolean = false;
  itemToDeleteId: string = '';
  allSelected = false;
  selectedTotal = 0;
  selectedItems: any[] = []



  constructor(private auth: AuthenticationService, private router: Router,
              private gioHangChiTietService: GioHangChiTietService,
              private gioHangService: GioHangService,
              private khachHangService: KhachHangService,
              private snackBar: MatSnackBar,
              private el: ElementRef, private renderer: Renderer2
  ) {


  }
  ngOnInit() {
    // Kiểm tra trạng thái đăng nhập của người dùng
    this.checkLoginStatus();
    this.findShoppingCart();
    const savedItems = localStorage.getItem('selectedItems');
    if (savedItems) {
      this.selectedItems = JSON.parse(savedItems);
      this.gioHangChiTiet.forEach(item => {
        item.selected = this.selectedItems.some(selectedItem => selectedItem.id === item.id);
      });
    }
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
      this.snackBar.open('Số lượng không được nhỏ hơn 0. Vui lòng nhập lại!', 'Đóng', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      const item = this.gioHangChiTiet.find(item => item.id === idGioHangChiTiet);
      if (item) {
        item.soLuong = originalSoLuong;
      }
      return;
    }
    this.gioHangChiTietService.updateGioHangKH(idGioHangChiTiet, soLuong).subscribe(
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
            panelClass: ['error-snackbar']
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


  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.gioHangChiTiet.forEach(item => item.selected = checked);
    this.allSelected = checked;
    this.calculateSelectedTotal();
  }

  calculateSubtotal(item: any): number {
    return item.chiTietSanPham.giaBan * item.soLuong;
  }

  calculateSelectedTotal(): void {
    let total = 0;
    this.selectedItems = [];
    this.gioHangChiTiet.forEach(item => {
      if (item.selected) {
        total += this.calculateSubtotal(item);
        this.selectedItems.push(item);
      }
    });
    this.selectedTotal = total;
    localStorage.setItem('selectedItems', JSON.stringify(this.selectedItems));
  }

  getSelectedTotal(): number {
    return this.selectedTotal;
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


  checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedInCart = !!token;
  }



  onMouseLeave() {
    this.isCartHovered = false;
  }

  checkCartAndProceed(): void {
    if (this.selectedItems.length === 0) {
      this.snackBar.open('Vui lòng chọn sản phẩm', 'Đóng', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    } else {
      this.router.navigate(['/customer/thanh-toan']);
    }
  }

}
