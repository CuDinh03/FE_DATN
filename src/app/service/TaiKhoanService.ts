import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaiKhoanService {

  accounts: any[] = []; // Định nghĩa mảng chứa danh sách tài khoản

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getAccounts(); // Gọi phương thức để lấy danh sách tài khoản khi component được khởi tạo
  }

  getAccounts() {
    this.http.get<any>('http://localhost:9091/api/users/all').subscribe(
      response => {
        this.accounts = response.result; // Gán danh sách tài khoản từ response vào biến accounts
      },
      error => {
        console.error('Error getting accounts:', error);
      }
    );
  }
}
