import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from './../../model/ApiResponse';
import { SanPhamCTService } from 'src/app/service/SanPhamCTService';
import { Component, Pipe } from '@angular/core';
import { AuthenticationService } from "../../service/AuthenticationService";
import { Router } from "@angular/router";
import {SanPhamService} from "../../service/SanPhamService";



@Component({
  selector: 'app-trending-product',
  templateUrl: './trending-product.component.html',
  styleUrls: ['./trending-product.component.css']
})


export class TrendingProductComponent {
  chiTietSanPham: any[] = [];
  findSanPhamChiTiet: any = {};
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  listSanPham: any[] =[];

  constructor(private auth: AuthenticationService,
              private router: Router,
              private sanPhamCTService: SanPhamCTService,
              private sanPhamService: SanPhamService

  ) {
  }

  ngOnInit(): void {
    this.loadDanhSachSanPham();
  }


  findSanPhamById(id: string): void {
    this.sanPhamCTService.getChiTietSanPhamById(id).
    subscribe(
        (response: ApiResponse<any>) => {
          if (response.result) {
            this.findSanPhamChiTiet = response.result
            localStorage.setItem('sanPhamChiTiet', JSON.stringify(response.result))
            this.router.navigate(['/san-pham']);
          }
        })
  }

  loadDanhSachSanPham(): void {
    this.sanPhamCTService.getAllSanPhamChiTiet().subscribe(
        (response: ApiResponse<any>) => {
          if (response.result && response.result.length > 0) {
            // Nếu có hóa đơn chi tiết, gán danh sách vào biến và đặt noProductsFound là false
            this.chiTietSanPham = response.result;

          } else {
            console.log(response);
          }
        },
        (error: HttpErrorResponse) => {
        }
    );
    // this.sanPhamService.getSanPham()

  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDanhSachSanPham();
  }


}
