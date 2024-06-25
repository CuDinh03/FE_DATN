import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../model/ApiResponse";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { KhachHangDto } from "../model/khachHangDto";

@Injectable({
  providedIn: 'root'
})
export class KhachHangService {

  apiUrl = 'http://localhost:9091/api/khs';

  constructor(private http: HttpClient) {
  }

  getKhs(page: number, size: number): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`, { params, headers });
  }
  
  getKhachHang(sdt: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${sdt}`, { headers });
  }

  themKhachHang(khach: KhachHangDto): Observable<ApiResponse<KhachHangDto>> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ApiResponse<KhachHangDto>>(this.apiUrl + '/create', khach, { headers });
  }

  // ==> Call api Lấy ra khách hàng từ Id Tài khoản
  getKhachHangByIdTaiKhoan(idTaiKhoan: string): Observable<ApiResponse<any>> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getKHByIdTaiKhoan/${idTaiKhoan}`, { headers });
  }
  
  // ==> Lấy khách hàng theo id 
  getKhachHangByID(id: string): Observable<ApiResponse<any>> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/detail/${id}`, { headers });
  }

  // ==> Update khách hàng
  suaKhachHang(id: string, khachHang: any): Observable<ApiResponse<any>> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/update/${id}`,khachHang, { headers });
  }
  
  findKhachHangByTenDangNhap(tenDangNhap: string): Observable<ApiResponse<any>>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/findUsername/${tenDangNhap}`, {headers});
  }
}
