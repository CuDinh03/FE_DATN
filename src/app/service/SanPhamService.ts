import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ApiResponse} from "../model/ApiResponse";
import { SanPhamDto } from '../model/san-pham-dto.model';

@Injectable({
    providedIn: 'root'
  })
  export class SanPhamService {

    apiUrl = 'http://localhost:9091/api/san-pham';

    constructor(private http: HttpClient) {}


      getSanPham(page: number, size: number): Observable<ApiResponse<any>> {
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


      getAllSanPham(): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');
        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`, { headers });
    }

      createSanPham(sanPham: SanPhamDto): Observable<ApiResponse<SanPhamDto>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post<ApiResponse<SanPhamDto>>(`${this.apiUrl}` +'/create', sanPham, { headers });
      }



      deleteSanPham(id: string): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {headers});
      }

      openSanPham(id: string): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/open/${id}`, {headers});
      }


      findById(id: string): Observable<ApiResponse<SanPhamDto>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<ApiResponse<SanPhamDto>>(`${this.apiUrl}/${id}`, {headers});
      }

      updateSanPham(id: string, sanPhamData: SanPhamDto): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, sanPhamData, { headers });
      }

  getAll(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`, { headers });
  }

  getAllSanPhamDangHoatDong(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll/dang-hoat-dong`, { headers });
  }

  

}
