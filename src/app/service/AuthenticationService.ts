import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:9091/api/auth/log-in';


  constructor(private http: HttpClient, private router: Router) {
  }

  login(tenDangNhap: string, matKhau: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {tenDangNhap, matKhau}).pipe(
      tap(response => {
        if (response.result && response.result.token) {
          const decodedToken = this.decodeToken(response.result.token);
          if (decodedToken && decodedToken.iss) {
            localStorage.setItem('tenDangNhap', decodedToken.iss);
          }
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    // Kiểm tra xem token có tồn tại trong localStorage không
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');

    console.log(token)
    if (!token) {
      return null;
    }
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.scope;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getTenDangNhap(): string | null {
    return localStorage.getItem('tenDangNhap');
  }


  logout(): void {
    localStorage.clear();

    if (window.location.pathname === '/trang-chu') {
      window.location.reload();
    }

    // Chuyển hướng về trang chủ
    this.router.navigate(['/trang-chu']);
  }

}
