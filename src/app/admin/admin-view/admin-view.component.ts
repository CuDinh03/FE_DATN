import {Component, OnInit} from '@angular/core';
import {TaiKhoanService} from "../../service/TaiKhoanService";

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit{

  accounts: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;

  startFrom = 1;

  constructor(private apiService: TaiKhoanService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {


    this.apiService.getAccounts(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.accounts = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page; // Không cần trừ 1 ở đây
    this.loadAccounts();
  }



}
