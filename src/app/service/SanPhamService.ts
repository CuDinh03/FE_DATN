import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../model/ApiResponse";


@Injectable({
    providedIn: 'root'
  })

  export class SanPhamService {
  
    apiUrl = 'http://localhost:9091/ct-san-pham';
  
    constructor(private http: HttpClient) {}


    getAll(): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');
    
        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`, {headers});
      }
  }