
import { HoaDonChiTietService } from '../../service/HoaDonChiTietService';
import { AuthenticationService } from './../../service/AuthenticationService';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DanhMucDto } from 'src/app/model/danh-muc-dto.model';
import { DanhMucService } from 'src/app/service/DanhMucService';
import {ApiResponse} from "../../model/ApiResponse";
import { HoaDonCTService } from 'src/app/service/HoaDonCTService';

@Component({
  selector: 'app-orders-view',
  templateUrl: './orders-view.component.html',
  styleUrls: ['./orders-view.component.css']
})
export class OrdersViewComponent {

  listHoaDon: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';

  constructor(private apiService: HoaDonChiTietService, private formBuilder: FormBuilder,
    private router: Router, private auth: AuthenticationService) {
      // Khởi tạo danhMucForm ở đây
    
  }



  ngOnInit(): void {
    // this.loadHoaDon();
  }
  // get f() {
  //   return this.danhMucForm.controls;
  // }

  // loadHoaDon(): void {
  //   this.apiService.getAll()
  //     .subscribe(
  //       (response: ApiResponse<any>) => this.handleApiResponse(response),
  //       (error: any) => console.error('Error loading invoices:', error)
  //     );
  // }

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
}
