import { ApiResponse } from '../model/ApiResponse';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";


@Injectable({
    providedIn: 'root'
  })
  export class GioHangChiTietService {
  
    apiUrl = 'http://localhost:9091/api/gio-hang-chi-tiet';
  
  
    constructor(private http: HttpClient) {}
  
    getAll(id: string): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

    
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all/${id}`, { headers });
      }
      
      updateGioHang(id: string, soLuong: number): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        let params = new HttpParams().set('soLuong', soLuong.toString());
    
        return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, null, { headers, params });
      }
  
  
  }