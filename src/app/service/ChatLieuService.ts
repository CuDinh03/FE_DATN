import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ApiResponse} from "../model/ApiResponse";
import { ChatLieuDto } from '../model/chat-lieu-dto.model';

@Injectable({
    providedIn: 'root'
  })
  export class ChatLieuService {
  
    apiUrl = 'http://localhost:9091/api/chat-lieu';
  
    constructor(private http: HttpClient) {}
  
    
      getChatLieu(page: number, size: number): Observable<ApiResponse<any>> {
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

      
      getAllChatLieu(): Observable<ApiResponse<any>> {
        const token = localStorage.getItem('token');
        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`, { headers });
    }

      createChatLieu(chatLieu: ChatLieuDto): Observable<ApiResponse<ChatLieuDto>> {
        const token = localStorage.getItem('token');
    
        // Thêm token vào header của yêu cầu
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        return this.http.post<ApiResponse<ChatLieuDto>>(`${this.apiUrl}` +'/create', chatLieu, { headers });
      }



      deleteChatLieu(id: string): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {headers});
      }

      openChatLieu(id: string): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/open/${id}`, {headers});
      }


      findById(id: string): Observable<ApiResponse<ChatLieuDto>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        return this.http.get<ApiResponse<ChatLieuDto>>(`${this.apiUrl}/${id}`, {headers});
      }
      
      updateChatLieu(id: string, chatLieuData: ChatLieuDto): Observable<ApiResponse<void>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, chatLieuData, { headers });
      }
  
  
  }