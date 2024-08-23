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
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ErrorCode} from "../../model/ErrorCode";

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
  size: number = 12;
  page: number = 0;
  noProductsFound: boolean = false;


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
    this.getMauSac();
    this.getKichThuoc();
    this.getDanhMuc();
    this.filterProducts();
  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    // Thực hiện hành động tương ứng với giá trị được chọn
    this.handleSelection(selectedValue);
  }

  // Phương thức để xử lý giá trị được chọn
  handleSelection(value: string): void {
    if (value === '4') {
      // Thực hiện hành động khi chọn "10"
      this.size = 4;
      this.filterProducts();
    } else if (value === '8') {
      // Thực hiện hành động khi chọn "15"
      this.size = 8;
      this.filterProducts();
    }
    else if (value === '12') {
      // Thực hiện hành động khi chọn "15"
      this.size = 12;
      this.filterProducts();
    }else if (value === '20') {
      // Thực hiện hành động khi chọn "15"
      this.size = 20;
      this.filterProducts();
    }
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

    this.sanPhamCTService.filterSanPham(request, this.page, this.size).subscribe((response: ApiResponse<any>) => {
      if (response.result) {
        this.chiTietSanPham = response.result.content;
        this.noProductsFound = false;
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
      }else {
        this.chiTietSanPham = [];
        this.noProductsFound = true;
      }
    },(error: HttpErrorResponse) => {
        if (error.error.code === ErrorCode.NO_LISTSPChiTiet_FOUND) {
          this.chiTietSanPham = [];
          this.noProductsFound = true;
        } else {
          console.error('Unexpected error:', error);
        }
      }

      );
  }

  onPageChangeSanPhamCT(page: number): void {
    this.page = page;
    this.filterProducts();
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
