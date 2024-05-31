import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../model/ApiResponse";


@Injectable({
    providedIn: 'root'
})

export class HoaDonService {

    apiUrl = 'http://localhost:9091/api/hoa-don';

    constructor(private http: HttpClient) { }

    getAll(): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`, { headers });
    }

    
    // Phương thức lấy hóa đơn theo ID
    getHoaDonById(id: string): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');

        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`, { headers });
    }
}