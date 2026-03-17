import { SanPhamCTService } from '../service/SanPhamCTService';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../model/ApiResponse';
import { KhachHangService } from '../service/KhachHangService';
import { AuthenticationService } from '../service/AuthenticationService';
import { GioHangService } from 'src/app/service/GioHangService';
import { GioHangChiTietService } from './../service/GioHangChiTietService';
import { Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  findSanPhamChiTiet: any = {};
  private destroyRef = inject(DestroyRef);

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private gioHangChiTietService: GioHangChiTietService,
    private gioHangService: GioHangService,
    private khachHangService: KhachHangService,
    private sanPhamCTService: SanPhamCTService
  ) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.sanPhamCTService.search(term, this.page, this.size)),
      catchError(err => {
        console.error('Error during search:', err);
        return of({ result: { content: [], totalElements: 0, totalPages: 0 } });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(response => {
      this.listChiTietSP = response.result?.content ?? [];
      this.totalElements = response.result?.totalElements ?? 0;
      this.totalPages = response.result?.totalPages ?? 0;
    });

    this.checkLoginStatus();
    this.findShoppingCart();
    this.loadSanPhamChiTietByNgayTao();
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
    console.log(this.listChiTietSP);
  }

  loadSanPhamChiTietByNgayTao(): void {
    this.sanPhamCTService.getSanPhamChiTietSapXepByNGayTao(this.page, this.size).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(response => {
      this.listChiTietSP = response.result?.content ?? [];
      this.totalElements = response.result?.totalElements ?? 0;
      this.totalPages = response.result?.totalPages ?? 0;
    });
  }

  findShoppingCart() {
    const tenDangNhap = this.auth.getTenDangNhap();
    if (!tenDangNhap) return;
    this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        const khachHang = response.result;
        this.khachHang = response.result;
        if (khachHang?.id) {
          this.gioHangService.findGioHangByIdKhachHang(khachHang.id).pipe(
            takeUntilDestroyed(this.destroyRef)
          ).subscribe({
            next: (res) => {
              const gioHang = res.result;
              if (gioHang?.id) this.loadGioHangChiTiet(gioHang.id);
            },
            error: (err) => console.error('Error fetching shopping cart:', err)
          });
        }
      },
      error: (err) => console.error('Error fetching customer:', err)
    });
  }

  loadGioHangChiTiet(idGioHang: string): void {
    this.gioHangChiTietService.getAllByKhachHang(idGioHang).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: ApiResponse<any>) => {
        this.gioHangChiTiet = response.result?.length ? response.result : [];
      },
      error: (err) => console.error('Unexpected error:', err)
    });
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
    return this.auth.isAdmin();
  }

  onMouseOver1() {
    this.isCartHovered1 = true;
  }

  onMouseLeave1() {
      this.isCartHovered1 = false;
  }

  findSanPhamById(id: string): void {
    this.sanPhamCTService.getChiTietSanPhamByIdKH(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.result) {
          this.findSanPhamChiTiet = response.result;
          localStorage.setItem('sanPhamChiTiet', JSON.stringify(response.result));
          const role = this.auth.getRole();
          this.router.navigate(role === 'ROLE_CUSTOMER' ? ['/customer/san-pham'] : ['/san-pham']);
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
