import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ApiResponse} from "../model/ApiResponse";
import {TaiKhoanDto} from "../model/tai-khoan-dto.model";
import {KhachHangDto} from "../model/khachHangDto";
import {DangNhapDto} from "../model/dangNhapDto";

@Injectable({
  providedIn: 'root'
})
export class TaiKhoanService {

  apiUrl = 'https://datn-5iv4.onrender.com/api/users';

  constructor(private http: HttpClient) {

  }

  getAccounts(page: number, size: number): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`, {params, headers});
  }


  checkUsernameExists(username: string | undefined): Observable<ApiResponse<TaiKhoanDto>> {
    return this.http.post<ApiResponse<TaiKhoanDto>>(`${this.apiUrl}/check-username`, { tenDangNhap: username });
  }

  checkEmailExists(email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/check-email`, { email: email });
  }


  getAccountsByRoles(page: number, size: number, role: any): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('page', page.toString());

    // Kiểm tra giá trị size
    if (size === 0) {
      // Thay đổi giá trị size thành một giá trị mặc định, ví dụ: 5
      size = 5;
    }
    params = params.append('size', size.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all/${role}`, {params, headers});
  }

  createAccount(accountData: DangNhapDto): Observable<ApiResponse<DangNhapDto>> {
    return this.http.post<ApiResponse<DangNhapDto>>(this.apiUrl + '/create', accountData);
  }

  getAccountById(id: string): Observable<ApiResponse<TaiKhoanDto>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<TaiKhoanDto>>(`${this.apiUrl}/${id}`, {headers});
  }



  // =>  ID, Ten, chuc Vu ()
  getMyInfo(): Observable<ApiResponse<KhachHangDto>> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<KhachHangDto>>(`${this.apiUrl}/myInfo`, {headers});
  }



  updateAccount(id: string, accountData: TaiKhoanDto): Observable<ApiResponse<TaiKhoanDto>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<ApiResponse<TaiKhoanDto>>(`${this.apiUrl}/${id}`, accountData, {headers});
  }

  deleteAccount(id: string): Observable<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {headers});
  }

  getAllTaiKhoan(): Observable<ApiResponse<TaiKhoanDto[]>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<TaiKhoanDto[]>>(`${this.apiUrl}/getAll`, { headers });
}

  openAccount(id: string): Observable<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/open/${id}`, {headers});
  }


}
