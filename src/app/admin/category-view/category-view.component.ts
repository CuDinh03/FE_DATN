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


@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {

  danhMuc: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  danhMucForm: FormGroup; 
  id: string;
  selectedDanhMuc: any;

  constructor(private apiService: DanhMucService, private formBuilder: FormBuilder,
    private router: Router, private auth: AuthenticationService, private router1: ActivatedRoute) {
      this.danhMucForm = this.formBuilder.group({
        ten: ['', [Validators.required]],
        ma: ['', [Validators.required]],
        trangThai: ['']
      });

      this.id = this.router1.snapshot.params['id'];

      
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
    if (this.danhMucForm.invalid) {
      return;
    }
    const danhMucData: DanhMucDto = this.danhMucForm.value;
    this.apiService.createDanhMuc(danhMucData)
      .subscribe(
        (data: ApiResponse<DanhMucDto>) => {
          console.log(data);
          this.loadDanhMuc;
          this.router.navigate(['/admin/danh-muc']);
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          if (error.error.code === ErrorCode.CATEGORY_EXISTED) {
            this.errorMessage = 'Danh mục đã tồn tại.';
            alert('danh mục đã tồn tại')
          } else if (error.error.code === ErrorCode.USERNAME_INVALID) {
            this.errorMessage = 'Tên danh mục không được để trống.';
          } else if (error.error.code === ErrorCode.PASSWORD_INVALID) {
            this.errorMessage = 'Mã danh mục không được để trống';
          } else {
            this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau.';
          }
        }
      );
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/log-in']).then(() => {
      console.log('Redirected to /log-in');
    }).catch(err => {
      console.error('Error navigating to /log-in:', err);
    });
  }

  delete(id:any) {
    this.apiService.deleteDanhMuc(id).subscribe(response => {
      this.loadDanhMuc();
      this.router.navigate(['/admin/danh-muc']);
    })
  }

  openDanhMuc(id:any) {
    this.apiService.openDanhMuc(id).subscribe(response => {
      this.loadDanhMuc();
      this.router.navigate(['/admin/danh-muc']);
    })

    
  }


}
