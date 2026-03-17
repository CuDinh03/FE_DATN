import { ApiResponse } from '../model/ApiResponse';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class HoaDonGioHangService {

    apiUrl = `${environment.apiUrl}/hoa-don-gio-hang`;


    constructor(private http: HttpClient) {}

      getAll(): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`, {headers});
      }

      createHoaDon(gioHangHoaDon: any): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post<ApiResponse<any>>(`${this.apiUrl}` +'/create', gioHangHoaDon, { headers });
      }



  }
