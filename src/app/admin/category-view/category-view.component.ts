import { AuthenticationService } from './../../service/AuthenticationService';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DanhMucDto } from 'src/app/model/danh-muc-dto.model';
import { DanhMucService } from 'src/app/service/DanhMucService';
import {ApiResponse} from "../../model/ApiResponse";

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent {

  danhMuc: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  danhMucForm: FormGroup; // Sử dụng FormGroup để quản lý form và validation


  constructor(private apiService: DanhMucService, private formBuilder: FormBuilder,
    private router: Router, private auth: AuthenticationService) {
      // Khởi tạo danhMucForm ở đây
      this.danhMucForm = this.formBuilder.group({
        // Khai báo các trường trong form tại đây
        ten:[''],
        ma:[''],
        trangThai:['']
      });
  }

  ngOnInit(): void {
    this.loadDanhMuc();
  }
  get f() {
    return this.danhMucForm.controls;
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDanhMuc();
  }

  createDanhMuc(): void {

    this.submitted = true;
    if (this.danhMucForm.invalid){
      return;
    }
    const danhMucData: DanhMucDto = this.danhMucForm.value;
    this.apiService.createDanhMuc(danhMucData)
      .subscribe(
        (data : ApiResponse<DanhMucDto> )  => {
      console.log(data);
      this.router.navigate(['/admin/danh-muc']);
    },
          err => console.log(err));
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
