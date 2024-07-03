import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../model/ApiResponse";
import {ThanhToanDto} from "../model/thanh-toan-dto.model";
import {ThanhToanOnl} from "../model/thanh-toan-onl";
import {DanhGiaDto} from "../model/danh-gia-dto";

@Injectable({
  providedIn: 'root'
})
export class DanhGiaService {

  apiUrl: string = 'http://localhost:9091/api/danh-gia';

  constructor(private http: HttpClient) {
  }

  createRating(danhGiaDto: DanhGiaDto): Observable<ApiResponse<DanhGiaDto>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ApiResponse<DanhGiaDto>>(`${this.apiUrl}/create`, danhGiaDto, {headers});
  }


}
