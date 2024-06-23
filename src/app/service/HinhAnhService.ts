import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ApiResponse} from "../model/ApiResponse";
import { HinhAnhDto } from '../model/hinh-anh-dto.model';



@Injectable({
    providedIn: 'root'
  })
  export class HinhAnhService {
  
    apiUrl = 'http://localhost:9091/api/hinh-anh';
  
    constructor(private http: HttpClient) {}
  
    
      getHinhAnh(page: number, size: number): Observable<ApiResponse<any>> {
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

      
      getAllHinhAnh(): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');
        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`, { headers });
    }

      createHinhAnh(hinhAnh: HinhAnhDto): Observable<ApiResponse<HinhAnhDto>> {
        const token = localStorage.getItem('token');
    
        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        return this.http.post<ApiResponse<HinhAnhDto>>(`${this.apiUrl}` +'/create', hinhAnh, { headers });
      }



      deleteHinhAnh(id: string): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {headers});
      }

      openHinhAnh(id: string): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/open/${id}`, {headers});
      }


      findById(id: string): Observable<ApiResponse<HinhAnhDto>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        return this.http.get<ApiResponse<HinhAnhDto>>(`${this.apiUrl}/${id}`, {headers});
      }
      
      updateHinhAnh(id: string, hinhAnhData: HinhAnhDto): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, hinhAnhData, { headers });
      }
  
  
  }