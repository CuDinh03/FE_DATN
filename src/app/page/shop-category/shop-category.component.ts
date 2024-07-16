import { Component } from '@angular/core';
import {AuthenticationService} from "../../service/AuthenticationService";
import {Router} from "@angular/router";
import {SanPhamCTService} from "../../service/SanPhamCTService";
import {SanPhamService} from "../../service/SanPhamService";
import {DanhGiaService} from "../../service/DanhGiaService";
import {ApiResponse} from "../../model/ApiResponse";
import {HttpErrorResponse} from "@angular/common/http";
import {MauSacService} from "../../service/MauSacService";
import {KichThuocService} from "../../service/KichThuocService";
import {DanhMucService} from "../../service/DanhMucService";
import {KichThuocDto} from "../../model/kich-thuoc-dto.model";
import {MauSacDto} from "../../model/mau-sac-dto.model";
import {DanhMucDto} from "../../model/danh-muc-dto.model";
import {FilterSanPhamRequest} from "../../model/FilterSanPhamRequest";

@Component({
  selector: 'app-shop-category',
  templateUrl: './shop-category.component.html',
  styleUrls: ['./shop-category.component.css']
})
export class ShopCategoryComponent {
  chiTietSanPham: any[] = [];
  findSanPhamChiTiet: any = {};
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  danhGiaMap: { [key: string]: number } = {}; // Object để lưu trữ số lượng đánh giá theo từng productId
  diemDanhGiaMap: { [key: string]: number } = {}; // Object để lưu trữ điểm đánh giá theo từng productId
  colors: any[] = [];
  sizes: any[] = [];
  categories: any[] = [];
  selectedCategory: DanhMucDto | null = null;
  selectedColor: MauSacDto | null = null;
  selectedSize: KichThuocDto | null = null;



  constructor(private auth: AuthenticationService,
              private router: Router,
              private sanPhamCTService: SanPhamCTService,
              private sanPhamService: SanPhamService,
              private danhGiaService: DanhGiaService,
              private mauSacService: MauSacService,
              private kichThuocService: KichThuocService,
              private danhMucService: DanhMucService,
              ) {}

  ngOnInit(): void {
    this.loadDanhSachSanPham();
    this.getMauSac();
    this.getKichThuoc();
    this.getDanhMuc();
    this.filterProducts();
  }

  onCategoryChange(category: DanhMucDto) {
    this.selectedCategory = category;
    this.filterProducts();
  }

  onColorChange(color: MauSacDto) {
    this.selectedColor = color;
    this.filterProducts();
  }

  onSizeChange(size: KichThuocDto) {
    this.selectedSize = size;
    this.filterProducts();
  }

  filterProducts() {
    const request: FilterSanPhamRequest = {
      danhMuc: this.selectedCategory ? this.selectedCategory : null,
      mauSac: this.selectedColor ? this.selectedColor : null,
      kichThuoc: this.selectedSize ? this.selectedSize : null
    };

    this.sanPhamCTService.filterSanPham(request, 0, 10).subscribe((response: ApiResponse<any>) => {
      if (response.result) {
        this.chiTietSanPham = response.result.content;
      }
    });
  }

  findSanPhamById(id: string): void {
    this.sanPhamCTService.getChiTietSanPhamById(id).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result) {
          this.findSanPhamChiTiet = response.result;
          localStorage.setItem('sanPhamChiTiet', JSON.stringify(response.result));
          this.router.navigate(['/san-pham']);
        }
      });
  }

  loadDanhSachSanPham(): void {
    this.sanPhamCTService.getAllSanPhamChiTiet().subscribe(
      (response: ApiResponse<any>) => {
        if (response.result && response.result.length > 0) {
          this.chiTietSanPham = response.result;
          this.chiTietSanPham.forEach((sanPham) => {
            this.danhGiaService.getSoLuongDanhGia(sanPham.id).subscribe(
              (apiResponse: ApiResponse<any>) => {
                if (apiResponse.result) {
                  this.danhGiaMap[sanPham.id] = apiResponse.result; // Lưu số lượng đánh giá vào danhGiaMap
                }
              },
              (error: HttpErrorResponse) => {
                console.error(`Error loading danh gia count for productId ${sanPham.id}:`, error);
              }
            );
            this.danhGiaService.getDiemDanhGia(sanPham.id).subscribe(
              (apiResponse: ApiResponse<any>) => {
                if (apiResponse.result) {
                  this.diemDanhGiaMap[sanPham.id] = apiResponse.result; // Lưu điểm đánh giá vào diemDanhGiaMap
                }
              },
              (error: HttpErrorResponse) => {
                console.error(`Error loading diem danh gia for productId ${sanPham.id}:`, error);
              }
            );
          });
        } else {
          console.log(response);
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading products:', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDanhSachSanPham();
  }

  getMauSac(): void{
    this.mauSacService.getAllColors().subscribe(
      response => {
        if (response.result) {
          this.colors = response.result;
        }
      },
      error => {
        console.error('Error fetching colors:', error);
      }
    );
  }

  getKichThuoc(): void{
    this.kichThuocService.getAllKichThuoc().subscribe(
      response => {
        if (response.result) {
          this.sizes = response.result;
        }
      },
      error => {
        console.error('Error fetching colors:', error);
      }
    );
  }

  getDanhMuc(): void{
    this.danhMucService.getAllDanhMuc().subscribe(
      response => {
        if (response.result) {
          this.categories = response.result;
        }
      },
      error => {
        console.error('Error fetching colors:', error);
      }
    );
  }

  getSoLuongDanhGia(productId: string): number {
    return this.danhGiaMap[productId] || 0; // Trả về số lượng đánh giá từ danhGiaMap hoặc mặc định là 0
  }

  getDiemDanhGia(productId: string): number {
    return this.diemDanhGiaMap[productId] || 0; // Trả về điểm đánh giá từ diemDanhGiaMap hoặc mặc định là 0
  }
}
