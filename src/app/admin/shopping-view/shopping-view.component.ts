
import { GioHangChiTietService } from './../../service/GioHangChiTietService';
import { HoaDonGioHangService } from './../../service/HoaDonGioHangService';
import { HoaDonService } from './../../service/HoaDonService';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators } from '@angular/forms';
import { AuthenticationService } from './../../service/AuthenticationService';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DanhMucDto } from 'src/app/model/danh-muc-dto.model';
import { DanhMucService } from 'src/app/service/DanhMucService';
import { ApiResponse } from "../../model/ApiResponse";
import { ErrorCode } from "../../model/ErrorCode";
import { HoaDonChiTietService } from 'src/app/service/HoaDonChiTietService';

@Component({
  selector: 'app-shopping-view',
  templateUrl: './shopping-view.component.html',
  styleUrls: ['./shopping-view.component.css']
})

export class ShoppingViewComponent {
  listHoaDon: any[] = [];
  listHoaDonGioHang: any[] = [];
  hoaDon: any = {};
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  selectedDanhMuc: any;
  maxHoaDon = 5;
  isModalVisible = false;
  gioHangChiTiet: any[] = [];
  noProductsFound: boolean = false;

  constructor(private auth: AuthenticationService,
    private router: Router, 
    private hoaDonChiTietService: HoaDonChiTietService, 
    private apiService: DanhMucService,
    private hoaDonService: HoaDonService,
    private hoaDonGioHangService: HoaDonGioHangService,
    private gioHangChiTietService: GioHangChiTietService) {
      // Khởi tạo danhMucForm ở đây
  }

  ngOnInit(): void {
    this.loadHoaDon();
    this.loadHoaDonGioHang();
    
  }

  // loadHoaDonChiTiet(): void {
  //   this.hoaDonService.getAll()
  //     .subscribe(
  //       (response: ApiResponse<any>) => this.handleApiResponse(response),
  //       (error: any) => console.error('Error loading invoices:', error)
  //     );
  // }

  loadGioHangChiTiet(idGioHang: string): void {
    this.gioHangChiTietService.getAll(idGioHang).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result && response.result.length > 0) {
          this.gioHangChiTiet = response.result;
          this.noProductsFound = false;
        } else {
          this.noProductsFound = true;
          this.gioHangChiTiet = [];
        }
      },
      (error: HttpErrorResponse) => {
        if (error.error.code === ErrorCode.NO_ORDER_FOUND) {
          this.noProductsFound = true;
          this.gioHangChiTiet = [];
        } else {
          console.error('Unexpected error:', error);
        }
      }
    );
  }

  handleErrorGetAllHoaDonCT(error: HttpErrorResponse): void {
    console.error(error);
    if (error.error.code === ErrorCode.NO_ORDER_FOUND) {
      this.errorMessage = 'Chưa có sản phẩm nào';
    }
  }

  loadHoaDonGioHang(): void {
    this.hoaDonGioHangService.getAll().subscribe(
      (response: ApiResponse<any>) => {
        if (response.result && response.result.length > 0) {
          // Nếu có hóa đơn chi tiết, gán danh sách vào biến và đặt noProductsFound là false
          this.listHoaDonGioHang = response.result;
        } else {
          console.log(response);
        }
      },
      (error: HttpErrorResponse) => {
        this.handleErrorGetAllHoaDonCT(error);
      }
    );
  }
  

  loadHoaDon(): void {
      this.hoaDonService.getAll()
        .subscribe(
          (response: ApiResponse<any>) => this.handleApiResponse(response),
          (error: any) => console.error('Error loading invoices:', error)
        );
    }

  // => list san pham chi tiet
  // getAllSanPham(): void {
  //   this.sanPhamCTService.getAll().subscribe(
  //     res => {
  //       this.listSanPhamCT = res.result;
  //       console.log(this.listSanPhamCT)
  //     }
  //   )
  // }

  // => list hoa don
  private handleApiResponse(response: ApiResponse<any>): void {
    if (response && response.result) {
      this.listHoaDon = response.result;
    } else {
      console.log('Không tìm thấy danh sách hóa đơn nào');
    }
  }


  logout() {
    // Gọi phương thức logout từ AuthenticationService
    this.auth.logout();
    // Redirect đến trang đăng nhập sau khi đăng xuất
    this.router.navigate(['/log-in']).then(() => {
      console.log('Redirected to /login');
      this.router.navigate(['/log-in']).then(() => {
        console.log('Redirected to /log-in');
      }).catch(err => {
        console.error('Error navigating to /log-in:', err);
      });
    }).catch(err => {
      console.error('Error navigating to /login:', err);
    });
  }

  createHoaDon(): void {
    this.submitted = true;
    if (this.listHoaDon.length >= this.maxHoaDon) {
      this.openModal();
      return;
    }
    this.hoaDonChiTietService.createHoaDon(this.hoaDon).subscribe(data => {

      console.log(data);
      this.loadHoaDon();
      this.router.navigate(['/admin/shopping']);
    }, err => console.log(err));
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
