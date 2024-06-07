import { Component } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { TaiKhoanDto } from "../../model/tai-khoan-dto.model";
import { TaiKhoanService } from "../../service/TaiKhoanService";
import { KhachHangDto } from "../../model/khachHangDto";
import { KhachHangService } from 'src/app/service/KhachHangService';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  taiKhoanInfo: KhachHangDto | undefined;
  idTaiKhoan: any;
  thongTinKhachHang: any;
  khachHang: any;

  constructor(
    private taiKhoanService: TaiKhoanService,
    private khachHangService: KhachHangService
  ) { }

  ngOnInit(): void {
    // this.getMyInfo();
    this.getIdTaiKhoan();
  }

  // lấy tất cả id, tài khoản, mật khẩu (tai_khoan)
  // getMyInfo(): void {
  //   this.taiKhoanService.getMyInfo()
  //     .subscribe(response => {
  //       this.taiKhoanInfo = response.result;
  //       // Lấy thông tin tài khoản từ response
  //     }, error => {
  //       console.error('Error while fetching my info:', error);
  //     });
  // }

  // Lấy id tài khoản đang đăng nhập (tai_khoan)
  getIdTaiKhoan(): void {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.taiKhoanService.getMyInfo()
      .subscribe(response => {
        this.idTaiKhoan = response.result.id;
        // Sau khi lấy thành công idTaiKhoan, lấy thông tin khách hàng
        this.getKhachHangByIdTaiKhoan(this.idTaiKhoan);
      }, error => {
        console.error('Lỗi khi lấy thông tin tài khoản:', error);
      });
  }

  // Lấy Thông tin khách hàng từ id tài khoản đang đăng nhập
  getKhachHangByIdTaiKhoan(idTaiKhoan: any): void {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.khachHangService.getKhachHangByIdTaiKhoan(idTaiKhoan)
      .subscribe(response => {
        this.khachHang = response.result;
      }, error => {
        console.error('Lỗi khi lấy thông tin khách hàng:', error);
      });
  }

}
