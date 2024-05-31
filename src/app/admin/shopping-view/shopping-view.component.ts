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
import { HoaDonCTService } from 'src/app/service/HoaDonCTService';
import { SanPhamCTService } from 'src/app/service/SanPhamCTService';
import { HoaDonService } from 'src/app/service/HoaDonService';

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
  listSanPhamCT: any[] = [];
  listHoaDonCT: any[] = [];


  constructor(private auth: AuthenticationService, private router: Router,
    private hoaDonCTService: HoaDonCTService,
    private hoaDonService: HoaDonService,
    private apiService: DanhMucService,
    private sanPhamCTService: SanPhamCTService) {
    // Khởi tạo danhMucForm ở đâ
  }

  ngOnInit(): void {
    this.loadHoaDon();
    this.getAllSanPham();
    // api get all hoa don

  }

  
  getHoaDonChiTietByIdHoaDon(id: string) {
      this.hoaDonCTService.getListHoaDonCTByIdHoaDon(id)
      .subscribe(
        response => {
          this.listHoaDonCT = response.result;
          console.log(this.listHoaDonCT)
        } 
      )
  }


  // => list hoa don
  loadHoaDon(): void {
    this.hoaDonService.getAll()
      .subscribe(
        (response: ApiResponse<any>) => this.handleApiResponse(response),
        (error: any) => console.error('Error loading invoices:', error)
      );
  }

  // => list san pham chi tiet
  getAllSanPham(): void {
    this.sanPhamCTService.getAll().subscribe(
      res => {
        this.listSanPhamCT = res.result;
        console.log(this.listSanPhamCT)
      }
    )
  }

  // => list hoa don
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
    if (this.listHoaDon.length >= this.maxHoaDon) {
      this.openModal();
      return;
    }
    this.hoaDonCTService.createHoaDonCT(this.hoaDon).subscribe(data => {
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
