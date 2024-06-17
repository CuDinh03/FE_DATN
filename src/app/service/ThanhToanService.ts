import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../model/ApiResponse";
import {ThanhToanDto} from "../model/thanh-toan-dto.model";
import {ThanhToanOnl} from "../model/thanh-toan-onl";

@Injectable({
    providedIn: 'root'
})
export class ThanhToanService {

    apiUrl: string = 'http://localhost:9091/api/thanhtoan';

    constructor(private http: HttpClient) {
    }

    thanhToan(thanhToanDto: ThanhToanDto): Observable<ApiResponse<ThanhToanDto>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.post<ApiResponse<ThanhToanDto>>(`${this.apiUrl}`, thanhToanDto, {headers});
    }

    thanhToanOnle(thanhToanOnl: ThanhToanOnl): Observable<ApiResponse<ThanhToanOnl>>{
        const token =localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.post<ApiResponse<ThanhToanOnl>>(`${this.apiUrl}/onl`, thanhToanOnl, {headers});

    }


}
