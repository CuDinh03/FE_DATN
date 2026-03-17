import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from "@angular/router";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = `${environment.apiUrl}/auth/log-in`;


  constructor(private http: HttpClient, private router: Router) {
  }

  login(tenDangNhap: string, matKhau: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {tenDangNhap, matKhau}).pipe(
      tap(response => {
        if (response?.result?.token) {
          localStorage.setItem('token', response.result.token);
          const decoded = this.decodeToken(response.result.token);
          if (decoded?.iss) localStorage.setItem('tenDangNhap', decoded.iss);
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

  /** Trả về scope trong JWT (vd: "ROLE_ADMIN" hoặc "ROLE_ADMIN ROLE_STAFF"). */
  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const decoded = JSON.parse(atob(payload));
      return decoded?.scope ?? null;
    } catch {
      return null;
    }
  }

  /** Kiểm tra có phải admin (scope chứa ROLE_ADMIN). */
  isAdmin(): boolean {
    const scope = this.getRole();
    return scope != null && scope.includes('ROLE_ADMIN');
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
