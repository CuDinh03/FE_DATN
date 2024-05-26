import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {TaiKhoanService} from "../../service/TaiKhoanService";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../../service/AuthenticationService";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {ApiResponse} from "../../model/ApiResponse";

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {
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
