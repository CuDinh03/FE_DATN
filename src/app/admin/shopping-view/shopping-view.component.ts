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
import { SanPhamService } from 'src/app/service/SanPhamService';

@Component({
  selector: 'app-shopping-view',
  templateUrl: './shopping-view.component.html',
  styleUrls: ['./shopping-view.component.css']
})

export class ShoppingViewComponent {
  listHoaDon: any[] = [];
  danhMuc: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  selectedDanhMuc: any;
  listSanPham: any[] = [];
  listHoaDonChiTiet: any[] = [];


  constructor(private auth: AuthenticationService,
    private router: Router,
    private hoaDonService: HoaDonService,
    private apiService: DanhMucService,
    private sanPhamService: SanPhamService
  ) {
    // Khởi tạo danhMucForm ở đây

  }

  ngOnInit(): void {
    this.loadHoaDon();
    this.getAllSanPham();
    // api get all hoa don

  }

  getHoaDonChiTietByIdHoaDon(id: string) {
    // call api hoa don chi tiet theo id hoa don
    // this.listHoaDonChiTiet
  }


  loadHoaDon(): void {
    this.hoaDonService.getAll()
      .subscribe(
        (response: ApiResponse<any>) => this.handleApiResponse(response),
        (error: any) => console.error('Error loading invoices:', error)
      );
  }

  getAllSanPham(): void {
    this.sanPhamService.getAll().subscribe(
      res => {
        this.listSanPham = res.result;
        console.log(this.listSanPham)
      }
    )
  }


  private handleApiResponse(response: ApiResponse<any>): void {
    if (response && response.result) {
      this.listHoaDon = response.result;
    } else {
      console.log('Không tìm thấy danh sách hóa đơn nào');
    }
  }

  loadDanhMuc(): void {
    this.apiService.getDanhMuc(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.danhMuc = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
        console.log("view danh muc");
      });
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
