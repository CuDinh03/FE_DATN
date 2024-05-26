import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DanhMucDto } from 'src/app/model/danh-muc-dto.model';
import { DanhMucService } from 'src/app/service/DanhMucService';
import { TaiKhoanService } from 'src/app/service/TaiKhoanService';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent {
  
  danhMuc: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  danhMucForm: FormGroup = new FormGroup({});
  

  constructor(private apiService: DanhMucService, private formBuilder: FormBuilder,
    
    private router: Router) {}

  ngOnInit(): void {
    this.loadDanhMuc();
  }

  loadDanhMuc(): void {
    this.apiService.getDanhMuc(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.danhMuc = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page; 
    this.loadDanhMuc();
  }
  createDanhMuc(): void {
    const danhMucData: DanhMucDto = this.danhMucForm.value;
    this.apiService.createDanhMuc(danhMucData).subscribe(data => {
      console.log(data);
      this.router.navigate(['/all']);
    }, err => console.log(err));
  }
}
