import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ApiResponse} from "../model/ApiResponse";
import { KichThuocDto } from '../model/kich-thuoc-dto.model';


@Injectable({
    providedIn: 'root'
  })
  export class KichThuocService {

    apiUrl = 'http://localhost:9091/api/kich-thuoc';

    constructor(private http: HttpClient) {}

  // 1. get all
  getAll(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`, { headers });
  }


  getAllKichThuocDangHoatDong(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll/dang-hoat-dong`, { headers });
  }


      getKichThuoc(page: number, size: number): Observable<ApiResponse<any>> {
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


      getAllKichThuoc(): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');
        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`, { headers });
    }

      createKichThuoc(kichThuoc: KichThuocDto): Observable<ApiResponse<KichThuocDto>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post<ApiResponse<KichThuocDto>>(`${this.apiUrl}` +'/create', kichThuoc, { headers });
      }



      deleteKichThuoc(id: string): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {headers});
      }

      openKichThuoc(id: string): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/open/${id}`, {headers});
      }


      findById(id: string): Observable<ApiResponse<KichThuocDto>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<ApiResponse<KichThuocDto>>(`${this.apiUrl}/${id}`, {headers});
      }

      updateKichThuoc(id: string, kichThuocData: KichThuocDto): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, kichThuocData, { headers });
      }
  getAllSize(): Observable<ApiResponse<any>> {

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`);
  }

  }
