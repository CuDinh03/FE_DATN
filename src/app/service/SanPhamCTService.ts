import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../model/ApiResponse";
import { ChiTietSanPhamDto } from "../model/chi-tiet-san-pham-dto.model";


@Injectable({
  providedIn: 'root'
})

export class SanPhamCTService {

  apiUrl = 'http://localhost:9091/api/chi-tiet-san-pham';

  constructor(private http: HttpClient) {
  }

  // All sản phẩm chi tiết
  getSanPhamChiTiet(page: number, size: number): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`, { params, headers });
  }

  // All sản phẩm chi tiết sắp xếp theo ngày tạo
  getSanPhamChiTietSapXepByNGayTao(page: number, size: number): Observable<ApiResponse<any>> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all/sap-xep-ngay-tao`, { params, headers });
  }

  // All Không phân trang
  getAllSanPhamChiTiet(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`, { headers });
  }

  // Get chitietSanPham by id 
  getChiTietSanPhamById(id: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`, { headers });
  }


  // Update trạng thái hoạt động => dừng HĐ
  updateTrangThaiById(id: string): Observable<ApiResponse<any>> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const options = {
      headers: headers,
      responseType: 'text' as 'json'
    };

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/updateTrangThai/${id}`, options);
  }


  // Thêm sản phẩm chi tiết 
  themSanPhamChiTiet(sanPhamChiTiet: ChiTietSanPhamDto): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/add`, sanPhamChiTiet, { headers });
  }

  // Sửa sản phẩm chi tiết 
  suaSanPhamChiTiet(sanPhamChiTiet: ChiTietSanPhamDto, id : string): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/update/${id}`, sanPhamChiTiet, { headers });
  }

}