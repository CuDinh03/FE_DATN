
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
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.css']
})
export class PaymentViewComponent {
  showSearch: boolean = false;
  isLoggedInCart: boolean = false;
  isCartHovered = false;
  khachHang: any;
  gioHang: any
  gioHangChiTiet: any[] = [];
  showConfirmationModal: boolean = false;
  itemToDeleteId: string = '';
  allSelected = false;
  selectedTotal = 0;
  showFooter: boolean = false;
  showUpperFooter: boolean = true;




  constructor(private auth: AuthenticationService, private router: Router,
    private gioHangChiTietService: GioHangChiTietService,
    private gioHangService: GioHangService,
    private khachHangService: KhachHangService,
    private snackBar: MatSnackBar,
    private el: ElementRef, private renderer: Renderer2
  ) {
    

  }
  ngOnInit() {
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

  getCartTotal(): number {
    return this.gioHangChiTiet.reduce((total, item) => {
      return total + item.soLuong * item.chiTietSanPham.giaBan;
    }, 0);
  }

}
