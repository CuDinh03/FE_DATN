import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from './../../model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { KhachHangService } from './../../service/KhachHangService';
import { GioHangService } from 'src/app/service/GioHangService';
import { GioHangChiTietService } from './../../service/GioHangChiTietService';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../service/AuthenticationService';
import { Component, DestroyRef, ElementRef, inject, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getApiErrorMessage } from '../../util/error-message.util';


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
  selectedItems: any[] = [];
  private destroyRef = inject(DestroyRef);

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
    this.gioHangChiTietService.updateGioHangKH(idGioHangChiTiet, soLuong).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: ApiResponse<any>) => {
        if (soLuong === 0) {
          this.snackBar.open('Xóa thành công!', 'Đóng', { duration: 3000, panelClass: ['success-snackbar'] });
        } else {
          this.snackBar.open('Sửa số lượng thành công!', 'Đóng', { duration: 3000, panelClass: ['success-snackbar'] });
        }
        const gioHangId = response.result?.gioHang?.id;
        if (gioHangId) {
          this.loadGioHangChiTiet(gioHangId);
        }
        this.cancelDelete();
      },
      error: (error: HttpErrorResponse) => {
        const msg = getApiErrorMessage(error, 'Số lượng nhập vào vượt quá số lượng còn trong kho. Vui lòng nhập lại!');
        this.snackBar.open(msg, 'Đóng', { duration: 3000, panelClass: ['error-snackbar'] });
        const item = this.gioHangChiTiet.find(i => i.id === idGioHangChiTiet);
        if (item) {
          item.soLuong = originalSoLuong;
        }
      }
    });
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
    if (!tenDangNhap) return;
    this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        const khachHang = response.result;
        if (khachHang?.id) {
          this.gioHangService.findGioHangByIdKhachHang(khachHang.id).pipe(
            takeUntilDestroyed(this.destroyRef)
          ).subscribe({
            next: (res) => {
              const gioHang = res.result;
              if (gioHang?.id) {
                this.loadGioHangChiTiet(gioHang.id);
              }
            },
            error: (err) => console.error('Error fetching shopping cart:', err)
          });
        }
      },
      error: (err) => console.error('Error fetching customer:', err)
    });
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
    this.gioHangChiTietService.getAllByKhachHang(idGioHang).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: ApiResponse<any>) => {
        this.gioHangChiTiet = response.result?.length ? response.result : [];
        const saved = localStorage.getItem('selectedItems');
        if (saved) {
          const selectedIds = (JSON.parse(saved) as any[]).map((x: any) => x?.id).filter(Boolean);
          this.gioHangChiTiet.forEach((item: any) => {
            item.selected = selectedIds.includes(item.id);
          });
        }
      },
      error: (err) => console.error('Unexpected error:', err)
    });
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
