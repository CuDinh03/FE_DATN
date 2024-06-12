
import { ApiResponse } from '../model/ApiResponse';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";


@Injectable({
    providedIn: 'root'
  })
  export class HoaDonService {


    apiUrl = 'http://localhost:9091/api/hoa-don';


    constructor(private http: HttpClient) {}


    getAll(): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`, { headers });
    }


    // Phương thức lấy hóa đơn theo ID
    getHoaDonById(id: string): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`, { headers });
    }    getHoaDonByMa(ma: string): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/find/${ma}`, { headers });
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

        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/allPage`, { params, headers });
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
  
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getHoaDonsByTranThai/${trangThai}`, { params, headers });
    }
}

