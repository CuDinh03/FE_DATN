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

interface SanPham {
  id: string;
  ten: string;
  ma: string;
  ngayTao: string;
  ngaySua: string;
  trangThai: boolean;
}

interface HinhAnh {
  id: string;
  ma: string;
  url: string;
  ngayTao: string;
  ngaySua: string;
  trangThai: boolean;
}

interface ThuongHieu {
  id: string;
  ten: string;
  ma: string;
  ngayTao: string;
  ngaySua: string;
  trangThai: boolean;
}

interface ChatLieu {
  id: string;
  ma: string;
  ten: string;
  ngayTao: string;
  ngaySua: string;
  trangThai: boolean;
}

interface DanhMuc {
  id: string;
  ma: string;
  ten: string;
  ngayTao: string;
  ngaySua: string;
  trangThai: boolean;
}

interface KichThuoc {
  id: string;
  ten: string;
  ma: string;
  ngayTao: string;
  ngaySua: string;
  trangThai: boolean;
}

interface MauSac {
  id: string;
  ten: string;
  ma: string;
  ngayTao: string;
  ngaySua: string;
  trangThai: boolean;
}


interface ChiTietSanPhamDto {
  id : string;
  ma : string;
  idSanPham: SanPham;
  idHinhAnh : HinhAnh;
  idThuongHieu: ThuongHieu;
  idChatLieu: ChatLieu;
  idDanhMuc: DanhMuc;
  idKichThuoc : KichThuoc;
  idMauSac: MauSac;
  trangThai: boolean;
  giaBan: number;
  soLuong: number;
}


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


  chiTietSanPham: ChiTietSanPhamDto[] = [];
  currentPage = 0;
  totalPages = 0;


  constructor(private auth: AuthenticationService, private router: Router,
    private hoaDonCTService: HoaDonCTService,
    private hoaDonService: HoaDonService,
    private apiService: DanhMucService,
    private sanPhamCTService: SanPhamCTService) {
    // Khởi tạo danhMucForm ở đâ
  }

  ngOnInit(): void {
    this.loadHoaDon();
    this.loadSanPhamChiTiet();

    // this.getAllSanPham();
  }


  loadSanPhamChiTiet(){
    this.sanPhamCTService.getSanPhamChiTiet(this.currentPage, 5)
    .subscribe(respone => {
      this.chiTietSanPham = respone.result.content;
      this.totalPages = respone.result.totalPages;
      console.log(this.sanPhamCTService);
    })
  }

  nextPage(){
    if(this.currentPage < this.totalPages -1){
      this.currentPage ++;
      this.loadSanPhamChiTiet();
    }
  }

  prevPage(){
    if(this.currentPage > 0){
      this.currentPage --;
      this.loadSanPhamChiTiet();
    }
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
  // getAllSanPham(): void {
  //   this.sanPhamCTService.getAll().subscribe(
  //     res => {
  //       this.listSanPhamCT = res.result;
  //       console.log(this.listSanPhamCT)
  //     }
  //   )
  // }

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
