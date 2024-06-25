import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TaiKhoanDto } from "../../model/tai-khoan-dto.model";
import { TaiKhoanService } from "../../service/TaiKhoanService";
import { KhachHangDto } from "../../model/khachHangDto";
import { KhachHangService } from 'src/app/service/KhachHangService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { error } from '@angular/compiler-cli/src/transformers/util';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent{

  taiKhoanInfo: KhachHangDto | undefined;
  idTaiKhoan: any;
  thongTinKhachHang: any;
  khachHang: any;
  formKhachHang!: FormGroup;
  isEdit : boolean = false;

  constructor(
    private taiKhoanService: TaiKhoanService,
    private khachHangService: KhachHangService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initFormKhachHang();
    // this.getMyInfo();
    this.getIdTaiKhoan();
  }

  // Lấy id tài khoản đang đăng nhập + Lấy ra thông tin khách hàng
  getIdTaiKhoan(): void {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.taiKhoanService.getMyInfo()
      .subscribe(response => {
        this.taiKhoanInfo = response.result;
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
        this.khachHang.ngaySinh = this.formatDate(this.khachHang.ngaySinh);
      }, error => {
        console.error('Lỗi khi lấy thông tin khách hàng:', error);
      });
  }

  // 1. Khoi tao form
  initFormKhachHang(): void {
    this.formKhachHang = this.formBuilder.group({
      ten: [],
      ngaySinh: [],
      sdt: [],
      email: [],
      diaChi: [],
    })
  }

  // 3. fill value form
  fillValueToForm(khachHang: any): void {
    this.formKhachHang.patchValue({
      ten: khachHang.ten,
      ngaySinh: khachHang.ngaySinh,
      sdt: khachHang.sdt,
      email: khachHang.email,
      diaChi: khachHang.diaChi
    })
  }

  statusTransition() {
    this.isEdit = !this.isEdit;
    // Bat nut edit => fill value form
    if (this.isEdit) {
      this.fillValueToForm(this.khachHang);
    }
  }

  update(): void {
    // nhập đúng validate
    if (this.formKhachHang.valid) {
      // lay ra value form
      // const: bien k the thay doi
      const formValue = this.formKhachHang.value;
      let dataKhachHang = {
        ten: formValue.ten,
        ngaySinh: formValue.ngaySinh,
        sdt: formValue.sdt,
        email: formValue.email,
        diaChi: formValue.diaChi,
        idTaiKhoan: this.taiKhoanInfo
      }
      this.khachHangService.suaKhachHang(this.khachHang.id, dataKhachHang).subscribe(
        res => {
          this.khachHang = res.result;
          this.khachHang.ngaySinh = this.formatDate(this.khachHang.ngaySinh);
          this.isEdit = false;
          alert("Cập nhật thành công");
        }, error => {
          console.log(error);
          alert("Cập nhật thất bại");
        }
      )
    }
  }

  formatDate(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}