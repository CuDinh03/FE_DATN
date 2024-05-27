import { Component } from '@angular/core';
import {TaiKhoanDto} from "../../model/tai-khoan-dto.model";
import {TaiKhoanService} from "../../service/TaiKhoanService";
import {KhachHangDto} from "../../model/khachHangDto";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  taiKhoanInfo: KhachHangDto | undefined;

  constructor(private taiKhoanService: TaiKhoanService) {}

  ngOnInit(): void {
    this.getMyInfo();
  }

  getMyInfo(): void {
    this.taiKhoanService.getMyInfo()
      .subscribe(response => {
        this.taiKhoanInfo = response.result; // Lấy thông tin tài khoản từ response
      }, error => {
        console.error('Error while fetching my info:', error);
      });
  }
}
