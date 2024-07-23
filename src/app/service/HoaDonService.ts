import {ApiResponse} from '../model/ApiResponse';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {DanhMucDto} from "../model/danh-muc-dto.model";
import {HoaDonDto} from "../model/hoa-don-dto.model";


@Injectable({
  providedIn: 'root'
})
export class HoaDonService {


  apiUrl = 'https://datn-5iv4.onrender.com/api/hoa-don';


  constructor(private http: HttpClient) {
  }


  getAll(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`, {headers});
  }


  // Phương thức lấy hóa đơn theo ID
  getHoaDonById(id: string | null): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`, {headers});
  }

  getHoaDonByMa(ma: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/find/${ma}`, {headers});
  }

  getHoaDonByMaKH(ma: string, khachHangId: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    let params = new HttpParams();
    params = params.append('khachHangId', khachHangId.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/findHDMaAndKhachHang/${ma}`, {headers, params});
  }


  deleteHoaDon(id: string): Observable<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {headers});
  }

  getHoaDon(page: number, size: number): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/allPage`, {params, headers});
  }

  getHoaDonsByTranThai(trangThai: number, page: number, size: number): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getHoaDonsByTranThai/${trangThai}`, {params, headers});
  }

  updateTrangThai(id: string, trangThai: number): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('trangThai', trangThai.toString())

    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/updateTrangThai/${id}`, null, {params, headers});
  }

  updateTrangThainew(id: string, trangThai: number, hoaDonDto: HoaDonDto): Observable<ApiResponse<HoaDonDto>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('trangThai', trangThai.toString())

    return this.http.put<ApiResponse<HoaDonDto>>(`${this.apiUrl}/updateTrangThai/${id}`, hoaDonDto, {params, headers});
  }

  findHoaDonByIdKhachHang(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/findByKhachHang/${id}`, {headers});
  }

  getHoaDonsByTrangThaiAndKhachHang(trangThai: number, khachHangId: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('trangThai', trangThai.toString());
    params = params.append('khachHangId', khachHangId);

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/byTrangThaiAndKhachHang`, {params, headers});
  }

  getHoaDonBetweenDates(startDate: string, endDate: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('startDate', startDate.toString());
    params = params.append('endDate', endDate.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/find-time`, {params, headers});
  }

  getThongKeDoanhThu(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/doanhthu`, {headers});
  }

  getThongKeDonHang(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/soluong`, {headers});
  }

  yeuCauSuaHoaDon(id: string, payload: any): Observable<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/yeuCauSuaHoaDon/${id}`, payload, { headers });
  }

  getDoanhThuTheoThang(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/thongke/doanhthu/thang"`, {headers});
  }

}

