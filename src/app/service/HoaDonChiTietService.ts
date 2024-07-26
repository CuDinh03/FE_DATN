import { ApiResponse } from '../model/ApiResponse';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {HoaDonSua} from "../model/HoaDonSua";
import {HoaDonChiTietDto} from "../model/hoa-don-chi-tiet.model";


@Injectable({
    providedIn: 'root'
  })
  export class HoaDonChiTietService {

    apiUrl = 'https://datn-5iv4.onrender.com/api/hoa-don-chi-tiet';


    constructor(private http: HttpClient) {}

      getAll(id: string): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all/${id}`, {headers});
      }

  getAllBỵKhachHang(id: string): Observable<ApiResponse<any>> {
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
