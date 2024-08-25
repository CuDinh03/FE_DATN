import {SanPhamCTService} from '../service/SanPhamCTService';
import {ErrorCode} from './../model/ErrorCode';
import { HttpErrorResponse } from '@angular/common/http';
import {ApiResponse} from '../model/ApiResponse';
import {KhachHangService} from '../service/KhachHangService';
import {AuthenticationService} from '../service/AuthenticationService';
import {GioHangService} from 'src/app/service/GioHangService';
import {GioHangChiTietService} from './../service/GioHangChiTietService';
import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showSearch: boolean = false;
  isLoggedInCart: boolean = false;
  isCartHovered = false;
  isCartHovered1 = false;
  khachHang: any = {};
  gioHang: any
  gioHangChiTiet: any[] = [];
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject();
  listChiTietSP: any [] = [];
  page = 0;
  size = 5;
  totalElements = 0;
  totalPages: number = 0;
  findSanPhamChiTiet: any = {}
  constructor(private auth: AuthenticationService, private router: Router,
              private gioHangChiTietService: GioHangChiTietService,
              private gioHangService: GioHangService,
              private khachHangService: KhachHangService,
              private sanPhamCTService: SanPhamCTService
  ) {

  }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.sanPhamCTService.search(term, this.page, this.size)),
      catchError(error => {
        console.error('Error during search:', error);
        return of({ result: { content: [], totalElements: 0, totalPages: 0 } }); // Return empty data on error
      })
    ).subscribe(response => {
      this.listChiTietSP = response.result.content;
      this.totalElements = response.result.totalElements;
      this.totalPages = response.result.totalPages;
    });

    // Kiểm tra trạng thái đăng nhập của người dùng
    this.checkLoginStatus();
    this.findShoppingCart()
    this.loadSanPhamChiTietByNgayTao();
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
    console.log(this.listChiTietSP);
  }

  loadSanPhamChiTietByNgayTao(): void {
    this.sanPhamCTService.getSanPhamChiTietSapXepByNGayTao(this.page, this.size)
      .subscribe(response => {
        this.listChiTietSP = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
      });
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

  onMouseOver1() {
    this.isCartHovered1 = true;
  }

  onMouseLeave1() {
      this.isCartHovered1 = false;
  }

  findSanPhamById(id: string): void {
    this.sanPhamCTService.getChiTietSanPhamByIdKH(id).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result) {
          this.findSanPhamChiTiet = response.result;
          localStorage.setItem('sanPhamChiTiet', JSON.stringify(response.result));
          const role = this.auth.getRole();
          if (role === 'ROLE_CUSTOMER') {
            this.router.navigate(['/customer/san-pham']);
          }else {
            this.router.navigate(['/san-pham']);
          }
        }
      });
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
    // Redirect đến trang đăng nhập sau khi đăng xuất
      this.auth.logout();

  }

  getTotalQuantity(): number {
    return this.gioHangChiTiet.reduce((total, item) => total + item.soLuong, 0);
  }

}
