import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ApiResponse} from "../model/ApiResponse";
import { MauSacDto } from '../model/mau-sac-dto.model';


@Injectable({
    providedIn: 'root'
  })
  export class MauSacService {

    apiUrl = 'https://datn-5iv4.onrender.com/api/mau-sac';

    constructor(private http: HttpClient) {}


      getMauSac(page: number, size: number): Observable<ApiResponse<any>> {
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


      getAllMauSac(): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');
        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`, { headers });
    }

      createMauSac(mauSac: MauSacDto): Observable<ApiResponse<MauSacDto>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post<ApiResponse<MauSacDto>>(`${this.apiUrl}` +'/create', mauSac, { headers });
      }



      deleteMauSac(id: string): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {headers});
      }

      openMauSac(id: string): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/open/${id}`, {headers});
      }


      findById(id: string): Observable<ApiResponse<MauSacDto>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<ApiResponse<MauSacDto>>(`${this.apiUrl}/${id}`, {headers});
      }

      updateMauSac(id: string, mauSacData: MauSacDto): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, mauSacData, { headers });
      }
  getAll(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`, { headers });
  }


  getAllMauSacDangHoatDong(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll/dang-hoat-dong`, { headers });
  }

  getAllColors(): Observable<ApiResponse<any>> {

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`);
  }

  }
