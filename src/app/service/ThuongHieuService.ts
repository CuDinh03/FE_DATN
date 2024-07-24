import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ApiResponse} from "../model/ApiResponse";
import { ThuongHieuDto } from '../model/thuong-hieu-dto.model';


@Injectable({
    providedIn: 'root'
  })
  export class ThuongHieuService {

    apiUrl = 'https://datn-5iv4.onrender.com/api/thuong-hieu';

    constructor(private http: HttpClient) {}


      getThuongHieu(page: number, size: number): Observable<ApiResponse<any>> {
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


      getAllThuongHieu(): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');
        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`, { headers });
    }

      createThuongHieu(thuongHieu: ThuongHieuDto): Observable<ApiResponse<ThuongHieuDto>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post<ApiResponse<ThuongHieuDto>>(`${this.apiUrl}` +'/create', thuongHieu, { headers });
      }



      deleteThuongHieu(id: string): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {headers});
      }

      openThuongHieu(id: string): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/open/${id}`, {headers});
      }


      findById(id: string): Observable<ApiResponse<ThuongHieuDto>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<ApiResponse<ThuongHieuDto>>(`${this.apiUrl}/${id}`, {headers});
      }

      updateThuongHieu(id: string, thuongHieuData: ThuongHieuDto): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, thuongHieuData, { headers });
      }


  getAll(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`, { headers });
  }

  getAllThuongHieuDangHoatDong(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll/dang-hoat-dong`, { headers });
  }



}
