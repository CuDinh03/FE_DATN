import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from './../../model/ApiResponse';
import { SanPhamCTService } from 'src/app/service/SanPhamCTService';
import { AuthenticationService } from "../../service/AuthenticationService";
import { Router } from "@angular/router";
import { SanPhamService } from "../../service/SanPhamService";
import { DanhGiaService } from "../../service/DanhGiaService";

@Component({
  selector: 'app-trending-product',
  templateUrl: './trending-product.component.html',
  styleUrls: ['./trending-product.component.css']
})
export class TrendingProductComponent implements OnInit {
  chiTietSanPham: any[] = [];
  findSanPhamChiTiet: any = {};
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  page: number = 0;
  size: number = 20;
  danhGiaMap: { [key: string]: number } = {}; // Object để lưu trữ số lượng đánh giá theo từng productId
  diemDanhGiaMap: { [key: string]: number } = {}; // Object để lưu trữ điểm đánh giá theo từng productId

  constructor(private auth: AuthenticationService,
              private router: Router,
              private sanPhamCTService: SanPhamCTService,
              private danhGiaService: DanhGiaService) {}

  ngOnInit(): void {
    this.loadDanhSachSanPham();
  }

  findSanPhamById(id: string): void {
    this.sanPhamCTService.getChiTietSanPhamById(id).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result) {
          this.findSanPhamChiTiet = response.result;
          localStorage.setItem('sanPhamChiTiet', JSON.stringify(response.result));
          this.router.navigate(['/customer/san-pham']);
        }
      });
  }

  loadDanhSachSanPham(): void {
    this.sanPhamCTService.getSanPhamChiTietSapXepByNGayTao(this.page, this.size).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result.content && response.result.content.length > 0) {
          this.chiTietSanPham = response.result.content;
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

  getSoLuongDanhGia(productId: string): number {
    return this.danhGiaMap[productId] || 0; // Trả về số lượng đánh giá từ danhGiaMap hoặc mặc định là 0
  }

  getDiemDanhGia(productId: string): number {
    return this.diemDanhGiaMap[productId] || 0; // Trả về điểm đánh giá từ diemDanhGiaMap hoặc mặc định là 0
  }
}
