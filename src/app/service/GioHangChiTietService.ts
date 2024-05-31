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
    
        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all/${id}`, {headers});
      }

     
  
  
  }