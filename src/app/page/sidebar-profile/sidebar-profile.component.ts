import { KhachHangService } from './../../service/KhachHangService';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../service/AuthenticationService';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-profile',
  templateUrl: './sidebar-profile.component.html',
  styleUrls: ['./sidebar-profile.component.css']
})
export class SidebarProfileComponent {
  showSearch: boolean = false;
  isLoggedInCart: boolean = false;
  isCartHovered = false;
  khachHang: any;
  gioHang: any
  gioHangChiTiet: any[] = [];

  constructor(private auth: AuthenticationService, private router: Router,
    private khachHangService: KhachHangService
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
    this.findShoppingCart()
  }


  findShoppingCart() {
    const tenDangNhap = this.auth.getTenDangNhap();
    if (tenDangNhap) {
      this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).subscribe(
        (response) => {
          const khachHang = response.result;
          this.khachHang = response.result;
        },
        (error) => {
          console.error('Error fetching customer:', error);
        }
      );
    }
  }


}
