import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { KhachHangService } from './../../service/KhachHangService';
import { GioHangService } from './../../service/GioHangService';
import { GioHangChiTietService } from './../../service/GioHangChiTietService';
import { ApiResponse } from './../../model/ApiResponse';
import { SanPhamCTService } from './../../service/SanPhamCTService';
import { AuthenticationService } from "../../service/AuthenticationService";
import { ActivatedRoute, Router } from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HoaDonChiTietService} from "../../service/HoaDonChiTietService";
import {DanhGiaService} from "../../service/DanhGiaService";
import {DanhGiaDto} from "../../model/danh-gia-dto";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  findCiTietSanPham: any = {};
  currentLargeImage: string = '';
  quantity: number = 1;
  khachHang: any;
  gioHang: any;
  gioHangChiTiet: any[] = [];
  listMauSac: any[] = [];
  listKichThuoc: any[] = [];
  selectedColor: any;
  selectedSize: any;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private sanPhamCTService: SanPhamCTService,
    private gioHangChiTietService: GioHangChiTietService,
    private gioHangService: GioHangService,
    private khachHangService: KhachHangService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private danhGiaServe: DanhGiaService,
  ) {
    this.danhGiaForm = this.formBuilder.group({
      khachHang: [''],
      hoaDonChiTiet: [''],
      tieuDe: [''],
      noiDung: [''],
      diem: [''],
      trangThai: [''],
    })

    const tenDangNhap = localStorage.getItem('tenDangNhap');
    if (tenDangNhap) {
      this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).subscribe(
        (response) => {
          this.khachHang = response.result;
        },
        (error) => {
          console.error('Error fetching customer:', error);
        }
      );
    }
  }

  ngOnInit(): void {
    this.loadSanPhamChiTiet();
    this.reloadPage();
    this.findShoppingCart();
    this.loadColors();
    this.loadSize();
    this.loadSelectedOptions();

  }

  hoaDonChiTiet: any = {};
  danhGiaForm: FormGroup;
  selectedRating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];

  get f() {
    return this.danhGiaForm.controls;
  }


  createRating(): void {
    const danhGiaDto: DanhGiaDto = {
      khachHang: this.khachHang,
      hoaDonChiTiet: null,
      tieuDe: this.danhGiaForm.value.tieuDe,
      noiDung: this.danhGiaForm.value.noiDung,
      diem: this.selectedRating,
      trangThai: 1,
    };
    this.danhGiaServe.createRating(danhGiaDto).subscribe(
      (response) => {
        this.snackBar.open('Đã đánh giá sản phẩm!', 'Đóng', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/don-mua']);
      },
      (error) => {
        this.snackBar.open('Đánh giá sản phẩm thất bại!', 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }


  selectRating(rating: number): void {
    this.selectedRating = rating;
  }


  getRatingText(rating: number): string {
    switch (rating) {
      case 1:
        return 'Tệ';
      case 2:
        return 'Không hài lòng';
      case 3:
        return 'Bình thường';
      case 4:
        return 'Hài lòng';
      case 5:
        return 'Tuyệt vời!';
      default:
        return '';
    }
  }

  loadSelectedOptions(): void {
    const storedProductDetail = localStorage.getItem('sanPhamChiTiet');
    if (storedProductDetail) {
      const chiTietSanPham = JSON.parse(storedProductDetail);
      this.selectedColor = chiTietSanPham.mauSac;
      this.selectedSize = chiTietSanPham.kichThuoc;
      // this.updateProductDetails();
    }
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
                this.gioHang = response.result;
                if (this.gioHang && this.gioHang.id) {
                  // Handle successful response
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

  loadColors(): void {
    const storeChiTietSanPham = localStorage.getItem('sanPhamChiTiet');
    if (storeChiTietSanPham) {
      const chiTietSanPham = JSON.parse(storeChiTietSanPham);
      this.sanPhamCTService.getAllMauSacByMa(chiTietSanPham.sanPham.ma).subscribe(
        (response: ApiResponse<any>) => {
          this.listMauSac = response.result;
        },
        (error) => {
          console.error('Error fetching colors', error);
        }
      );
    }
  }

  loadSize(): void {
    const storeChiTietSanPham = localStorage.getItem('sanPhamChiTiet');
    if (storeChiTietSanPham) {
      const chiTietSanPham = JSON.parse(storeChiTietSanPham);
      this.sanPhamCTService.getAllKichThuocByMa(chiTietSanPham.sanPham.ma).subscribe(
        (response: ApiResponse<any>) => {
          this.listKichThuoc = response.result;
        },
        (error) => {
          console.error('Error fetching sizes', error);
        }
      );
    }
  }

  loadSanPhamChiTiet(): void {
    const storeChiTietSanPham = localStorage.getItem('sanPhamChiTiet');
    if (storeChiTietSanPham) {
      const chiTietSanPham = JSON.parse(storeChiTietSanPham);
      this.sanPhamCTService.getChiTietSanPhamByIdKH(chiTietSanPham.id)
        .subscribe((response: ApiResponse<any>) => {
          if (response.result) {
            this.findCiTietSanPham = response.result;
            if (this.findCiTietSanPham.hinhAnh && this.findCiTietSanPham.hinhAnh.length > 0) {
              this.currentLargeImage = this.findCiTietSanPham.hinhAnh[0].url;
            }
          }
        });
    }
  }


    const storeChiTietSanPham = localStorage.getItem('sanPhamChiTiet');
    if (storeChiTietSanPham) {
      const chiTietSanPham = JSON.parse(storeChiTietSanPham);
      const productPrice = chiTietSanPham.giaBan; // Lấy giá bán của sản phẩm
      const totalPrice = productPrice * this.quantity; // Tính tổng giá trị của sản phẩm

      if (this.quantity <= 0) {
        this.snackBar.open('Số lượng nhập vào phải lớn hơn 0. Vui lòng nhập lại!', 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      if (this.quantity > chiTietSanPham.soLuong) {
        this.snackBar.open('Số lượng nhập vào vượt quá số lượng còn trong kho. Vui lòng nhập lại!', 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      if (totalPrice > 5000000) { // Kiểm tra nếu tổng giá trị vượt quá 5.000.000 VNĐ
        this.snackBar.open('Tổng giá trị đơn hàng vượt quá 5.000.000 VNĐ. Vui lòng liên hệ với chăm sóc khách hàng!', 'Đóng', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      this.addProductToCart(this.gioHang.id, chiTietSanPham.id, this.quantity);
    } else {
      console.error('Không tìm thấy giỏ hàng hoặc chi tiết sản phẩm trong localStorage.');
    }
  }


  addProductToCart(idGioHang: string, idSanPhamChiTiet: string, soLuong: number): void {
    this.gioHangChiTietService.addProductToCartKH(idGioHang, idSanPhamChiTiet, soLuong).subscribe(
      response => {
        this.snackBar.open('Thêm sản phẩm vào giỏ hàng thành công', 'Đóng', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.reloadPage();
      },
      error => {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
      }
    );
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  updateLargeImage(imageUrl: string): void {
    this.currentLargeImage = imageUrl;
  }

  reloadPage() {
    this.router.navigate([this.router.url]);
  }

  updateProductDetails(): void {
    if (this.selectedColor && this.selectedSize) {
      const storeChiTietSanPham = localStorage.getItem('sanPhamChiTiet');
      if (storeChiTietSanPham) {
        const chiTietSanPham = JSON.parse(storeChiTietSanPham);
        this.sanPhamCTService.findChiTietSanPhamByMauSacAndKichThuoc(chiTietSanPham.sanPham.ma, this.selectedSize.id, this.selectedColor.id)
          .subscribe((response: ApiResponse<any>) => {
            if (response.result) {
              this.findCiTietSanPham = response.result;
              localStorage.setItem('sanPhamChiTiet', JSON.stringify(this.findCiTietSanPham));
              if (this.findCiTietSanPham.hinhAnh && this.findCiTietSanPham.hinhAnh.length > 0) {
                this.currentLargeImage = this.findCiTietSanPham.hinhAnh[0].url;
              }
            }
          }, error => {
            console.error('Error fetching product details:', error);
          });
      }
    }
  }

  onColorChange(color: any): void {
    this.selectedColor = color;
    this.updateProductDetails();
  }

  onSizeChange(size: any): void {
    this.selectedSize = size;
    this.updateProductDetails();
  }
}
