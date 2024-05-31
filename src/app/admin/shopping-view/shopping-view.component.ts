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
  hoaDon: any = {};
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  selectedDanhMuc: any;
  maxHoaDon = 5;
  isModalVisible = false;
  chiTietHoaDon: any[] = [];
  noProductsFound: boolean = false;

  constructor(private auth: AuthenticationService,private router: Router, private hoaDonChiTietService: HoaDonChiTietService, private apiService: DanhMucService,
    private hoaDonService: HoaDonService) {
      // Khởi tạo danhMucForm ở đây
    
  }
  ngOnInit(): void {
    this.loadHoaDon();
    
  }

  // loadHoaDonChiTiet(): void {
  //   this.hoaDonService.getAll()
  //     .subscribe(
  //       (response: ApiResponse<any>) => this.handleApiResponse(response),
  //       (error: any) => console.error('Error loading invoices:', error)
  //     );
  // }

  loadHoaDonChiTiet(idHoaDon: string): void {
    this.hoaDonChiTietService.getAll(idHoaDon).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result && response.result.length > 0) {
          // Nếu có hóa đơn chi tiết, gán danh sách vào biến và đặt noProductsFound là false
          this.chiTietHoaDon = response.result;
          this.noProductsFound = false;
        } else {
          // Nếu không có hóa đơn chi tiết, đặt noProductsFound là true
          this.noProductsFound = true;
        }
      },
      (error: HttpErrorResponse) => {
        this.handleErrorGetAllHoaDonCT(error);
      }
    );
    
  }

  handleErrorGetAllHoaDonCT(error: HttpErrorResponse): void {
    console.error(error);
    if (error.error.code === ErrorCode.NO_ORDER_FOUND) {
      this.errorMessage = 'Chưa có sản phẩm nào';
    }
  }
  

  loadHoaDon(): void {
      this.hoaDonService.getAll()
        .subscribe(
          (response: ApiResponse<any>) => this.handleApiResponse(response),
          (error: any) => console.error('Error loading invoices:', error)
        );
    }

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
    if(this.listHoaDon.length >= this.maxHoaDon){
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
