import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ApiResponse} from "../model/ApiResponse";
import { DanhMucDto } from '../model/danh-muc-dto.model';

@Injectable({
    providedIn: 'root'
  })
  export class DanhMucService {
  
    apiUrl = 'http://localhost:9091/api/danh-muc';
  
  
    constructor(private http: HttpClient) {}
  
      getDanhMuc(page: number, size: number): Observable<ApiResponse<any>> {
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

      createDanhMuc(danhMuc: DanhMucDto): Observable<ApiResponse<DanhMucDto>> {
        const token = localStorage.getItem('token');
    
        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        return this.http.post<ApiResponse<DanhMucDto>>(`${this.apiUrl}` +'/create', danhMuc, { headers });
      }

      
  
  
  }