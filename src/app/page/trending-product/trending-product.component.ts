import { KhachHangService } from './../../service/KhachHangService';
import { GioHangService } from './../../service/GioHangService';
import { GioHangChiTietService } from './../../service/GioHangChiTietService';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from './../../model/ApiResponse';
import { SanPhamCTService } from 'src/app/service/SanPhamCTService';
import { Component, Pipe } from '@angular/core';
import { AuthenticationService } from "../../service/AuthenticationService";
import { Router } from "@angular/router";



@Component({
  selector: 'app-trending-product',
  templateUrl: './trending-product.component.html',
  styleUrls: ['./trending-product.component.css']
})


export class TrendingProductComponent {
  chiTietSanPham: any[] = [];
  findSanPhamChiTiet: any = {};
  maSanPhamChiTiet: string = 'CTSP1'
  kichThuoc: string = 'cd2a9226-8b04-498b-bee4-63eb3db29330';



  constructor(private auth: AuthenticationService,
    private router: Router,
    private sanPhamCTService: SanPhamCTService,

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
    this.sanPhamCTService.findChiTietSanPhamByKichThuoc(this.maSanPhamChiTiet, this.kichThuoc).subscribe(
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
  }


}



