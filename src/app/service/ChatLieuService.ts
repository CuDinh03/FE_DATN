import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../model/ApiResponse";


@Injectable({
    providedIn: 'root'
})

export class ChatLieuService {

    apiUrl = 'http://localhost:9091/api/chat-lieu';

    constructor(private http: HttpClient) {
    }

    // 1. get all 
    getAllChatLieuDangHoatDong(): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');
        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll/dang-hoat-dong`, { headers });
    }

    

}