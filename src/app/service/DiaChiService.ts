import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ApiResponse} from "../model/ApiResponse";
import { DanhMucDto } from '../model/danh-muc-dto.model';

@Injectable({
  providedIn: 'root'
})
export class DiaChiService {

  apiUrl = 'https://datn-5iv4.onrender.com/api/thong-tin-dat-hang';

  constructor(private http: HttpClient) {}

  getAllByIdKhachHang(id: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all/${id}`, { headers });
  }
}
