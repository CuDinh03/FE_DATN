import { ApiResponse } from '../model/ApiResponse';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {HoaDonChiTietDto} from "../model/hoa-don-chi-tiet.model";

@Injectable({
    providedIn: 'root'
  })
  export class HoaDonChiTietService {

    apiUrl = `${environment.apiUrl}/hoa-don-chi-tiet`;


    constructor(private http: HttpClient) {}

  getAll(id: string): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all/${id}`, {headers});
      }

  getAllByKhachHang(id: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/allKh/${id}`, { headers });
  }

  findById(id: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`, { headers });
  }

  getThongKeSanPham(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/thong-ke-san-pham-ban-nhieu-nhat`, {headers});
  }

  }
