
import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {TaiKhoanService} from "../../service/TaiKhoanService";
import { HttpClient } from "@angular/common/http";
import {AuthenticationService} from "../../service/AuthenticationService";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiResponse} from "../../model/ApiResponse";


@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent {
  @ViewChild('accountModal') accountModal!: ElementRef;

  accounts: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;
  account: any;
  role: string = 'ALL';
  successMessage: string='';
  errorMessage: string='';
  selectedAccount: any;

  startFrom = 1;
  private token = this.auth.getToken();


  constructor(private apiService: TaiKhoanService, private http: HttpClient, private auth: AuthenticationService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  resetPageNumber(): void {
    this.currentPage = 0;
  }

  loadAccounts(): void {
    if (this.pageSize > 0) {

      this.apiService.getAccounts(this.currentPage, this.pageSize)
        .subscribe((response: ApiResponse<any>) => {
          this.handleApiResponse(response);
        });
    } else {
      // Xử lý khi size = 0 (ví dụ: hiển thị thông báo lỗi)
      console.log("Invalid size value");
    }
  }

  onRoleChange(event: any): void {
    const role = event.target.value;
    if (role === 'ALL') {
      this.role = 'ALL'; // Cập nhật biến role thành 'ALL'
      this.loadAccounts(); // Gọi phương thức để tải tất cả các tài khoản
    } else {
      this.loadAccountByRole(0, 0, role);
    }
  }

  loadAccountByRole(page: number, size: number, role: string): void {
    this.apiService.getAccountsByRoles(page, size, role)
      .subscribe((response: ApiResponse<any>) => {
        this.handleApiResponse(response);
      });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      if (this.role === 'ALL') {
        this.loadAccounts();
      } else {
        this.loadAccountByRole(this.currentPage, this.pageSize, this.role);
      }
    }
  }

  private handleApiResponse(response: ApiResponse<any>): void {
    if (response && response.result) {
      this.accounts = response.result.content;
      this.totalElements = response.result.totalElements;
      this.totalPages = response.result.totalPages;
    } else {
      this.errorMessage = "Không tìm thấy danh sách tài khoản nào";
    }
  }


  openModal(account: any) {
    this.selectedAccount = account;
    this.showModal();
  }

  private showModal() {
    if (this.accountModal && this.accountModal.nativeElement) {
      this.accountModal.nativeElement.classList.add('show');
      this.accountModal.nativeElement.style.display = 'block';
    }
  }

  closeAccountModal() {
    if (this.accountModal && this.accountModal.nativeElement) {
      this.accountModal.nativeElement.classList.remove('show');
      this.accountModal.nativeElement.style.display = 'none';
    }
  }

  delete(id: any): void {
    this.apiService.deleteAccount(id).subscribe(() => {
      this.loadAccounts();
      this.router.navigate(['/admin/tai-khoan']);
    });
  }
  openAccount(id: any): void {
    this.apiService.openAccount(id).subscribe(() => {
      this.loadAccounts();
      this.router.navigate(['/admin/tai-khoan']);
    });
  }



}
