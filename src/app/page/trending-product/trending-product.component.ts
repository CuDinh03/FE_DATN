import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from './../../model/ApiResponse';
import { SanPhamCTService } from 'src/app/service/SanPhamCTService';
import { Component, Pipe } from '@angular/core';
import {AuthenticationService} from "../../service/AuthenticationService";
import {Router} from "@angular/router";



@Component({
  selector: 'app-trending-product',
  templateUrl: './trending-product.component.html',
  styleUrls: ['./trending-product.component.css']
})


export class TrendingProductComponent {
  chiTietSanPham: any[] = [];

  constructor( private auth: AuthenticationService,
     private router:Router,
     private sanPhamCTService: SanPhamCTService,
     ) {
  }

  

  ngOnInit(): void {
    this.loadDanhSachSanPham();
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
  }


}



