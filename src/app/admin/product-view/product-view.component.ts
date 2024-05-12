import { Component } from '@angular/core';
import { DanhMucService } from 'src/app/service/DanhMucService';

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
  

  constructor(private apiService: DanhMucService) {}

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

}
