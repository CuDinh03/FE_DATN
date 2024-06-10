import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ApiResponse} from "../model/ApiResponse";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {KhachHangDto} from "../model/khachHangDto";

@Injectable({
  providedIn: 'root'
})
export class KhachHangService{
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

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`, {params, headers});
  }

  getKhachHang(sdt: string): Observable<ApiResponse<any>>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${sdt}`, {headers});
  }

  
  getAllKhachHang(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`, { headers });
}

  createKhachHang(khach: KhachHangDto):Observable<ApiResponse<KhachHangDto>>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ApiResponse<KhachHangDto>>(this.apiUrl + '/create', khach,{headers});
  }

  deleteKhachHang(id: string): Observable<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {headers});
  }

  openKhachHang(id: string): Observable<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/open/${id}`, {headers});
  }


  findById(id: string): Observable<ApiResponse<KhachHangDto>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<KhachHangDto>>(`${this.apiUrl}/${id}`, {headers});
  }
  
  updateKhachHang(id: string, khachHangData: KhachHangDto): Observable<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, khachHangData, { headers });
  }

  
  findKhachHangByTenDangNhap(tenDangNhap: string): Observable<ApiResponse<any>>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/findUsername/${tenDangNhap}`, {headers});
  }
}
