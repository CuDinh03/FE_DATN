import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiResponse} from "../model/ApiResponse";
import {Observable} from "rxjs";
import {TaiKhoanDto} from "../model/tai-khoan-dto.model";



@Injectable({
  providedIn: 'root'
})
export class NhanVienService {

  apiUrl : string = 'http://localhost:9091/api/nguoi-dung';

  constructor(private http: HttpClient) { }

  findByUserName(taiKhoanDto: TaiKhoanDto): Observable<ApiResponse<TaiKhoanDto>> {
    const token:string| null = localStorage.getItem('token');

    const  headers= new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<TaiKhoanDto>>(`${this.apiUrl}/${taiKhoanDto.tenDangNhap}`,{ headers });
  }

}
