import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaiKhoanService {

  constructor(private http: HttpClient) { }


  getAllAccounts(): Observable<any> {
    return this.http.get<any>('http://localhost:9091/api/users/all');
  }
}
